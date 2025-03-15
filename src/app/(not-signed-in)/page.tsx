import { WelcomeContent } from "@/features/welcome/components/welcome-content";
import { Container } from "@/shared/components/container";

export const dynamic = "force-dynamic";

const WelcomePage = () => {
  return (
    <Container className="flex h-full flex-col items-center justify-center">
      <WelcomeContent />
    </Container>
  );
};

export default WelcomePage;
