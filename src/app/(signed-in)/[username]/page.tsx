// Local Imports
import { Tots } from "@/features/tots/components/tots";
import { Container } from "@/shared/components/container";

const TotsPage = async () => {
  return (
    <Container className="py-4">
      <Tots />
    </Container>
  );
};

export default TotsPage;
