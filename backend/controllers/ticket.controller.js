import Ticket from "../models/ticket.js";
import logger from "../utils/logger.js";

// CREATE TICKET
export const createTicket = async (req, res, next) => {
    try {
        const { name, email, issue } = req.body;

        if (!name || !email || !issue) {
            return res.status(400).json({ success: false, status: 400, message: "Name, email, and issue are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, status: 400, message: "Invalid email address" });
        }

        const ticket = await Ticket.create({ name, email, issue });

        logger.info("Support ticket created", { ticketId: ticket._id, email });
        res.status(201).json({ message: "Ticket created", ticket });

    } catch (error) {
        next(error);
    }
};

// GET ALL TICKETS
export const getTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
};

// RESOLVE TICKET
export const resolveTicket = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { status: "Resolved" },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ success: false, status: 404, message: "Ticket not found" });
        }

        logger.info("Ticket resolved", { ticketId: id });
        res.status(200).json({ message: "Ticket resolved", ticket });

    } catch (error) {
        next(error);
    }
};