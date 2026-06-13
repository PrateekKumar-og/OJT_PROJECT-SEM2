/**
 * Lightweight structured logger — no external dependencies.
 * Writes JSON-line entries to logs/combined.log and logs/error.log.
 * Also pretty-prints to console with level-based colour coding.
 *
 * Usage:
 *   import logger from "../utils/logger.js";
 *   logger.info("Server started", { port: 5000 });
 *   logger.error("Something failed", { error: err.message });
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR   = path.join(__dirname, "..", "logs");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const COMBINED_LOG = path.join(LOG_DIR, "combined.log");
const ERROR_LOG    = path.join(LOG_DIR, "error.log");

// ANSI colour codes for console output
const COLOURS = {
    reset:   "\x1b[0m",
    red:     "\x1b[31m",
    yellow:  "\x1b[33m",
    green:   "\x1b[32m",
    cyan:    "\x1b[36m",
    magenta: "\x1b[35m",
    grey:    "\x1b[90m",
};

const LEVEL_COLOURS = {
    error: COLOURS.red,
    warn:  COLOURS.yellow,
    info:  COLOURS.green,
    http:  COLOURS.cyan,
    debug: COLOURS.magenta,
};

const LEVEL_PRIORITY = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };

// Respect LOG_LEVEL env var; default to "http" in development, "warn" in production
const currentLevel = process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "warn" : "http");

function shouldLog(level) {
    return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[currentLevel];
}

function formatEntry(level, message, meta = {}) {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta,
    });
}

function writeToFile(filePath, entry) {
    fs.appendFile(filePath, entry + "\n", (err) => {
        if (err) console.error("Logger write error:", err.message);
    });
}

function log(level, message, meta = {}) {
    if (!shouldLog(level)) return;

    const entry = formatEntry(level, message, meta);

    // Write to combined log always, error log only for errors
    writeToFile(COMBINED_LOG, entry);
    if (level === "error") writeToFile(ERROR_LOG, entry);

    // Pretty console output
    const colour   = LEVEL_COLOURS[level] || COLOURS.reset;
    const ts       = COLOURS.grey + new Date().toISOString() + COLOURS.reset;
    const lvl      = colour + level.toUpperCase().padEnd(5) + COLOURS.reset;
    const metaStr  = Object.keys(meta).length
        ? COLOURS.grey + " " + JSON.stringify(meta) + COLOURS.reset
        : "";

    console.log(`${ts} [${lvl}] ${message}${metaStr}`);
}

const logger = {
    error: (message, meta) => log("error", message, meta),
    warn:  (message, meta) => log("warn",  message, meta),
    info:  (message, meta) => log("info",  message, meta),
    http:  (message, meta) => log("http",  message, meta),
    debug: (message, meta) => log("debug", message, meta),
};

export default logger;
