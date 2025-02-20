"use server";

// External Imports
import { Tot } from "@prisma/client";

// Local Imports
import { getUser } from "@/shared/actions/get-user";
import db from "@/shared/lib/db/prisma";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";
import { getSingleTot } from "./get-single-tot";

export const deleteTot = async (tot: Tot): Promise<ServerActionResponse> => {
  try {
    const [{ data: user }, { data: singleTot }] = await Promise.all([
      runParallelAction(getUser()),
      runParallelAction(getSingleTot(tot.id)),
    ]);

    if (!user) {
      return {
        status: "error",
        message: "Something went wrong! Please try again.",
      };
    }

    if (!singleTot) {
      return {
        status: "error",
        message: "This tot does not exist. Please try again.",
      };
    }

    await db.tot.delete({
      where: {
        userId: user.id,
        id: singleTot.id,
      },
    });

    return {
      status: "success",
      message: "Tot succesfully deleted!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: `Error deletng tot: ${error}`,
    };
  }
};
