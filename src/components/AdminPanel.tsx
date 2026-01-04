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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-secondary rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Total de Cadastros</p>
                <p className="text-3xl font-bold text-gold">{customers.length}</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Valor Total</p>
                <p className="text-3xl font-bold text-emerald-500">
                  R$ {totalValue.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="bg-secondary rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Preço Unitário</p>
                <p className="text-3xl font-bold text-foreground">R$ 40,00</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Último Cadastro</p>
                <p className="text-lg font-bold text-foreground">
                  {customers.length > 0 ? customers[customers.length - 1].data : "-"}
                </p>
              </div>
            </div>

            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Planilha de Clientes</h3>
              {customers.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="text-destructive hover:text-destructive border-destructive/30"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Tudo
                </Button>
              )}
            </div>

            {/* Table */}
            {customers.length > 0 ? (
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">#</th>
                        <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Data</th>
                        <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Nome Completo</th>
                        <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">CPF</th>
                        <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Telegram</th>
                        <th className="text-right p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer, index) => (
                        <tr 
                          key={index} 
                          className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                        >
                          <td className="p-4 text-muted-foreground font-mono text-xs">{index + 1}</td>
                          <td className="p-4 text-muted-foreground">{customer.data}</td>
                          <td className="p-4 font-medium">{customer.nome} {customer.sobrenome}</td>
                          <td className="p-4 font-mono text-sm">{customer.cpf}</td>
                          <td className="p-4">
                            <a
                              href={`https://t.me/${customer.telegram.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-gold hover:underline"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.828.94z"/>
                              </svg>
                              {customer.telegram}
                            </a>
                          </td>
                          <td className="p-4 text-right font-semibold text-emerald-500">R$ 40,00</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-secondary/80">
                      <tr>
                        <td colSpan={5} className="p-4 text-right font-semibold text-muted-foreground">TOTAL:</td>
                        <td className="p-4 text-right font-bold text-lg text-emerald-500">
                          R$ {totalValue.toFixed(2).replace(".", ",")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-xl py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Nenhum cliente cadastrado ainda</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Os cadastros aparecerão aqui</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
