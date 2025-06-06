"use server";

import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { getUser, getUserByUsername } from "../../../shared/api/get-user";
import { db } from "../../../shared/lib/db/prisma";
import { ServerActionResponse } from "../../../shared/types";

export const createUsername = async (values: {
  username: string;
}): Promise<ServerActionResponse> => {
  const { username } = values;

  const [{ data: existingUser }, { data: user }] = await Promise.all([
    runParallelAction(getUserByUsername(username)),
    runParallelAction(getUser()),
  ]);

  if (existingUser) {
    return { status: "error", message: "This username has been taken!" };
  }

  if (!user?.id) {
    return {
      status: "error",
      message: "Something went wrong! Please try again.",
    };
  }

  try {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: username.toLowerCase(),
      },
    });

    return { status: "success", message: "Username created!" };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: `Error creating username: ${error}`,
    };
  }
};
