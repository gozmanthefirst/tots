export const getUsernames = async () => {
  try {
    const response = await fetch(`/api/username/getUsernames`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error fetching usernames.`);
    }

    const jsonData = await response.json();

    if (jsonData.status === "error") {
      throw new Error(jsonData.message || "An unknown error occurred");
    }

    return {
      data: jsonData.data as {
        username: string | null;
      }[],
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
