import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import vidroLogo from "@/assets/vidro-logo.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const { user, isLoading, signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    telegram: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        newErrors.name = "Nome é obrigatório";
      }
      const ageNum = parseInt(formData.age, 10);
      if (!formData.age || isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
        newErrors.age = "Idade inválida (1-150)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.name,
          parseInt(formData.age, 10),
          formData.telegram
        );
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("Este email já está cadastrado. Faça login.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Cadastro realizado com sucesso!");
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Email ou senha incorretos");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Login realizado com sucesso!");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === "age") {
      // Only allow numbers for age
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }
    
    if (field === "telegram" && value && !value.startsWith("@")) {
      formattedValue = `@${value}`;
    }
    
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={vidroLogo}
              alt="Vidro Absolut"
              className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover"
            />
            <h1 className="text-2xl font-display font-bold">
              {isSignUp ? "Criar Conta" : "Entrar"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp
                ? "Preencha seus dados para se cadastrar"
                : "Entre com sua conta para continuar"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="text"
                    inputMode="numeric"
                    placeholder="Sua idade"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive">{errors.age}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram">User do Telegram (opcional)</Label>
                  <Input
                    id="telegram"
                    placeholder="@seuuser"
                    value={formData.telegram}
                    onChange={(e) => handleChange("telegram", e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Carregando..."
                : isSignUp
                ? "Criar Conta"
                : "Entrar"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                }}
                className="text-gold hover:underline font-medium"
              >
                {isSignUp ? "Fazer login" : "Cadastre-se"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
