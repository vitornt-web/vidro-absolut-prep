import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock, Users, Check, Copy, X } from "lucide-react";
import { toast } from "sonner";

interface CustomerData {
  nome: string;
  sobrenome: string;
  cpf: string;
  telegram: string;
  data: string;
}

const PIX_KEY = "538afa8c-0d27-49bb-a98c-f1c9d489d273";

const CheckoutSection = () => {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    telegram: "",
  });
  const [showPixModal, setShowPixModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }
    if (!formData.sobrenome.trim()) {
      newErrors.sobrenome = "Sobrenome é obrigatório";
    }
    if (!formData.cpf || formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido";
    }
    if (!formData.telegram.trim()) {
      newErrors.telegram = "User do Telegram é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }

    // Save customer data to localStorage
    const customerData: CustomerData = {
      ...formData,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    const existingData = JSON.parse(localStorage.getItem("vidro_absolut_customers") || "[]");
    existingData.push(customerData);
    localStorage.setItem("vidro_absolut_customers", JSON.stringify(existingData));

    setShowPixModal(true);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave PIX copiada!");
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === "cpf") {
      formattedValue = formatCPF(value);
    }
    
    if (field === "telegram") {
      formattedValue = value.startsWith("@") ? value : `@${value}`;
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

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

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Preencha seus dados para gerar o pagamento via PIX
              </p>
            </div>

            {/* Checkout Box */}
            <div className="grid md:grid-cols-2 gap-8 bg-card border border-gold/30 rounded-3xl p-8 md:p-12 shadow-xl shadow-gold/10">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    className={errors.nome ? "border-destructive" : ""}
                  />
                  {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sobrenome">Sobrenome</Label>
                  <Input
                    id="sobrenome"
                    placeholder="Seu sobrenome"
                    value={formData.sobrenome}
                    onChange={(e) => handleChange("sobrenome", e.target.value)}
                    className={errors.sobrenome ? "border-destructive" : ""}
                  />
                  {errors.sobrenome && <p className="text-sm text-destructive">{errors.sobrenome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => handleChange("cpf", e.target.value)}
                    className={errors.cpf ? "border-destructive" : ""}
                  />
                  {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram">User do Telegram</Label>
                  <Input
                    id="telegram"
                    placeholder="@seuuser"
                    value={formData.telegram}
                    onChange={(e) => handleChange("telegram", e.target.value)}
                    className={errors.telegram ? "border-destructive" : ""}
                  />
                  {errors.telegram && <p className="text-sm text-destructive">{errors.telegram}</p>}
                </div>

                <Button type="submit" variant="gold" size="xl" className="w-full">
                  GERAR PAGAMENTO PIX
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
                </ul>

                <div className="mb-6">
                  <p className="text-muted-foreground text-sm mb-1">Investimento único</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl">R$</span>
                    <span className="text-5xl font-display font-bold text-gradient-gold">40</span>
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
