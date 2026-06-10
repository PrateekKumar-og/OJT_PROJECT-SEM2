import express from "express";
import { createLoan, getLoans, updateLoan, deleteLoan } from "../controllers/loan.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE LOAN
router.post("/", protect, createLoan);

// GET ALL LOANS
router.get("/", protect, getLoans);

// PAY EMI (update paid amount)
router.put("/:id/pay", protect, updateLoan);

// DELETE LOAN
router.delete("/:id", protect, deleteLoan);

export default router;