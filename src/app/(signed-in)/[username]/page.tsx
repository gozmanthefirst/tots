// External Imports
import { headers } from "next/headers";

// Local Imports
import { TotsUsername } from "@/features/tots/components/tots-username";
import { auth } from "@/shared/lib/auth/auth";

const TotsPage = async () => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  return (
    <main className="flex flex-col items-center justify-center h-full">
      <TotsUsername user={session?.user} />
    </main>
  );
};

export default TotsPage;
