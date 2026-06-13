/**
 * Centralized error handler middleware.
 *
 * All controllers call next(error) instead of sending 500 directly.
 * This middleware catches those errors and returns a standardized JSON response:
 *
 *   {
 *     "success": false,
 *     "status":  500,
 *     "message": "Something went wrong",
 *     "stack":   "..." // only in development
 *   }
 *
 * Known operational errors (e.g. CastError, ValidationError) are mapped to
 * appropriate HTTP status codes and friendly messages.
 */

import logger from "../utils/logger.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Map known Mongoose / JWT error types to HTTP-friendly objects.
 */
function normalizeError(err) {
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        return { status: 400, message: `Invalid ${err.path}: ${err.value}` };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {}).join(", ");
        return { status: 409, message: `Duplicate value for field: ${field}` };
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((e) => e.message)
            .join("; ");
        return { status: 400, message };
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return { status: 401, message: "Invalid token" };
    }
    if (err.name === "TokenExpiredError") {
        return { status: 401, message: "Token expired — please log in again" };
    }

    // Default: use the error's own status/message if provided
    return {
        status: err.status || err.statusCode || 500,
        message: err.message || "Internal Server Error",
    };
}

// ── Middleware ────────────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    const { status, message } = normalizeError(err);

    // Log the error with context
    logger.error(message, {
        status,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
    });

    const body = {
        success: false,
        status,
        message,
    };

    // Include stack trace in development for easier debugging
    if (process.env.NODE_ENV !== "production") {
        body.stack = err.stack;
    }

    res.status(status).json(body);
};

export default errorHandler;
