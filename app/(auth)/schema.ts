import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Email or username is required")
    .refine(
      (val) => {
        // Check if it's an email or username
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) || val.length >= 3;
      },
      {
        message: "Please enter a valid email or username (min 3 characters)",
      }
      
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: z.string().email("Please enter a valid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    userType: z.enum(["patient", "doctor"] as const, {
      message: "Please select a user type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
    phone: z.string().min(10, "Phone must be valid").optional().or(z.literal('')),
});

// Create user schema (for admin)
export const createUserSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone must be valid"),
    role: z.enum(['patient', 'doctor', 'admin'] as const),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Update user schema (for admin) - with proper validation
export const updateUserSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phone: z.string().min(10, "Phone must be at least 10 characters").optional().or(z.literal('')),
    role: z.enum(['patient', 'doctor', 'admin'] as const, {
        message: "Please select a valid role"
    }),
    password: z.string()
        .min(0, "Password field required")
        .refine(
            (val) => val === '' || val.length >= 8,
            "Password must be at least 8 characters if provided"
        )
        .optional()
        .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
}).refine(
    (data) => {
        // If password is provided, confirmPassword must match
        if (data.password && data.password.length > 0) {
            return data.password === data.confirmPassword;
        }
        return true;
    },
    {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }
);

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;

