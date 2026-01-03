import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mariana Costa",
    age: 18,
    goal: "Medicina na UFMG",
    avatar: "M",
    content:
      "Eu estava completamente perdida nos estudos, tentando abraçar tudo ao mesmo tempo. O Vidro Absolut me deu clareza e foco. Aumentei minha nota em 180 pontos!",
    rating: 5,
  },
  {
    name: "Lucas Ferreira",
    age: 17,
    goal: "Engenharia na USP",
    avatar: "L",
    content:
      "O método é simples e funciona. Parei de estudar 12 horas por dia e comecei a estudar de forma inteligente. Resultado? Passei de 650 para 820 pontos.",
    rating: 5,
  },
  {
    name: "Ana Beatriz",
    age: 19,
    goal: "Direito na UERJ",
    avatar: "A",
    content:
      "A redação sempre foi meu ponto fraco. Com as técnicas do curso, consegui nota 960 na redação. Nunca imaginei que seria possível.",
    rating: 5,
  },
  {
    name: "Pedro Henrique",
    age: 18,
    goal: "Ciência da Computação",
    avatar: "P",
    content:
      "Fiz dois anos de cursinho tradicional sem resultado. Em 6 meses de Vidro Absolut, consegui a aprovação. O segredo está na estratégia.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">
            Depoimentos reais
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            Histórias de quem já{" "}
            <span className="text-gradient-gold">conquistou a aprovação</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Veja como o Vidro Absolut transformou a preparação de milhares de estudantes.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative p-8 rounded-2xl bg-card border border-border/50 hover:border-gold/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-gold/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/90 leading-relaxed mb-6 text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.age} anos • {testimonial.goal}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
