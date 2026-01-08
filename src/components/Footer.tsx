import vidroLogo from "@/assets/vidro-logo.jpg";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={vidroLogo} alt="Vidro Absolut" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-xl font-display font-bold">
              Vidro <span className="text-gradient-gold">Absolut</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#benefits" className="hover:text-gold transition-colors">
              Como Funciona
            </a>
            <a href="#checkout" className="hover:text-gold transition-colors">
              Quero me Inscrever
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
  );
};

export default Footer;
