import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2, Minus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Purchase {
  id: string;
  purchase_type: string;
  amount: number;
  name: string;
  phone: string | null;
  telegram: string | null;
  name_2: string | null;
  phone_2: string | null;
  telegram_2: string | null;
  created_at: string;
}

interface AdminSettings {
  id: string;
  total_collected_adjustment: number;
}

interface AdminPanelProps {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

const AdminPanel = ({ isOpenExternal, onCloseExternal }: AdminPanelProps) => {
  const { isAdmin, signOut } = useAuth();
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [adjustmentInput, setAdjustmentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Usa controle externo se fornecido, senão usa interno
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;
  const setIsOpen = onCloseExternal ? () => onCloseExternal() : setIsOpenInternal;

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadData();
    }
  }, [isOpen, isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from("purchases")
        .select("*")
        .order("created_at", { ascending: false });

      if (purchasesError) throw purchasesError;
      setPurchases(purchasesData || []);

      // Load admin settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("admin_settings")
        .select("*")
        .single();

      if (settingsError && settingsError.code !== "PGRST116") throw settingsError;
      setAdminSettings(settingsData);
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onCloseExternal) {
      onCloseExternal();
    } else {
      setIsOpenInternal(false);
    }
  };

  const applyAdjustment = async () => {
    const value = parseFloat(adjustmentInput.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (!adminSettings) return;

    const newAdjustment = (adminSettings.total_collected_adjustment || 0) + value;

    const { error } = await supabase
      .from("admin_settings")
      .update({ total_collected_adjustment: newAdjustment })
      .eq("id", adminSettings.id);

    if (error) {
      toast.error("Erro ao aplicar ajuste");
      return;
    }

    setAdminSettings({ ...adminSettings, total_collected_adjustment: newAdjustment });
    setAdjustmentInput("");
    toast.success(`R$ ${value.toFixed(2).replace(".", ",")} subtraído do total`);
  };

  const deletePurchase = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta compra?")) return;

    const { error } = await supabase.from("purchases").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir compra");
      return;
    }

    setPurchases(purchases.filter((p) => p.id !== id));
    toast.success("Compra excluída");
  };

  const grossTotal = purchases.reduce((sum, p) => sum + Number(p.amount), 0);
  const adjustment = adminSettings?.total_collected_adjustment || 0;
  const netTotal = grossTotal - adjustment;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Only show admin button if user is admin and no external control
  if (!isAdmin) {
    return null;
  }

  // Se está sendo controlado externamente, não mostra o botão flutuante
  if (isOpenExternal === undefined && !isOpenInternal) {
    return (
      <button
        onClick={() => setIsOpenInternal(true)}
        className="fixed bottom-4 right-4 bg-gold text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gold/90 transition-colors"
      >
        Painel Admin
      </button>
    );
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold">Painel de Vendas - Admin</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Dashboard */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Total de Compras</p>
                  <p className="text-3xl font-bold text-gold">{purchases.length}</p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Valor Bruto</p>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {grossTotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Ajustes</p>
                  <p className="text-2xl font-bold text-destructive">
                    -R$ {adjustment.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Valor Líquido</p>
                  <p className="text-3xl font-bold text-emerald-500">
                    R$ {netTotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              {/* Adjustment Control */}
              <div className="bg-secondary/50 rounded-xl p-4 border border-border mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Minus className="w-4 h-4" />
                  Diminuir Valor Arrecadado
                </h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Valor a subtrair (ex: 45,00)"
                    value={adjustmentInput}
                    onChange={(e) => setAdjustmentInput(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button variant="outline" onClick={applyAdjustment}>
                    Aplicar
                  </Button>
                </div>
              </div>

              {/* Table Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Compras Registradas</h3>
              </div>

              {/* Table */}
              {purchases.length > 0 ? (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Data</th>
                          <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Tipo</th>
                          <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Pessoa 1</th>
                          <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Pessoa 2</th>
                          <th className="text-right p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Valor</th>
                          <th className="text-center p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((purchase) => (
                          <tr key={purchase.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                            <td className="p-4 text-muted-foreground">{formatDate(purchase.created_at)}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                purchase.purchase_type === "casadinha"
                                  ? "bg-gold/20 text-gold"
                                  : "bg-secondary text-foreground"
                              }`}>
                                {purchase.purchase_type === "casadinha" ? "Casadinha" : "Individual"}
                              </span>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{purchase.name}</p>
                                <p className="text-xs text-muted-foreground">{purchase.phone || "-"}</p>
                                {purchase.telegram && (
                                  <a
                                    href={`https://t.me/${purchase.telegram.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-gold hover:underline"
                                  >
                                    {purchase.telegram}
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              {purchase.name_2 ? (
                                <div>
                                  <p className="font-medium">{purchase.name_2}</p>
                                  <p className="text-xs text-muted-foreground">{purchase.phone_2 || "-"}</p>
                                  {purchase.telegram_2 && (
                                    <a
                                      href={`https://t.me/${purchase.telegram_2.replace("@", "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-gold hover:underline"
                                    >
                                      {purchase.telegram_2}
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="p-4 text-right font-semibold text-emerald-500">
                              R$ {Number(purchase.amount).toFixed(2).replace(".", ",")}
                            </td>
                            <td className="p-4 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePurchase(purchase.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-secondary/80">
                        <tr>
                          <td colSpan={4} className="p-4 text-right font-semibold text-muted-foreground">TOTAL LÍQUIDO:</td>
                          <td className="p-4 text-right font-bold text-lg text-emerald-500">
                            R$ {netTotal.toFixed(2).replace(".", ",")}
                          </td>
                          <td></td>
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
                  <p className="text-muted-foreground">Nenhuma compra registrada ainda</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">As compras aparecerão aqui</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
