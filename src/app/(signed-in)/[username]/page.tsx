// Local Imports
import { Tots } from "@/features/tots/components/tots";
import { TotsPageWrapper } from "@/features/tots/components/tots-page-wrapper";

const TotsPage = async () => {
  return (
    <TotsPageWrapper>
      <div className="mx-4">
        <Tots />
      </div>
    </TotsPageWrapper>
  );
};

export default TotsPage;
