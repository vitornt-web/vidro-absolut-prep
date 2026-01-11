import { Button } from "@/components/ui/button";
import heroMountain from "@/assets/hero-mountain.jpg";

const HeroSection = () => {
  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToModules = () => {
    document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroMountain})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div 
            className="inline-block animate-fade-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <span className="px-4 py-2 rounded-full border border-gold/30 text-gold text-sm font-medium bg-gold/5">
              Método exclusivo para o ENEM 2026
            </span>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-tight animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            Saia da confusão.{" "}
            <span className="text-gradient-gold">Conquiste sua aprovação.</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            O <span className="text-foreground font-semibold">Vidro Absolut</span> é o método 
            que transforma sua preparação para o ENEM em um caminho claro e estratégico. 
            Melhor custo-benefício comparado a cursinhos acima de R$ 2.000.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-up"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <Button variant="gold" size="xl" onClick={scrollToCheckout}>
              Quero me inscrever agora
            </Button>
            <Button variant="goldOutline" size="lg" onClick={scrollToModules}>
              Ver como funciona
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gold rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
