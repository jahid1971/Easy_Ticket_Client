import { z } from "zod";



export const resePasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: " Passwords do not match",
        path: ["confirmPassword"],
    });



export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "Must be at least 6 characters"),
});

export const routeCreateSchema = z.object({
    routeName: z.string().optional(),
    source: z.string().min(1, "Source is required"),
    destination: z.string().min(1, "Destination is required"),
    distance: z.number().min(0.1, "Distance must be greater than 0"),
    description: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

// Seat ID validation (e.g., A1, B12)
const seatIdSchema = z.string().regex(/^[A-Z]\d+$/i, "Invalid seat ID format (e.g., A1, B12)");

// Seat map validation schema
const seatMapSchema = z.object({
    layout: z.array(z.array(seatIdSchema)).min(1, "At least one row required")
        .refine((layout) => {
            if (layout.length === 0) return false;
            const firstRowLength = layout[0]?.length || 0;
            return layout.every(row => row.length === firstRowLength);
        }, "All rows must have the same number of seats"),
    columnPosition: z.object({
        leftSide: z.array(z.number()),
        rightSide: z.array(z.number()),
    }).optional(),
});

export const busCreateSchema = z.object({
    name: z.string().min(1, "Bus name is required"),
    operator: z.string().min(1, "Operator is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    seatMap: seatMapSchema,
    routeId: z.string().optional(),
    coverImage: z.any().optional(),
});

export const busUpdateSchema = z.object({
    name: z.string().min(1, "Bus name is required").optional(),
    operator: z.string().min(1, "Operator is required").optional(),
    registrationNumber: z.string().min(1, "Registration number is required").optional(),
    seatMap: seatMapSchema.optional(),
    routeId: z.string().optional(),
    coverImage: z.any().optional(),
});