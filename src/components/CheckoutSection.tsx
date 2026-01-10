import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock, Users, Check, Copy, X, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { isValidCPF, formatCPF } from "@/lib/cpf-validator";

const PIX_KEY = "538afa8c-0d27-49bb-a98c-f1c9d489d273";

type PurchaseType = "individual" | "casadinha";

interface PersonData {
  nome: string;
  sobrenome: string;
  cpf: string;
  telegram: string;
}

const CheckoutSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("individual");
  const [person1, setPerson1] = useState<PersonData>({
    nome: "",
    sobrenome: "",
    cpf: "",
    telegram: "",
  });
  const [person2, setPerson2] = useState<PersonData>({
    nome: "",
    sobrenome: "",
    cpf: "",
    telegram: "",
  });
  const [showPixModal, setShowPixModal] = useState(false);
  const [errors1, setErrors1] = useState<Record<string, string>>({});
  const [errors2, setErrors2] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // formatCPF is now imported from lib/cpf-validator

  const validatePerson = (data: PersonData, setErrors: (e: Record<string, string>) => void) => {
    const newErrors: Record<string, string> = {};
    
    if (!data.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    if (!data.sobrenome.trim()) {
      newErrors.sobrenome = "Sobrenome é obrigatório";
    }
    if (!data.cpf || !isValidCPF(data.cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    if (!data.telegram.trim()) {
      newErrors.telegram = "User do Telegram é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Você precisa estar logado para fazer uma compra");
      navigate("/auth");
      return;
    }

    const valid1 = validatePerson(person1, setErrors1);
    const valid2 = purchaseType === "casadinha" ? validatePerson(person2, setErrors2) : true;
    
    if (!valid1 || !valid2) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = purchaseType === "individual" ? 45.0 : 80.0;
      
      const purchaseData = {
        user_id: user.id,
        purchase_type: purchaseType,
        amount,
        name: `${person1.nome} ${person1.sobrenome}`,
        cpf: person1.cpf,
        telegram: person1.telegram,
        name_2: purchaseType === "casadinha" ? `${person2.nome} ${person2.sobrenome}` : null,
        cpf_2: purchaseType === "casadinha" ? person2.cpf : null,
        telegram_2: purchaseType === "casadinha" ? person2.telegram : null,
      };

      const { error } = await supabase.from("purchases").insert(purchaseData);

      if (error) {
        toast.error("Erro ao registrar compra. Tente novamente.");
        return;
      }

      setShowPixModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave PIX copiada!");
  };

  const handleChangePerson = (
    person: "1" | "2",
    field: keyof PersonData,
    value: string
  ) => {
    let formattedValue = value;
    
    if (field === "cpf") {
      formattedValue = formatCPF(value);
    }
    
    if (field === "telegram" && value && !value.startsWith("@")) {
      formattedValue = `@${value}`;
    }
    
    if (person === "1") {
      setPerson1((prev) => ({ ...prev, [field]: formattedValue }));
      if (errors1[field]) {
        setErrors1((prev) => ({ ...prev, [field]: "" }));
      }
    } else {
      setPerson2((prev) => ({ ...prev, [field]: formattedValue }));
      if (errors2[field]) {
        setErrors2((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  const renderPersonForm = (
    person: "1" | "2",
    data: PersonData,
    errors: Record<string, string>,
    title: string
  ) => (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg flex items-center gap-2">
        <User className="w-5 h-5 text-gold" />
        {title}
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input
            placeholder="Nome"
            value={data.nome}
            onChange={(e) => handleChangePerson(person, "nome", e.target.value)}
            className={errors.nome ? "border-destructive" : ""}
          />
          {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Sobrenome</Label>
          <Input
            placeholder="Sobrenome"
            value={data.sobrenome}
            onChange={(e) => handleChangePerson(person, "sobrenome", e.target.value)}
            className={errors.sobrenome ? "border-destructive" : ""}
          />
          {errors.sobrenome && <p className="text-sm text-destructive">{errors.sobrenome}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>CPF</Label>
        <Input
          placeholder="000.000.000-00"
          value={data.cpf}
          onChange={(e) => handleChangePerson(person, "cpf", e.target.value)}
          className={errors.cpf ? "border-destructive" : ""}
        />
        {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
      </div>

      <div className="space-y-2">
        <Label>User do Telegram</Label>
        <Input
          placeholder="@seuuser"
          value={data.telegram}
          onChange={(e) => handleChangePerson(person, "telegram", e.target.value)}
          className={errors.telegram ? "border-destructive" : ""}
        />
        {errors.telegram && <p className="text-sm text-destructive">{errors.telegram}</p>}
      </div>
    </div>
  );

  const currentPrice = purchaseType === "individual" ? 45 : 80;

  return (
    <>
      <section id="checkout" className="py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-8">
                <Clock className="w-4 h-4" />
                Vagas limitadas para a turma de Janeiro
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                Matrícula <span className="text-gradient-gold">2026</span>
              </h2>

              {!user && (
                <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 max-w-md mx-auto mb-8">
                  <p className="text-sm text-muted-foreground mb-3">
                    Faça login ou cadastre-se para garantir sua vaga
                  </p>
                  <Button variant="gold" onClick={() => navigate("/auth")}>
                    Entrar / Cadastrar
                  </Button>
                </div>
              )}
            </div>

            {/* Purchase Type Selector */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setPurchaseType("individual")}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
                  purchaseType === "individual"
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/50"
                }`}
              >
                <User className={`w-6 h-6 ${purchaseType === "individual" ? "text-gold" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className={`font-semibold ${purchaseType === "individual" ? "text-gold" : ""}`}>
                    Individual
                  </p>
                  <p className="text-sm text-muted-foreground">R$ 45,00</p>
                </div>
              </button>

              <button
                onClick={() => setPurchaseType("casadinha")}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
                  purchaseType === "casadinha"
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/50"
                }`}
              >
                <UserPlus className={`w-6 h-6 ${purchaseType === "casadinha" ? "text-gold" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className={`font-semibold ${purchaseType === "casadinha" ? "text-gold" : ""}`}>
                    Casadinha (2 pessoas)
                  </p>
                  <p className="text-sm text-muted-foreground">R$ 80,00</p>
                </div>
              </button>
            </div>

            {/* Checkout Box */}
            <div className="grid lg:grid-cols-2 gap-8 bg-card border border-gold/30 rounded-3xl p-8 md:p-12 shadow-xl shadow-gold/10">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderPersonForm("1", person1, errors1, purchaseType === "casadinha" ? "Pessoa 1" : "Seus Dados")}
                
                {purchaseType === "casadinha" && (
                  <>
                    <div className="border-t border-border pt-6" />
                    {renderPersonForm("2", person2, errors2, "Pessoa 2")}
                  </>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full"
                  disabled={!user || isSubmitting}
                >
                  {isSubmitting ? "PROCESSANDO..." : "GERAR PAGAMENTO PIX"}
                </Button>
              </form>

              {/* Info */}
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-display font-bold mb-4">
                  Vidro Absolut <span className="text-gradient-gold">Full</span>
                </h3>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold" />
                    Acesso Vitalício 2026
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold" />
                    Banco de Questões Comentadas
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold" />
                    Suporte Direto com Vitor Gabriel
                  </li>
                  {purchaseType === "casadinha" && (
                    <li className="flex items-center gap-3 text-gold font-medium">
                      <Check className="w-5 h-5 text-gold" />
                      Economia de R$ 10,00 na casadinha!
                    </li>
                  )}
                </ul>

                <div className="mb-6">
                  <p className="text-muted-foreground text-sm mb-1">
                    {purchaseType === "casadinha" ? "Investimento para 2 pessoas" : "Investimento único"}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl">R$</span>
                    <span className="text-5xl font-display font-bold text-gradient-gold">{currentPrice}</span>
                    <span className="text-muted-foreground">,00</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">Pagamento único e seguro</p>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gold" />
                    <span>Garantia 7 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold" />
                    <span>Acesso imediato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold" />
                    <span>+2.500 alunos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIX Modal */}
      {showPixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-gold/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowPixModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gold" />
              </div>

              <h3 className="text-2xl font-display font-bold mb-2">Pagamento PIX</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Valor: <span className="text-gold font-bold">R$ {currentPrice},00</span>
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Copie a chave abaixo para pagar no seu banco
              </p>

              <div className="bg-secondary rounded-xl p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-2">CHAVE PIX COPIA E COLA</p>
                <p className="text-sm font-mono break-all mb-3">{PIX_KEY}</p>
                <Button
                  variant="goldOutline"
                  size="sm"
                  onClick={copyPixKey}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Chave
                </Button>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 text-left text-sm mb-6">
                <p className="mb-1">
                  <span className="text-muted-foreground">Favorecido:</span>{" "}
                  Vitor Gabriel Nascimento Teixeira
                </p>
                <p>
                  <span className="text-muted-foreground">Banco:</span> Mercado Pago
                </p>
              </div>

              <a
                href="https://t.me/studyvituu"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="gold" className="w-full">
                  JÁ PAGUEI, LIBERAR ACESSO
                </Button>
              </a>

              <button
                onClick={() => setShowPixModal(false)}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutSection;
