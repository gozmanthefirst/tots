// External Imports
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// Local Imports
import db from "../db/prisma";

export const auth = betterAuth({
  // Prisma Adapter
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  // OAuth Providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Trusted Origins
  trustedOrigins: ["http://localhost:3000", "https://tots.gozman.dev"],

  // Extend user table
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
      },
    },
  },
});
