import { z } from "zod";

export const registerPatientSchema = z.object({
    patient: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Please enter a valid email address!"),
        // contactNumber: z.string().regex(/^\d{11}$/, "Please provide a valid phone number!"),
        contactNumber: z.string().min(1, "Contact number is required"),
        address: z.string().min(1, "Address is required"),
    }),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

export const updatePatiientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address!"),
    // contactNumber: z.string().regex(/^\d{11}$/, "Please provide a valid phone number!"),
    contactNumber: z.string().min(1, "Contact number is required"),
    address: z.string().min(1, "Address is required"),
});


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