// External Imports
import { User } from "@prisma/client";

export const getUserByUsername = async (username: string) => {
  try {
    const response = await fetch(
      `/api/user/getUserByUsername?username=${username}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in.");
      } else if (response.status === 404) {
        throw new Error("User not found.");
      } else {
        throw new Error(`Error fetching user data.`);
      }
    }

    const jsonData = await response.json();

    if (jsonData.status === "error") {
      throw new Error(jsonData.message || "An unknown error occurred");
    }

    return {
      data: jsonData.data as User,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
