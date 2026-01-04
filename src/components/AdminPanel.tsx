import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CustomerData {
  nome: string;
  sobrenome: string;
  cpf: string;
  telegram: string;
  data: string;
}

const ADMIN_PASSWORD = "vitor2026";

const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [customers, setCustomers] = useState<CustomerData[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [isAuthenticated]);

  const loadCustomers = () => {
    const data = JSON.parse(localStorage.getItem("vidro_absolut_customers") || "[]");
    setCustomers(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Acesso autorizado!");
    } else {
      toast.error("Senha incorreta!");
    }
    setPassword("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    setPassword("");
  };

  const clearAllData = () => {
    if (confirm("Tem certeza que deseja apagar todos os dados?")) {
      localStorage.removeItem("vidro_absolut_customers");
      setCustomers([]);
      toast.success("Dados apagados!");
    }
  };

  const totalValue = customers.length * 40;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors"
      >
        Admin
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold">
            Painel de Vendas
          </h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Login Form */
          <div className="p-8">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-6">Digite a senha de acesso</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="gold" className="w-full">
                  Entrar
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-muted-foreground text-sm">Total de Cadastros</p>
                <p className="text-3xl font-bold text-gold">{customers.length}</p>
              </div>
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-muted-foreground text-sm">Valor Potencial</p>
                <p className="text-3xl font-bold text-gold">
                  R$ {totalValue.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>

            {/* Table */}
            {customers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground font-medium">Data</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Nome</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">CPF</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Telegram</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-secondary/50">
                        <td className="p-3">{customer.data}</td>
                        <td className="p-3">{customer.nome} {customer.sobrenome}</td>
                        <td className="p-3 font-mono">{customer.cpf}</td>
                        <td className="p-3">
                          <a
                            href={`https://t.me/${customer.telegram.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline"
                          >
                            {customer.telegram}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum cadastro ainda
              </div>
            )}

            {/* Actions */}
            {customers.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Dados
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
