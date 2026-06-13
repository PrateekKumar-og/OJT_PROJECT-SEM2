import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// LOGGER (must be imported before anything that might log)
import logger from "./utils/logger.js";

// MIDDLEWARE
import requestLogger from "./middleware/requestLogger.js";
import errorHandler  from "./middleware/errorHandler.js";

// ROUTES
import authRoutes        from "./routes/auth.routes.js";
import loanRoutes        from "./routes/loan.routes.js";
import ticketRoutes      from "./routes/ticket.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import paymentRoutes     from "./routes/payment.routes.js";

dotenv.config();

const app = express();

// ── SECURITY & PARSING MIDDLEWARE ────────────────────────────────────────────
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());

// ── REQUEST LOGGING ──────────────────────────────────────────────────────────
app.use(requestLogger);

// ── ROOT HEALTH CHECK ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ success: true, message: "API running..." });
});

// ── DB CONNECTION ────────────────────────────────────────────────────────────
connectDB();

// ── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/loans",        loanRoutes);
app.use("/api/tickets",      ticketRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payments",     paymentRoutes);

// ── 404 HANDLER — must come after all routes ─────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        status:  404,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ── CENTRALIZED ERROR HANDLER — must be last ──────────────────────────────────
app.use(errorHandler);

// ── SERVER ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV || "development" });
});

// ── HANDLE UNCAUGHT ERRORS ───────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
    logger.error("UNCAUGHT EXCEPTION — shutting down", {
        error: err.message,
        stack: err.stack,
    });
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.error("UNHANDLED REJECTION — shutting down", {
        reason: String(reason),
    });
    server.close(() => process.exit(1));
});