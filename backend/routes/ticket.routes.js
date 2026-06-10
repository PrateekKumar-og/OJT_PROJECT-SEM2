import express from "express";
import {
    createTicket,
    getTickets,
    resolveTicket
} from "../controllers/ticket.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { ticketSchema } from "../validators/ticket.validator.js";

const router = express.Router();

// CREATE (validated)
router.post("/", protect, validate(ticketSchema), createTicket);

// GET ALL
router.get("/", protect, getTickets);

// RESOLVE
router.put("/:id", protect, resolveTicket);

export default router;