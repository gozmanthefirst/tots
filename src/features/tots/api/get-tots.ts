"use server";

import { Tot } from "@prisma/client";

import { getUser } from "@/shared/api/get-user";
import db from "@/shared/lib/db/prisma";
import { decrypt } from "@/shared/lib/utils/encryption";
import {
  createParallelAction,
  runParallelAction,
} from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";

// get tots
export const getTots = createParallelAction(
  async (): Promise<ServerActionResponse | ServerActionResponse<Tot[]>> => {
    try {
      const [{ data: user }] = await Promise.all([
        runParallelAction(getUser()),
      ]);

      if (!user) {
        return {
          status: "error",
          message: "Something went wrong! Please try again.",
        };
      }

      const totsFromDb = await db.tot.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (!totsFromDb) {
        return {
          status: "error",
          message: "Tots not found!",
        };
      }

      // Decrypt content for each tot
      const decryptedTots = totsFromDb.map((tot) => ({
        ...tot,
        content: decrypt(tot.content),
      }));

      return {
        status: "success",
        message: "Tots found!",
        data: decryptedTots,
      };
    } catch (error) {
      console.error("Error fetching tots:", error);
      return { status: "error", message: "Failed to fetch tots." };
    }
  },
);
