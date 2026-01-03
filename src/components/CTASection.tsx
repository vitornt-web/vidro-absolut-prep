import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-8">
            <Clock className="w-4 h-4" />
            Vagas limitadas para a turma de Janeiro
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Sua aprovação no ENEM começa{" "}
            <span className="text-gradient-gold">agora</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Pare de estudar no escuro. Entre para o Vidro Absolut e tenha clareza, 
            estratégia e direcionamento para conquistar a nota que você merece.
          </p>

          {/* Pricing */}
          <div className="bg-card border border-gold/30 rounded-3xl p-8 md:p-12 mb-8 max-w-xl mx-auto shadow-xl shadow-gold/10">
            <p className="text-muted-foreground mb-2">Investimento único</p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-muted-foreground line-through text-lg">
                R$ 497
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-xl">R$</span>
              <span className="text-5xl md:text-6xl font-display font-bold text-gradient-gold">
                297
              </span>
              <span className="text-muted-foreground">,00</span>
            </div>

            <p className="text-muted-foreground mb-8">
              ou 12x de R$ 29,04 no cartão
            </p>

            <Button variant="gold" size="xl" className="w-full group">
              Quero começar minha transformação
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <span>Garantia de 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              <span>Acesso imediato</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              <span>+2.500 alunos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
