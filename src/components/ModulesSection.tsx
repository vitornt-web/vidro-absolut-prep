import { Brain, BookOpen, Target, FileEdit, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  {
    number: "01",
    icon: Brain,
    title: "Mentalidade & Organização",
    description:
      "Desenvolva a mentalidade de aprovação e crie um plano de estudos personalizado que funcione para a sua rotina.",
    topics: ["Gestão do tempo", "Cronograma estratégico", "Foco e disciplina"],
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Estratégias por Área",
    description:
      "Domine as técnicas específicas para cada área do conhecimento: Linguagens, Humanas, Natureza e Matemática.",
    topics: ["Priorização de conteúdos", "Métodos de estudo", "Revisão eficiente"],
  },
  {
    number: "03",
    icon: Target,
    title: "Resolução de Questões",
    description:
      "Aprenda técnicas avançadas para resolver questões do ENEM com rapidez e precisão, maximizando sua pontuação.",
    topics: ["Padrões de questões", "Gestão de tempo na prova", "Técnicas de eliminação"],
  },
  {
    number: "04",
    icon: FileEdit,
    title: "Redação Descomplicada",
    description:
      "Domine a estrutura da redação do ENEM e aprenda a desenvolver argumentos que garantem nota alta.",
    topics: ["Estrutura perfeita", "Repertório sociocultural", "Proposta de intervenção"],
  },
  {
    number: "05",
    icon: RotateCcw,
    title: "Revisão Estratégica",
    description:
      "Técnicas de revisão para a reta final que consolidam todo o conhecimento e maximizam sua performance.",
    topics: ["Revisão ativa", "Simulados direcionados", "Preparação mental"],
  },
];

const ModulesSection = () => {
  return (
    <section id="modules" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">
            Conteúdo completo
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            Módulos do{" "}
            <span className="text-gradient-gold">Vidro Absolut</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Um passo a passo estratégico do zero à aprovação no ENEM.
          </p>
        </div>

        {/* Modules */}
        <div className="max-w-4xl mx-auto space-y-6">
          {modules.map((module, index) => (
            <div
              key={module.number}
              className="group relative p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Module Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-gold flex items-center justify-center">
                    <module.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gold font-mono text-sm">
                      Módulo {module.number}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-semibold mb-3">
                    {module.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {module.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="gold" size="xl">
            Garantir minha vaga agora
          </Button>
          <p className="mt-4 text-muted-foreground text-sm">
            Acesso imediato • Garantia de 7 dias
          </p>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
