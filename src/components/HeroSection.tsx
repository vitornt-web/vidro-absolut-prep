import { Button } from "@/components/ui/button";
import heroMountain from "@/assets/hero-mountain.jpg";

const HeroSection = () => {
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
              Método exclusivo para o ENEM 2025
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
            Estude certo, não estude mais.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-up"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <Button variant="gold" size="xl" onClick={scrollToModules}>
              Quero me inscrever agora
            </Button>
            <Button variant="goldOutline" size="lg">
              Ver como funciona
            </Button>
          </div>

          {/* Social Proof Mini */}
          <div 
            className="flex items-center justify-center gap-2 text-muted-foreground text-sm animate-fade-up"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-gold border-2 border-background"
                />
              ))}
            </div>
            <span className="ml-2">
              +2.500 alunos já transformaram seus estudos
            </span>
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
