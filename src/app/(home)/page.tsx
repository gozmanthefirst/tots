// Local Imports
import { WelcomeContent } from "@/features/welcome/components/welcome-content";
import { Container } from "@/shared/components/container";
import { LogoHeader } from "@/shared/components/logo-header";

const WelcomePage = () => {
  return (
    <Container className="flex flex-col h-dvh">
      <LogoHeader />
      <WelcomeContent />
    </Container>
  );
};

export default WelcomePage;
