import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PasteView, { Paste } from "@/components/PasteView";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { isAuthenticated, signOut } from "@/lib/auth";

const ViewPaste = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paste, setPaste] = useState<Paste | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  useEffect(() => {
    const loadPaste = () => {
      setIsLoading(true);
      
      // Load from localStorage (temporary, will use backend)
      const pastes = JSON.parse(localStorage.getItem("pastes") || "[]");
      const foundPaste = pastes.find((p: any) => p.id === id);
      
      if (!foundPaste) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      // Check expiration
      if (foundPaste.expiresAt && new Date(foundPaste.expiresAt) < new Date()) {
        setIsExpired(true);
        setIsLoading(false);
        return;
      }

      // Check view limit
      if (foundPaste.maxViews && foundPaste.currentViews >= foundPaste.maxViews) {
        setIsExpired(true);
        setIsLoading(false);
        return;
      }

      // Increment view count
      foundPaste.currentViews = (foundPaste.currentViews || 0) + 1;
      const updatedPastes = pastes.map((p: any) => 
        p.id === id ? foundPaste : p
      );
      localStorage.setItem("pastes", JSON.stringify(updatedPastes));

      setPaste({
        id: foundPaste.id,
        title: foundPaste.title,
        content: foundPaste.content,
        createdAt: new Date(foundPaste.createdAt),
        expiresAt: foundPaste.expiresAt ? new Date(foundPaste.expiresAt) : undefined,
        maxViews: foundPaste.maxViews,
        currentViews: foundPaste.currentViews,
        isOwner: true, // Will be determined by auth
      });
      
      setIsLoading(false);
    };

    loadPaste();
  }, [id]);

  const handleDelete = async (pasteId: string) => {
    const pastes = JSON.parse(localStorage.getItem("pastes") || "[]");
    const updatedPastes = pastes.filter((p: any) => p.id !== pasteId);
    localStorage.setItem("pastes", JSON.stringify(updatedPastes));
    navigate("/");
  };

  const handleLogout = () => {
    signOut();
    setAuthenticated(false);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={authenticated} onLogout={handleLogout} />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="glass-card p-8 animate-pulse">
              <div className="h-6 bg-secondary rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-secondary rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-secondary rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={authenticated} onLogout={handleLogout} />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="glass-card p-8 text-center animate-fade-in">
              <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Paste Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The paste you're looking for doesn't exist or has been deleted.
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Create New Paste
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={authenticated} onLogout={handleLogout} />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {isExpired ? (
            <PasteView 
              paste={{ 
                id: id || "", 
                title: "", 
                content: "", 
                createdAt: new Date(), 
                currentViews: 0 
              }} 
              isExpired={true} 
            />
          ) : paste ? (
            <PasteView 
              paste={paste} 
              onDelete={handleDelete}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default ViewPaste;
