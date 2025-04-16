"use server";

import { getUser } from "@/shared/api/get-user";
import db from "@/shared/lib/db/prisma";
import { encrypt } from "@/shared/lib/utils/encryption";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";

export const createTot = async (values: {
  tot: string;
}): Promise<ServerActionResponse> => {
  const { tot: enteredTot } = values;

  try {
    const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

    if (!user) {
      return {
        status: "error",
        message: "Something went wrong! Please try again.",
      };
    }

    // Encrypt the content before saving
    const encryptedContent = encrypt(enteredTot);

    await db.tot.create({
      data: {
        userId: user.id,
        content: encryptedContent,
        folder: "main",
      },
    });

    return {
      status: "success",
      message: "Tot succesfully created!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: `Error creating tot: ${error}`,
    };
  }
};
