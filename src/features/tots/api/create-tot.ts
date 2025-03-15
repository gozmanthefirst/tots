"use server";

import { Tot } from "@prisma/client";

import { getUser } from "@/shared/api/get-user";
import db from "@/shared/lib/db/prisma";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";

export const createTot = async (values: {
  tot: string;
}): Promise<ServerActionResponse | ServerActionResponse<Tot>> => {
  const { tot: enteredTot } = values;

  try {
    const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

    if (!user) {
      return {
        status: "error",
        message: "Something went wrong! Please try again.",
      };
    }

    const tot = await db.tot.create({
      data: {
        userId: user.id,
        content: enteredTot,
        folder: "main",
      },
    });

    return {
      status: "success",
      message: "Tot succesfully created!",
      data: tot,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: `Error creating tot: ${error}`,
    };
  }
};
