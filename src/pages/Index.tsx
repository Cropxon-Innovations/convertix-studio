import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ShiftSection } from "@/components/landing/ShiftSection";
import { StudiosOverview } from "@/components/landing/StudiosOverview";
import { ContinuitySection } from "@/components/landing/ContinuitySection";
import { LoginValueSection } from "@/components/landing/LoginValueSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { DemoImageSection } from "@/components/landing/DemoImageSection";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <DemoImageSection />
      <ProblemSection />
      <ShiftSection />
      <StudiosOverview />
      <ContinuitySection />
      <LoginValueSection />
      <TrustSection />
    </MainLayout>
  );
};

export default Index;
