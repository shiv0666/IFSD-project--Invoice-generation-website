// backend/controllers/invoiceController.js
import Invoice from "../models/Invoice.js";
import PDFDocument from "pdfkit";
import fs from "fs";

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, amount, description } = req.body;

    const invoice = await Invoice.create({
      user: req.user._id,
      clientName,
      clientEmail,
      amount,
      description,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download invoice as PDF
export const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("user");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Set response headers — so browser knows it’s a PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice._id}.pdf`);

    // Stream PDF directly to response (no file system delay)
    const doc = new PDFDocument();
    doc.pipe(res);

    // Add content
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Client Name: ${invoice.clientName}`);
    doc.text(`Client Email: ${invoice.clientEmail}`);
    doc.text(`Amount: ₹${invoice.amount}`);
    doc.text(`Description: ${invoice.description}`);
    doc.text(`Date: ${new Date(invoice.date).toDateString()}`);

    doc.end(); // send it!

  } catch (error) {
    console.error("PDF error:", error);
    res.status(500).json({ message: "Failed to generate invoice PDF" });
  }
};