// import { z } from "zod";



// export const resePasswordSchema = z
//     .object({
//         newPassword: z
//             .string()
//             .min(6, "Password must be at least 6 characters"),
//         confirmPassword: z
//             .string()
//             .min(6, "Password must be at least 6 characters"),
//     })
//     .refine((data) => data.newPassword === data.confirmPassword, {
//         message: " Passwords do not match",
//         path: ["confirmPassword"],
//     });



// export const forgotPasswordSchema = z.object({
//     email: z.string().email("Invalid email address"),
// });

// export const changePasswordSchema = z.object({
//     oldPassword: z.string().min(1, "Old password is required"),
//     newPassword: z.string().min(6, "Must be at least 6 characters"),
// });

// export const routeCreateSchema = z.object({
//     routeName: z.string().optional(),
//     source: z.string().min(1, "Source is required"),
//     destination: z.string().min(1, "Destination is required"),
//     distance: z.number().min(0.1, "Distance must be greater than 0"),
//     description: z.string().optional(),
//     status: z.enum(["ACTIVE", "INACTIVE"]),
// });

// // Seat ID validation (e.g., A1, B12)
// const seatIdSchema = z.string().regex(/^[A-Z]\d+$/i, "Invalid seat ID format (e.g., A1, B12)");

// // Seat map validation schema
// const seatMapSchema = z.object({
//     layout: z.array(z.array(seatIdSchema)).min(1, "At least one row required")
//         .refine((layout) => {
//             if (layout.length === 0) return false;
//             const firstRowLength = layout[0]?.length || 0;
//             return layout.every(row => row.length === firstRowLength);
//         }, "All rows must have the same number of seats"),
//     // number of columns after which to create a larger gap in layout
//     spaceAfterColumn: z.number().int().min(0).optional(),

// });

// export const busCreateSchema = z.object({
//     name: z.string().min(1, "Bus name is required"),
//     operator: z.string().min(1, "Operator is required"),
//     registrationNumber: z.string().min(1, "Registration number is required"),
//     seatMap: seatMapSchema,
//     routeId: z.string().optional(),
//     coverImage: z.any().optional(),
// });

// export const busUpdateSchema = z.object({
//     name: z.string().min(1, "Bus name is required").optional(),
//     operator: z.string().min(1, "Operator is required").optional(),
//     registrationNumber: z.string().min(1, "Registration number is required").optional(),
//     seatMap: seatMapSchema.optional(),
//     routeId: z.string().optional(),
//     coverImage: z.any().optional(),
// });




import { z } from "zod";

// ✅ Client: only UX-level checks (not strict types/business rules)

// Reset password form
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Forgot password form
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Change password form
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "Must be at least 6 characters"),
});

// Route creation form (client only checks required text fields)
export const routeCreateSchema = z.object({
  routeName: z.string().optional(),
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  distance: z.string().min(1, "Distance is required"), // 👈 keep as string (users type text)
  description: z.string().optional(),
  status: z.string().optional(), // 👈 user picks option, server validates enum
  routeStops: z.array(z.object({
    busStopId: z.string().min(1, "Bus stop is required"),
    order: z.number().min(1, "Order must be at least 1"),
    stopType: z.enum(["BOARDING", "DROPPING"]),
  })).optional(),
});

// Seat map (client only ensures rows exist, not strict regex)
export const seatMapSchema = z.object({
  layout: z
    .array(z.array(z.string().min(1, "Seat ID is required")))
    .min(1, "At least one row required"),
  spaceAfterColumn: z.string().optional(), // 👈 user input, server parses number
});

// Bus creation form
export const busCreateSchema = z.object({
  name: z.string().min(1, "Bus name is required"),
  operator: z.string().min(1, "Operator is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  seatMap: seatMapSchema,
  routeId: z.string().optional(),
  coverImage: z.any().optional(),
});

// Bus update form
export const busUpdateSchema = z.object({
  name: z.string().optional(),
  operator: z.string().optional(),
  registrationNumber: z.string().optional(),
  seatMap: seatMapSchema.optional(),
  routeId: z.string().optional(),
  coverImage: z.any().optional(),
});
