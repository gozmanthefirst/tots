// Local Imports
import { getUser } from "@/shared/actions/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";

const TotsPage = async () => {
  const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

  return <main className="h-full"></main>;
};

export default TotsPage;
