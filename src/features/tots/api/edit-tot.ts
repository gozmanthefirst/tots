"use server";

import { getSingleTot } from "@/features/tots/api/get-single-tot";
import { getUser } from "@/shared/api/get-user";
import { db, Tot } from "@/shared/lib/db/prisma";
import { encrypt } from "@/shared/lib/utils/encryption";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";

export const editTot = async (values: {
  updatedTot: Tot;
}): Promise<ServerActionResponse> => {
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

    // Encrypt the content before updating
    const encryptedContent = encrypt(updatedTot.content);

    await db.tot.update({
      where: {
        userId: user.id,
        id: singleTot.id,
      },
      data: {
        ...updatedTot,
        content: encryptedContent,
      },
    });

    return {
      status: "success",
      message: "Tot succesfully updated!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: `Error editing tot: ${error}`,
    };
  }
};
