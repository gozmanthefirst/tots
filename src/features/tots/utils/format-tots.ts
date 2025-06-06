import { Tot } from "@/shared/lib/db/prisma";

type FormattedTots = {
  date: string;
  tots: Tot[];
};

export const formatTotsByDate = (tots: Tot[]): FormattedTots[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (date: Date) => {
    return date.toDateString() === yesterday.toDateString();
  };

  // Create a Map to group tots by date
  const totsByDate = tots.reduce((acc, tot) => {
    const createdDate = new Date(tot.createdAt);
    let dateString: string;

    if (isToday(createdDate)) {
      dateString = "Today";
    } else if (isYesterday(createdDate)) {
      dateString = "Yesterday";
    } else {
      dateString = createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    if (!acc.has(dateString)) {
      acc.set(dateString, []);
    }

    acc.get(dateString)?.push(tot);
    return acc;
  }, new Map<string, Tot[]>());

  // Sort tots within each group by date (newest first)
  totsByDate.forEach((tots) => {
    tots.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  // Convert Map to array and sort by date (newest first)
  return Array.from(totsByDate.entries())
    .map(([date, tots]) => ({
      date,
      tots,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.tots[0].createdAt);
      const dateB = new Date(b.tots[0].createdAt);
      return dateB.getTime() - dateA.getTime();
    });
};
