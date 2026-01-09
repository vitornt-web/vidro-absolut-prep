import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import ModulesSection from "@/components/ModulesSection";
import CheckoutSection from "@/components/CheckoutSection";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import UserMenu from "@/components/UserMenu";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <UserMenu />
      <HeroSection />
      <BenefitsSection />
      <ModulesSection />
      <CheckoutSection />
      <Footer />
      <AdminPanel />
    </main>
  );
};

export default Index;
