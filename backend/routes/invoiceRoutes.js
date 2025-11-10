// backend/routes/invoiceRoutes.js
import express from "express";
import { createInvoice, downloadInvoice } from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route (to confirm it's loaded)
router.get("/test", (req, res) => {
  res.send("Invoice route loaded");
});

// Create new invoice
router.post("/", protect, createInvoice);

// Download an invoice as PDF
router.get("/:id/pdf", downloadInvoice);  // 🔓 remove protect temporarily


export default router;
