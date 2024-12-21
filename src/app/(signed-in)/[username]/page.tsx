// External Imports
import { headers } from "next/headers";

// Local Imports
import { auth } from "@/shared/lib/auth/auth";

const TotsPage = async () => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  return <main className="h-full"></main>;
};

export default TotsPage;
