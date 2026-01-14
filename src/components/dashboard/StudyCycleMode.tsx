import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface StudySubject {
  id: string;
  subject_name: string;
  weight: number;
  calculated_hours: number;
  completed_hours: number;
}

interface StudyPreferences {
  weekly_hours: number;
  target_university: string;
}

const StudyCycleMode = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<StudySubject[]>([]);
  const [preferences, setPreferences] = useState<StudyPreferences>({
    weekly_hours: 20,
    target_university: "",
  });
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectWeight, setNewSubjectWeight] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    // Load preferences
    const { data: prefData } = await supabase
      .from("user_study_preferences")
      .select("weekly_hours, target_university")
      .eq("user_id", user.id)
      .maybeSingle();

    if (prefData?.weekly_hours) {
      setPreferences({
        weekly_hours: prefData.weekly_hours,
        target_university: prefData.target_university || "",
      });
      setShowSetup(false);
    }

    // Load subjects
    const { data: subjectsData, error } = await supabase
      .from("study_cycle_subjects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar dados");
      return;
    }

    setSubjects(subjectsData || []);
    setIsLoading(false);
  };

  const savePreferences = async () => {
    if (!user) return;

    const { data: existing } = await supabase
      .from("user_study_preferences")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("user_study_preferences")
        .update({
          weekly_hours: preferences.weekly_hours,
          target_university: preferences.target_university,
        })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("user_study_preferences")
        .insert({
          user_id: user.id,
          study_mode: "cycle",
          weekly_hours: preferences.weekly_hours,
          target_university: preferences.target_university,
        });
    }

    // Recalculate hours for all subjects
    await recalculateHours();
    setShowSetup(false);
    toast.success("Preferências salvas!");
  };

  const recalculateHours = async () => {
    if (subjects.length === 0) return;

    const totalWeight = subjects.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0) return;

    const updatedSubjects = subjects.map(subject => ({
      ...subject,
      calculated_hours: Math.round((subject.weight / totalWeight) * preferences.weekly_hours),
    }));

    // Update each subject
    for (const subject of updatedSubjects) {
      await supabase
        .from("study_cycle_subjects")
        .update({ calculated_hours: subject.calculated_hours })
        .eq("id", subject.id);
    }

    setSubjects(updatedSubjects);
  };

  const addSubject = async () => {
    if (!user || !newSubjectName.trim()) {
      toast.error("Digite o nome da matéria");
      return;
    }

    const weight = parseInt(newSubjectWeight) || 1;
    const totalWeight = subjects.reduce((sum, s) => sum + s.weight, 0) + weight;
    const calculatedHours = Math.round((weight / totalWeight) * preferences.weekly_hours);

    const { data, error } = await supabase
      .from("study_cycle_subjects")
      .insert({
        user_id: user.id,
        subject_name: newSubjectName.trim(),
        weight,
        calculated_hours: calculatedHours,
      })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao adicionar matéria");
      return;
    }

    const newSubjects = [...subjects, data];
    setSubjects(newSubjects);
    setNewSubjectName("");
    setNewSubjectWeight("1");
    
    // Recalculate all subjects
    recalculateAllSubjects(newSubjects);
    toast.success("Matéria adicionada!");
  };

  const recalculateAllSubjects = async (subjectsList: StudySubject[]) => {
    const totalWeight = subjectsList.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0) return;

    const updatedSubjects = subjectsList.map(subject => ({
      ...subject,
      calculated_hours: Math.round((subject.weight / totalWeight) * preferences.weekly_hours),
    }));

    for (const subject of updatedSubjects) {
      await supabase
        .from("study_cycle_subjects")
        .update({ calculated_hours: subject.calculated_hours })
        .eq("id", subject.id);
    }

    setSubjects(updatedSubjects);
  };

  const toggleHour = async (subjectId: string, currentCompleted: number, calculatedHours: number) => {
    const newCompleted = currentCompleted >= calculatedHours ? 0 : currentCompleted + 1;

    const { error } = await supabase
      .from("study_cycle_subjects")
      .update({ completed_hours: newCompleted })
      .eq("id", subjectId);

    if (error) {
      toast.error("Erro ao atualizar");
      return;
    }

    setSubjects(subjects.map(s => 
      s.id === subjectId ? { ...s, completed_hours: newCompleted } : s
    ));
  };

  const deleteSubject = async (subjectId: string) => {
    if (!confirm("Excluir esta matéria?")) return;

    const { error } = await supabase
      .from("study_cycle_subjects")
      .delete()
      .eq("id", subjectId);

    if (error) {
      toast.error("Erro ao excluir");
      return;
    }

    const newSubjects = subjects.filter(s => s.id !== subjectId);
    setSubjects(newSubjects);
    recalculateAllSubjects(newSubjects);
    toast.success("Matéria excluída");
  };

  const resetAllProgress = async () => {
    if (!confirm("Reiniciar todo o progresso?")) return;

    for (const subject of subjects) {
      await supabase
        .from("study_cycle_subjects")
        .update({ completed_hours: 0 })
        .eq("id", subject.id);
    }

    setSubjects(subjects.map(s => ({ ...s, completed_hours: 0 })));
    toast.success("Progresso reiniciado!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Ciclo de Estudos</h2>
        <p className="text-muted-foreground">
          Estude no seu tempo, sem horários fixos. Cada quadrado = 1 hora de estudo.
        </p>
      </div>

      {/* Setup Section */}
      {showSetup && (
        <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6 mb-6">
          <h3 className="font-bold mb-4">Configure seu Ciclo</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Horas semanais de estudo</Label>
              <Input
                type="number"
                value={preferences.weekly_hours}
                onChange={(e) => setPreferences({ ...preferences, weekly_hours: parseInt(e.target.value) || 0 })}
                min="1"
                max="80"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Universidade alvo (opcional)</Label>
              <Input
                value={preferences.target_university}
                onChange={(e) => setPreferences({ ...preferences, target_university: e.target.value })}
                placeholder="Ex: USP, UNICAMP, UFMG..."
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={savePreferences} className="bg-gold hover:bg-gold/90 text-primary-foreground">
            Salvar Configurações
          </Button>
        </div>
      )}

      {!showSetup && (
        <>
          {/* Summary */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-muted-foreground text-sm">Horas semanais:</span>
              <span className="ml-2 font-bold text-gold">{preferences.weekly_hours}h</span>
              {preferences.target_university && (
                <>
                  <span className="mx-4 text-muted-foreground">|</span>
                  <span className="text-muted-foreground text-sm">Universidade:</span>
                  <span className="ml-2 font-medium">{preferences.target_university}</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSetup(true)}>
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={resetAllProgress}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar Ciclo
              </Button>
            </div>
          </div>

          {/* Add Subject Form */}
          <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                placeholder="Nome da matéria (ex: Matemática)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap text-sm text-muted-foreground">Peso:</Label>
                <Input
                  type="number"
                  value={newSubjectWeight}
                  onChange={(e) => setNewSubjectWeight(e.target.value)}
                  min="1"
                  max="10"
                  className="w-20"
                />
              </div>
              <Button onClick={addSubject} className="bg-gold hover:bg-gold/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Subjects Grid */}
          {subjects.length === 0 ? (
            <div className="bg-card/50 backdrop-blur border border-dashed border-border rounded-xl p-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma matéria adicionada. Adicione suas matérias para começar!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-card/50 backdrop-blur border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold">{subject.subject_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Peso {subject.weight} • {subject.calculated_hours}h por semana
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        subject.completed_hours >= subject.calculated_hours 
                          ? "text-green-500" 
                          : "text-muted-foreground"
                      }`}>
                        {subject.completed_hours}/{subject.calculated_hours}h
                      </span>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hour squares */}
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: subject.calculated_hours }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => toggleHour(subject.id, index < subject.completed_hours ? subject.completed_hours : index, subject.calculated_hours)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center text-sm font-medium ${
                          index < subject.completed_hours
                            ? "bg-gold border-gold text-primary-foreground"
                            : "border-border hover:border-gold/50 text-muted-foreground"
                        }`}
                        title={`${index + 1}h`}
                      >
                        {index < subject.completed_hours ? "✓" : index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Progress */}
          {subjects.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Progresso Total</span>
                <span className="text-2xl font-bold text-gold">
                  {subjects.reduce((sum, s) => sum + s.completed_hours, 0)}/
                  {subjects.reduce((sum, s) => sum + s.calculated_hours, 0)}h
                </span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all"
                  style={{
                    width: `${(subjects.reduce((sum, s) => sum + s.completed_hours, 0) / 
                      Math.max(subjects.reduce((sum, s) => sum + s.calculated_hours, 0), 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudyCycleMode;
