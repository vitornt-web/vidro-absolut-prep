import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, Calendar, GraduationCap, Settings } from "lucide-react";
import RoutineMode from "@/components/dashboard/RoutineMode";
import StudyCycleMode from "@/components/dashboard/StudyCycleMode";
import StudyModeSelection from "@/components/dashboard/StudyModeSelection";
import fundoSite from "@/assets/fundo-site.jpg";

const Dashboard = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [studyMode, setStudyMode] = useState<"routine" | "cycle" | null>(null);
  const [showModeSelection, setShowModeSelection] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      checkAccess();
      loadStudyPreferences();
    }
  }, [user, isLoading, navigate]);

  const checkAccess = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("purchases")
      .select("has_access")
      .eq("user_id", user.id)
      .eq("has_access", true)
      .maybeSingle();

    if (!error && data) {
      setHasAccess(true);
    }
    setCheckingAccess(false);
  };

  const loadStudyPreferences = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_study_preferences")
      .select("study_mode")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data?.study_mode) {
      setStudyMode(data.study_mode as "routine" | "cycle");
    }
  };

  const handleModeSelect = async (mode: "routine" | "cycle") => {
    if (!user) return;

    // Check if preference exists
    const { data: existing } = await supabase
      .from("user_study_preferences")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("user_study_preferences")
        .update({ study_mode: mode })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("user_study_preferences")
        .insert({ user_id: user.id, study_mode: mode });
    }

    setStudyMode(mode);
    setShowModeSelection(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading || checkingAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <GraduationCap className="w-16 h-16 text-gold mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Acesso Não Liberado</h1>
          <p className="text-muted-foreground mb-6">
            Seu pagamento ainda não foi confirmado. Aguarde a confirmação para ter acesso ao conteúdo.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar para o início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url(${fundoSite})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-gold" />
            <span className="text-xl font-display font-bold">
              Vidro <span className="text-gradient-gold">Absolut</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowModeSelection(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Alterar modo
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        {!studyMode || showModeSelection ? (
          <div className="max-w-4xl mx-auto">
            {/* Intro about ENEM */}
            <section className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Bem-vindo ao <span className="text-gradient-gold">Vidro Absolut</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Sua jornada rumo à aprovação começa aqui.
              </p>
            </section>

            {/* ENEM Info */}
            <section className="mb-12 bg-card/50 backdrop-blur border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold">O que é o ENEM?</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  O <strong className="text-foreground">Exame Nacional do Ensino Médio (ENEM)</strong> é a principal porta de entrada para o ensino superior no Brasil. Criado em 1998, tornou-se o maior vestibular do país e é aceito por praticamente todas as universidades públicas e muitas particulares.
                </p>
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Áreas do Conhecimento</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Linguagens, Códigos e suas Tecnologias</li>
                      <li>• Ciências Humanas e suas Tecnologias</li>
                      <li>• Ciências da Natureza e suas Tecnologias</li>
                      <li>• Matemática e suas Tecnologias</li>
                      <li>• Redação</li>
                    </ul>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">O que é TRI?</h3>
                    <p className="text-sm">
                      A <strong>Teoria de Resposta ao Item (TRI)</strong> é o método de correção que avalia não apenas o número de acertos, mas a coerência das respostas. Acertar questões difíceis e errar fáceis pode diminuir sua nota. A consistência é fundamental!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Access Systems */}
            <section className="mb-12 bg-card/50 backdrop-blur border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold">Sistemas de Acesso à Universidade</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                  <h3 className="font-semibold text-gold mb-2">SISU</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema de Seleção Unificada - usa a nota do ENEM para ingressar em universidades públicas. Duas chamadas por ano com milhares de vagas.
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                  <h3 className="font-semibold text-gold mb-2">PROUNI</h3>
                  <p className="text-sm text-muted-foreground">
                    Programa Universidade para Todos - oferece bolsas de estudo integrais e parciais em instituições privadas para estudantes de baixa renda.
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                  <h3 className="font-semibold text-gold mb-2">FIES</h3>
                  <p className="text-sm text-muted-foreground">
                    Fundo de Financiamento Estudantil - financia cursos em faculdades particulares com juros baixos e pagamento após a formatura.
                  </p>
                </div>
              </div>
            </section>

            {/* Vidro Absolut Mission */}
            <section className="mb-12 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold">Nossa Missão</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                O <strong className="text-gold">Vidro Absolut</strong> surge como forma de superar as barreiras de uma educação que historicamente seleciona quem deverá ser força de trabalho barata. Acreditamos que todo estudante merece acesso às mesmas ferramentas e metodologias que os privilegiados utilizam. Nosso método é a democratização do conhecimento estratégico para aprovação.
              </p>
            </section>

            {/* Mode Selection */}
            <StudyModeSelection onSelect={handleModeSelect} currentMode={studyMode} />
          </div>
        ) : (
          <>
            {studyMode === "routine" && <RoutineMode />}
            {studyMode === "cycle" && <StudyCycleMode />}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
