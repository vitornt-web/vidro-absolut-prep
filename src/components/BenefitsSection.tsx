import { Target, Clock, TrendingUp, FileText, CheckCircle, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Estudo direcionado",
    description: "Aprenda exatamente o que cai no ENEM, sem perder tempo com conteúdos desnecessários.",
  },
  {
    icon: Clock,
    title: "Sem sobrecarga",
    description: "Organize seus estudos de forma inteligente, sem exaustão e com resultados reais.",
  },
  {
    icon: TrendingUp,
    title: "Aumento de nota",
    description: "Estratégias comprovadas para elevar sua pontuação em todas as áreas.",
  },
  {
    icon: FileText,
    title: "Redação nota alta",
    description: "Técnicas objetivas para dominar a estrutura e conquistar a nota máxima.",
  },
  {
    icon: CheckCircle,
    title: "Clareza no caminho",
    description: "Saiba exatamente o que estudar, quando estudar e como estudar.",
  },
  {
    icon: Sparkles,
    title: "Confiança inabalável",
    description: "Desenvolva a mentalidade certa para enfrentar a prova com segurança.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">
            Por que escolher o Vidro Absolut
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            Tudo que você precisa para{" "}
            <span className="text-gradient-gold">alcançar a aprovação</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Um método completo, prático e direto ao ponto para você conquistar sua vaga.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-semibold mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
