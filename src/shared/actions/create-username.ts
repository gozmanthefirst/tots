"use server";

// External Imports
import { headers } from "next/headers";
import { z } from "zod";

// Local Imports
import { usernameSchema } from "../../features/onboarding/schemas/zod-schema";
import { auth } from "../lib/auth/auth";
import db from "../lib/db/prisma";
import { getUserByUsername } from "./get-user";

export const createUsername = async (
  values: z.infer<ReturnType<typeof usernameSchema>>,
  usernames: string[]
): Promise<ServerActionResponse> => {
  const validatedFields = usernameSchema(usernames).safeParse(values);

  if (!validatedFields.success) {
    return { status: "error", message: "Invalid fields!" };
  }

  const { username } = validatedFields.data;

  const { data: existingUser } = await getUserByUsername(username);

  if (existingUser) {
    return { status: "error", message: "This username has been taken!" };
  }

  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    return {
      status: "error",
      message: "Something went wrong! Please try again.",
    };
  }

  try {
    await db.user.update({
      where: {
        id: session?.user?.id,
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
      message: "Something went wrong! Please try again.",
    };
  }
};
