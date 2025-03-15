"use server";

import { Tot } from "@prisma/client";

import { getUser } from "@/shared/api/get-user";
import db from "@/shared/lib/db/prisma";
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

      const tot = await db.tot.findUnique({
        where: {
          userId: user.id,
          id: totId,
        },
      });

      if (!tot) {
        return {
          status: "error",
          message: "Tot not found!",
        };
      }

      return {
        status: "success",
        message: "Tot found!",
        data: tot,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: `Error fetching tot: ${error}`,
      };
    }
  },
);
