import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import vidroLogo from "@/assets/vidro-logo.jpg";
import AdminPanel from "./AdminPanel";

const Footer = () => {
  const { isAdmin } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleLogoClick = () => {
    if (isAdmin) {
      setShowAdminPanel(true);
    }
  };

  return (
    <>
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo - Clicável para admins */}
            <button
              onClick={handleLogoClick}
              className={`flex items-center gap-3 ${isAdmin ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
              title={isAdmin ? "Clique para abrir o painel admin" : undefined}
            >
              <img 
                src={vidroLogo} 
                alt="Vidro Absolut" 
                className={`w-10 h-10 rounded-lg object-cover ${isAdmin ? "ring-2 ring-gold/50 ring-offset-2 ring-offset-background" : ""}`} 
              />
              <span className="text-xl font-display font-bold">
                Vidro <span className="text-gradient-gold">Absolut</span>
              </span>
            </button>

            {/* Links */}
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-gold transition-colors">
                Termos de uso
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Política de privacidade
              </a>
              <a 
                href="https://t.me/studyvituu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Contato
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © 2025 Vidro Absolut. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Panel Modal */}
      {showAdminPanel && isAdmin && (
        <AdminPanelModal onClose={() => setShowAdminPanel(false)} />
      )}
    </>
  );
};

// Componente separado para o modal do admin
const AdminPanelModal = ({ onClose }: { onClose: () => void }) => {
  return <AdminPanel isOpenExternal onCloseExternal={onClose} />;
};

export default Footer;
