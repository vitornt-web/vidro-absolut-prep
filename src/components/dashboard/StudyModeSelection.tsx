import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudyModeSelectionProps {
  onSelect: (mode: "routine" | "cycle") => void;
  currentMode: "routine" | "cycle" | null;
}

const StudyModeSelection = ({ onSelect, currentMode }: StudyModeSelectionProps) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-2">Escolha seu Método de Estudo</h2>
      <p className="text-muted-foreground text-center mb-8">
        Selecione a abordagem que melhor se adapta ao seu estilo de vida
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Routine Option */}
        <button
          onClick={() => onSelect("routine")}
          className={`bg-card/50 backdrop-blur border rounded-2xl p-6 text-left transition-all hover:border-gold/50 hover:bg-card/70 ${
            currentMode === "routine" ? "border-gold ring-2 ring-gold/20" : "border-border"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            {currentMode === "routine" && (
              <CheckCircle className="w-5 h-5 text-gold ml-auto" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">Rotina Fixa</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Ideal para quem tem horários definidos e prefere seguir uma agenda estruturada com tarefas específicas para cada dia da semana.
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Tabela com dias da semana</li>
            <li>• Adicione tarefas personalizadas</li>
            <li>• Visualização clara da semana</li>
          </ul>
        </button>

        {/* Cycle Option */}
        <button
          onClick={() => onSelect("cycle")}
          className={`bg-card/50 backdrop-blur border rounded-2xl p-6 text-left transition-all hover:border-gold/50 hover:bg-card/70 ${
            currentMode === "cycle" ? "border-gold ring-2 ring-gold/20" : "border-border"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            {currentMode === "cycle" && (
              <CheckCircle className="w-5 h-5 text-gold ml-auto" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">Ciclo de Estudos</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Flexível e adaptável a contratempos. Sem horários fixos - você define apenas as horas semanais e as matérias com seus pesos.
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Defina horas semanais disponíveis</li>
            <li>• Adicione matérias com pesos</li>
            <li>• Cálculo automático de dedicação</li>
            <li>• Marque as horas estudadas</li>
          </ul>
        </button>
      </div>
    </section>
  );
};

export default StudyModeSelection;
