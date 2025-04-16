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

// get single tot
export const getSingleTot = createParallelAction(
  async (
    totId: string,
  ): Promise<ServerActionResponse | ServerActionResponse<Tot>> => {
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

      const totFromDb = await db.tot.findUnique({
        where: { id: totId, userId: user.id },
      });

      if (!totFromDb) {
        return {
          status: "error",
          message: "Tot not found!",
        };
      }

      // Decrypt content
      const decryptedTot = {
        ...totFromDb,
        content: decrypt(totFromDb.content),
      };

      return {
        status: "success",
        message: "Tot found!",
        data: decryptedTot,
      };
    } catch (error) {
      console.error(`Error fetching tot ${totId}:`, error);
      return { status: "error", message: "Failed to fetch tot." };
    }
  },
);
