import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string()
      .min(1, "First name is required"),
    lastName: string()
      .min(1, "Last name is required"),
    password: string()
      .min(6, "Password is too short - should be min 6 chars")
      .min(1, "Password is required"),
    passwordConfirmation: string()
      .min(1, "Password confirmation is required"),
    email: string()
      .email("Not a valid email")
      .min(1, "Email is required"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string()
      .email("Not a valid email")
      .min(1, "Email is required"),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string()
      .min(6, "Password is too short - should be min 6 chars")
      .min(1, "Password is required"),
    passwordConfirmation: string()
      .min(1, "Password confirmation is required"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
