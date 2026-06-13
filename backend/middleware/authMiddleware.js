import jwt from "jsonwebtoken";
import User from "../models/user.js";
import logger from "../utils/logger.js";

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token — JWT errors (invalid/expired) are caught and passed to errorHandler
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            // Pass JWT errors (JsonWebTokenError, TokenExpiredError) to centralized handler
            logger.warn("Auth token failed", { error: error.message });
            next(error);
        }
        return;
    }

    if (!token) {
        logger.warn("No auth token provided", { url: req.originalUrl });
        res.status(401).json({ success: false, status: 401, message: "Not authorized, no token" });
    }
};

export { protect };
