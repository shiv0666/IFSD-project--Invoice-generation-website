// src/pages/Dashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    clientName: "",
    clientEmail: "",
    amount: "",
    description: "",
  });
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);

  //  Load invoices on mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/invoices");
        setInvoices(res.data);
      } catch (err) {
        console.error("Error loading invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  //  Logout function (redirects to login)
  const handleLogout = () => {
    logout(); // clears localStorage + token
    navigate("/login"); // redirect to login page
  };

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/invoices", invoice);
      setMessage(" Invoice created successfully!");
      setInvoice({ clientName: "", clientEmail: "", amount: "", description: "" });
      setInvoices([...invoices, res.data]);
    } catch (error) {
      console.error(error);
      setMessage(" Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      setDownloading(id);
      const response = await api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("❌ Failed to download invoice.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>🧾 Invoice Generator Dashboard</h2>
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>

        <div style={styles.card}>
          <h3>Create New Invoice</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              name="clientName"
              placeholder="Client Name"
              value={invoice.clientName}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="clientEmail"
              type="email"
              placeholder="Client Email"
              value={invoice.clientEmail}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount (₹)"
              value={invoice.amount}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="description"
              placeholder="Description"
              value={invoice.description}
              onChange={handleChange}
              style={styles.input}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Generating..." : "Generate Invoice"}
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </div>

        <div style={styles.invoiceList}>
          <h3>Your Invoices</h3>
          {invoices.length === 0 ? (
            <p>No invoices yet.</p>
          ) : (
            <ul style={styles.list}>
              {invoices.map((inv) => (
                <li key={inv._id} style={styles.listItem}>
                  <span>
                    <strong>{inv.clientName}</strong> — ₹{inv.amount} ({inv.description})
                  </span>
                  <button
                    onClick={() => handleDownload(inv._id)}
                    style={{
                      ...styles.download,
                      opacity: downloading === inv._id ? 0.6 : 1,
                    }}
                    disabled={downloading === inv._id}
                  >
                    {downloading === inv._id ? "Downloading..." : "Download PDF"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #74ebd5, #9face6)",
    padding: "50px 0",
    fontFamily: "Poppins, sans-serif",
  },
  container: {
    width: "90%",
    maxWidth: "850px",
    backgroundColor: "white",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  logout: {
    backgroundColor: "#ff4b5c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "0.3s",
  },
  card: { marginTop: "10px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  button: {
    backgroundColor: "#4a90e2",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  message: { marginTop: "10px", fontWeight: "bold", color: "#333" },
  invoiceList: { marginTop: "40px" },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  download: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
