import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ModulesSection from "@/components/ModulesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
      <ModulesSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
