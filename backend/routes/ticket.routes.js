import express from "express";
import {
    createTicket,
    getTickets,
    resolveTicket
} from "../controllers/ticket.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, createTicket);

// GET ALL
router.get("/", protect, getTickets);

// RESOLVE
router.put("/:id", protect, resolveTicket);

export default router;