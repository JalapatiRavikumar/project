import { Link, useLocation } from "react-router-dom";
import { FileCode, Plus, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Header = ({ isAuthenticated = false, onLogout }: HeaderProps) => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <FileCode className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Paste</span>
              <span className="text-foreground">Bin</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button 
              variant={location.pathname === "/" ? "default" : "ghost"} 
              size="sm" 
              asChild
            >
              <Link to="/">
                <Plus className="h-4 w-4" />
                New Paste
              </Link>
            </Button>

            {isAuthenticated ? (
              <>
                <Button 
                  variant={location.pathname === "/dashboard" ? "default" : "ghost"} 
                  size="sm" 
                  asChild
                >
                  <Link to="/dashboard">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
