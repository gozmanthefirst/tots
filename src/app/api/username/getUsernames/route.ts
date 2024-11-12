// External Imports
import { NextRequest, NextResponse } from "next/server";

// Local Imports
import db from "@/shared/lib/db/prisma";
import { createErrorResponse } from "@/shared/lib/utils/api";
import { logger } from "@/shared/lib/utils/logger";

// Route handler to get usernames
export async function GET(req: NextRequest) {
  try {
    const usernames = await db.user.findMany({
      select: {
        username: true,
      },
    });

    if (!usernames) {
      return createErrorResponse("Usernames not found", 404);
    }

    return NextResponse.json({ status: "success", data: usernames });
  } catch (error) {
    logger.error("Error fetching usernames", { error });
    return createErrorResponse("Failed to fetch usernames", 500);
  }
}
