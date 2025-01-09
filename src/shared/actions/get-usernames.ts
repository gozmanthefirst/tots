"use server";

// Local Imports
import db from "@/shared/lib/db/prisma";
import { ServerActionResponse } from "@/shared/types";
import { createParallelAction } from "../lib/utils/parallel-server-action";

// get usernames
export const getUsernames = createParallelAction(
  async (): Promise<
    ServerActionResponse | ServerActionResponse<{ username: string | null }[]>
  > => {
    try {
      const usernames = await db.user.findMany({
        select: {
          username: true,
        },
      });

      if (!usernames) {
        return {
          status: "error",
          message: "Usernames not found!",
        };
      }

      return {
        status: "success",
        message: "Usernames found!",
        data: usernames,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: `Error fetching usernames: ${error}`,
      };
    }
  },
);
