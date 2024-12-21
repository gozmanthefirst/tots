import { z } from "zod";

export const editorSchema = z.object({
  tots: z.string().min(1, { message: "C'mon now, Tots can't be empty." }),
});
