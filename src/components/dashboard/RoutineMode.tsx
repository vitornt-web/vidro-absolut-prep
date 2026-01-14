import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface RoutineTask {
  id: string;
  task_name: string;
  time_slot: string | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  sort_order: number;
}

const DAYS = [
  { key: "monday", label: "Seg" },
  { key: "tuesday", label: "Ter" },
  { key: "wednesday", label: "Qua" },
  { key: "thursday", label: "Qui" },
  { key: "friday", label: "Sex" },
  { key: "saturday", label: "Sáb" },
  { key: "sunday", label: "Dom" },
] as const;

const RoutineMode = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<RoutineTask[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("routine_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar tarefas");
      return;
    }

    setTasks(data || []);
    setIsLoading(false);
  };

  const addTask = async () => {
    if (!user || !newTaskName.trim()) {
      toast.error("Digite o nome da tarefa");
      return;
    }

    const newTask = {
      user_id: user.id,
      task_name: newTaskName.trim(),
      time_slot: newTimeSlot.trim() || null,
      sort_order: tasks.length,
    };

    const { data, error } = await supabase
      .from("routine_tasks")
      .insert(newTask)
      .select()
      .single();

    if (error) {
      toast.error("Erro ao adicionar tarefa");
      return;
    }

    setTasks([...tasks, data]);
    setNewTaskName("");
    setNewTimeSlot("");
    toast.success("Tarefa adicionada!");
  };

  const toggleDay = async (taskId: string, day: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("routine_tasks")
      .update({ [day]: !currentValue })
      .eq("id", taskId);

    if (error) {
      toast.error("Erro ao atualizar");
      return;
    }

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, [day]: !currentValue } : t
    ));
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Excluir esta tarefa?")) return;

    const { error } = await supabase
      .from("routine_tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      toast.error("Erro ao excluir");
      return;
    }

    setTasks(tasks.filter(t => t.id !== taskId));
    toast.success("Tarefa excluída");
  };

  const updateTaskName = async (taskId: string, newName: string) => {
    const { error } = await supabase
      .from("routine_tasks")
      .update({ task_name: newName })
      .eq("id", taskId);

    if (error) {
      toast.error("Erro ao atualizar");
      return;
    }

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, task_name: newName } : t
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Sua Rotina Semanal</h2>
        <p className="text-muted-foreground">
          Organize suas tarefas para cada dia da semana
        </p>
      </div>

      {/* Add Task Form */}
      <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Nome da tarefa (ex: Estudar Matemática)"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Horário (opcional)"
            value={newTimeSlot}
            onChange={(e) => setNewTimeSlot(e.target.value)}
            className="w-full md:w-40"
          />
          <Button onClick={addTask} className="bg-gold hover:bg-gold/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Routine Table */}
      <div className="bg-card/50 backdrop-blur border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground min-w-[200px]">
                  Tarefa
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground w-24">
                  Horário
                </th>
                {DAYS.map(day => (
                  <th 
                    key={day.key} 
                    className="text-center p-4 text-sm font-semibold text-muted-foreground w-16"
                  >
                    {day.label}
                  </th>
                ))}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-muted-foreground">
                    Nenhuma tarefa adicionada ainda. Comece adicionando sua primeira tarefa!
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="border-t border-border/50 hover:bg-secondary/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                        <Input
                          value={task.task_name}
                          onChange={(e) => updateTaskName(task.id, e.target.value)}
                          onBlur={(e) => {
                            if (!e.target.value.trim()) {
                              updateTaskName(task.id, "Sem nome");
                            }
                          }}
                          className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 font-medium"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {task.time_slot || "-"}
                    </td>
                    {DAYS.map(day => (
                      <td key={day.key} className="p-4 text-center">
                        <button
                          onClick={() => toggleDay(task.id, day.key, task[day.key])}
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${
                            task[day.key]
                              ? "bg-gold border-gold text-primary-foreground"
                              : "border-border hover:border-gold/50"
                          }`}
                        >
                          {task[day.key] && "✓"}
                        </button>
                      </td>
                    ))}
                    <td className="p-4">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoutineMode;
