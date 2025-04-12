"use server";

import { Tot } from "@prisma/client";

import { getSingleTot } from "@/features/tots/api/get-single-tot";
import { getUser } from "@/shared/api/get-user";
import db from "@/shared/lib/db/prisma";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";

export const editTot = async (values: {
  updatedTot: Tot;
}): Promise<ServerActionResponse | ServerActionResponse<Tot>> => {
  const { updatedTot } = values;

  try {
    const [{ data: user }, { data: singleTot }] = await Promise.all([
      runParallelAction(getUser()),
      runParallelAction(getSingleTot(updatedTot.id)),
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
      data: updatedTot,
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
