// Local Imports
import { WelcomeContent } from "@/features/welcome/components/welcome-content";
import { Container } from "@/shared/components/container";

const WelcomePage = () => {
  return (
    <Container className="flex flex-col items-center justify-center h-full">
      <WelcomeContent />
    </Container>
  );
};

export default WelcomePage;
