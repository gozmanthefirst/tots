"use server";

// External Imports
import { Tot } from "@prisma/client";

// Local Imports
import { getSingleTot } from "@/features/tots/actions/get-single-tot";
import { getUser } from "@/shared/actions/get-user";
import db from "@/shared/lib/db/prisma";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";

export const editTot = async (values: {
  updatedTot: string;
  tot: Tot;
}): Promise<ServerActionResponse | ServerActionResponse<Tot>> => {
  const { tot: totObj, updatedTot } = values;

  try {
    const [{ data: user }, { data: singleTot }] = await Promise.all([
      runParallelAction(getUser()),
      runParallelAction(getSingleTot(totObj.id)),
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

    const tot = await db.tot.update({
      where: {
        userId: user.id,
        id: singleTot.id,
      },
      data: {
        content: updatedTot,
      },
    });

    return {
      status: "success",
      message: "Tot succesfully updated!",
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
