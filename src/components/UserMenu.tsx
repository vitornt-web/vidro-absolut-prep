import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Button
        variant="goldOutline"
        size="sm"
        onClick={() => navigate("/auth")}
        className="fixed top-4 right-4 z-40"
      >
        <User className="w-4 h-4 mr-2" />
        Entrar
      </Button>
    );
  }

  // Get the first name from user metadata or email
  const getFirstName = () => {
    const name = user.user_metadata?.name as string | undefined;
    if (name) {
      return name.split(" ")[0];
    }
    // Fallback to email if no name
    return user.email?.split("@")[0] || "Usuário";
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
      <div className="text-right">
        <p className="text-sm font-medium truncate max-w-[150px]">{getFirstName()}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={signOut}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserMenu;
