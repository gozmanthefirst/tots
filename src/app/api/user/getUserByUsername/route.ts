// External Imports
import { NextRequest, NextResponse } from "next/server";

// Local Imports
import db from "@/shared/lib/db/prisma";
import { createErrorResponse } from "@/shared/lib/utils/api";
import { logger } from "@/shared/lib/utils/logger";

// Route handler to get user data by username
export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return createErrorResponse("Unauthorized!", 401);
    }

    const user = await db.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    return NextResponse.json({ status: "success", data: user });
  } catch (error) {
    logger.error("Error fetching user data", { error });
    return createErrorResponse("Failed to fetch user data", 500);
  }
}
