import express from "express";
import { createLoan, getLoans, deleteLoan } from "../controllers/loan.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { loanSchema } from "../validators/loan.validator.js";

const router = express.Router();

// CREATE LOAN (validated)
router.post("/", protect, validate(loanSchema), createLoan);

// GET ALL LOANS
router.get("/", protect, getLoans);

// DELETE LOAN
router.delete("/:id", protect, deleteLoan);

export default router;