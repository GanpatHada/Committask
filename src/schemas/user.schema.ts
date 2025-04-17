import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .preprocess((val) => (typeof val === "string" ? val.trim() : ""), z
      .string({ required_error: "Name is required" })
      .min(1, "Name cannot be empty")
      .max(50, "Name must be under 50 characters")
    ),

  email: z
    .preprocess((val) => (typeof val === "string" ? val.trim() : ""), z
      .string({ required_error: "Email is required" })
      .min(1, "Email cannot be empty")
      .email("Invalid email format")
    ),

  password: z
    .preprocess((val) => (typeof val === "string" ? val.trim() : ""), z
      .string({ required_error: "Password is required" })
      .min(1, "Password cannot be empty")
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be under 100 characters")
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
