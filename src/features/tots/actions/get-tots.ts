"use server";

// External Imports
import { Tots } from "@prisma/client";

// Local Imports
import { getUser } from "@/shared/actions/get-user";
import db from "@/shared/lib/db/prisma";
import {
  createParallelAction,
  runParallelAction,
} from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";

// get tots
export const getTots = createParallelAction(
  async (): Promise<ServerActionResponse | ServerActionResponse<Tots[]>> => {
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

      const tots = await db.tots.findMany({
        where: {
          userId: user.id,
        },
      });

      if (!tots) {
        return {
          status: "error",
          message: "Tots not found!",
        };
      }

      return {
        status: "success",
        message: "Tots found!",
        data: tots,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: `Error fetching tots: ${error}`,
      };
    }
  },
);
