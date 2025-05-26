"use server";

import { headers } from "next/headers";

import { auth } from "@/shared/lib/auth/auth";
import { db } from "@/shared/lib/db/prisma";
import { ServerActionResponse, SessionUser } from "@/shared/types";
import { createParallelAction } from "../lib/utils/parallel-server-action";

// get user
export const getUser = createParallelAction(
  async (): Promise<
    ServerActionResponse | ServerActionResponse<SessionUser>
  > => {
    try {
      const headersList = await headers();

      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (session?.user) {
        return {
          status: "success",
          message: "User gotten!",
          data: session.user,
        };
      } else {
        return { status: "error", message: "No user available!" };
      }
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: `Error fetching user: ${error}`,
      };
    }
  },
);

// get user by username
export const getUserByUsername = createParallelAction(
  async (
    username: string,
  ): Promise<ServerActionResponse | ServerActionResponse<SessionUser>> => {
    if (!username) {
      return { status: "error", message: "Invalid username!" };
    }

    try {
      const user = await db.user.findUnique({
        where: {
          username: username.toLowerCase(),
        },
      });

      if (!user) {
        return {
          status: "error",
          message: "User not found!",
        };
      }

      return {
        status: "success",
        message: "User found!",
        data: user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: `Error fetching user: ${error}`,
      };
    }
  },
);
