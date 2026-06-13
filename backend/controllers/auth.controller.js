import jwt from "jsonwebtoken";
import User from "../models/user.js";
import logger from "../utils/logger.js";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "30d",
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
export const signup = async (req, res, next) => {
    try {
        const { name, email, password, avatar } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, status: 400, message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            method: "manual",
            avatar: avatar || name.charAt(0).toUpperCase()
        });

        if (user) {
            logger.info("User registered", { userId: user._id, email });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                method: user.method,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ success: false, status: 400, message: "Invalid user data" });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && user.method === "manual" && (await user.matchPassword(password))) {
            logger.info("User logged in", { userId: user._id, email });
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                method: user.method,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, status: 401, message: "Invalid credentials" });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
export const googleLogin = async (req, res, next) => {
    try {
        const { email, name, picture } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                method: "google",
                avatar: picture || name.charAt(0).toUpperCase()
            });
        }

        logger.info("Google login", { userId: user._id, email });
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            method: user.method,
            token: generateToken(user._id),
        });
    } catch (error) {
        next(error);
    }
};
