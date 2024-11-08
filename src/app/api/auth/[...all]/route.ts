// External Imports
import { toNextJsHandler } from "better-auth/next-js";

// Local Imports
import { auth } from "@/shared/lib/auth/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);
