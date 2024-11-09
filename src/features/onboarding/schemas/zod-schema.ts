import { z } from "zod";

export const usernameSchema = (usernames: string[]) =>
  z.object({
    username: z
      .string({ required_error: "Username is required" })
      .trim()
      .min(5, { message: "Username must be 5 or more characters long" })
      .max(15, { message: "Username must be 15 or fewer characters long" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      })
      .refine((username) => !usernames.includes(username?.toLowerCase()), {
        message: "This username has already been taken",
      }),
  });
