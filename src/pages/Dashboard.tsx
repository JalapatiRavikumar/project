import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PasteList, { PasteListItem } from "@/components/PasteList";
import { Button } from "@/components/ui/button";
import { Plus, FileCode } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getSession, signOut } from "@/lib/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [pastes, setPastes] = useState<PasteListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const session = getSession();
    if (!session) {
      navigate("/auth?mode=signin");
      return;
    }

    // Only load pastes if we have a session
    loadPastes();
  }, [navigate]);

  const loadPastes = () => {
    setIsLoading(true);
    
    try {
      // Load from localStorage (temporary, will use backend)
      const storedPastes = JSON.parse(localStorage.getItem("pastes") || "[]");
      
      const formattedPastes: PasteListItem[] = storedPastes
        .filter((p: any) => p && p.content && p.id) // Filter out invalid pastes
        .map((p: any) => {
          const content = p.content || "";
          const createdAt = p.createdAt ? new Date(p.createdAt) : new Date();
          const expiresAt = p.expiresAt ? new Date(p.expiresAt) : undefined;
          
          // Validate dates
          const validCreatedAt = isNaN(createdAt.getTime()) ? new Date() : createdAt;
          const validExpiresAt = expiresAt && !isNaN(expiresAt.getTime()) ? expiresAt : undefined;
          
          return {
            id: p.id,
            title: p.title || "Untitled",
            createdAt: validCreatedAt,
            expiresAt: validExpiresAt,
            currentViews: p.currentViews || 0,
            maxViews: p.maxViews,
            contentPreview: content.length > 100 ? content.substring(0, 100) + "..." : content,
          };
        });

      // Sort by newest first
      formattedPastes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setPastes(formattedPastes);
    } catch (error) {
      console.error("Error loading pastes:", error);
      toast.error("Failed to load pastes");
      setPastes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const storedPastes = JSON.parse(localStorage.getItem("pastes") || "[]");
    const updatedPastes = storedPastes.filter((p: any) => p.id !== id);
    localStorage.setItem("pastes", JSON.stringify(updatedPastes));
    
    setPastes((prev) => prev.filter((p) => p.id !== id));
    toast.success("Paste deleted successfully");
  };

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} onLogout={handleLogout} />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Pastes</h1>
              <p className="text-muted-foreground">
                Manage all your code snippets in one place
              </p>
            </div>
            <Button asChild>
              <Link to="/">
                <Plus className="h-4 w-4" />
                New Paste
              </Link>
            </Button>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            {pastes.length} paste{pastes.length !== 1 ? "s" : ""} total
          </div>

          <PasteList 
            pastes={pastes} 
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
