import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string()
      .email("Invalid email or password")
      .min(1, "Email is required"),
    password: string()
      .min(6, "Invalid email or password")
      .min(1, "Password is required"),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
