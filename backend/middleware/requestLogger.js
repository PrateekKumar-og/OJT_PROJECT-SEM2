/**
 * HTTP request logger middleware.
 * Logs method, url, status, and response time for every request.
 * Uses the shared logger utility (no external deps).
 */

import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const { method, originalUrl } = req;
        const { statusCode } = res;

        logger.http(`${method} ${originalUrl} ${statusCode}`, {
            method,
            url: originalUrl,
            status: statusCode,
            durationMs: duration,
            ip: req.ip || req.connection?.remoteAddress,
        });
    });

    next();
};

export default requestLogger;
