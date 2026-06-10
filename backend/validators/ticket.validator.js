import { z } from "zod";

/**
 * Zod schema for POST /api/tickets
 * Enforces: non-empty name, valid email, and descriptive issue text
 */
export const ticketSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address"),

    issue: z
        .string({ required_error: "Issue description is required" })
        .trim()
        .min(10, "Issue description must be at least 10 characters")
        .max(2000, "Issue description cannot exceed 2000 characters"),
});
