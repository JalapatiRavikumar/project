import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PasteForm, { PasteData } from "@/components/PasteForm";
import { FileCode, Zap, Shield, Clock } from "lucide-react";
import { isAuthenticated as checkAuth, signOut } from "@/lib/auth";

// Mock paste storage (will be replaced with real backend)
const generateId = () => Math.random().toString(36).substring(2, 10);

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const handleCreatePaste = useCallback(async (data: PasteData): Promise<string> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const pasteId = generateId();
    
    // Calculate expiration
    let expiresAt: Date | undefined;
    const now = new Date();
    switch (data.expiresIn) {
      case "10m":
        expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
        break;
      case "1h":
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      case "1d":
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case "7d":
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // Store paste in localStorage (temporary, will use backend)
    const paste = {
      id: pasteId,
      title: data.title,
      content: data.content,
      createdAt: now.toISOString(),
      expiresAt: expiresAt?.toISOString(),
      maxViews: data.maxViews !== "unlimited" ? parseInt(data.maxViews) : undefined,
      currentViews: 0,
      isPrivate: data.isPrivate,
    };
    
    const pastes = JSON.parse(localStorage.getItem("pastes") || "[]");
    pastes.push(paste);
    localStorage.setItem("pastes", JSON.stringify(pastes));
    
    const pasteUrl = `${window.location.origin}/paste/${pasteId}`;
    
    // Navigate to the paste
    navigate(`/paste/${pasteId}`);
    
    return pasteUrl;
  }, [navigate]);

  const features = useMemo(() => [
    {
      icon: Zap,
      title: "Instant Sharing",
      description: "Create and share code snippets in seconds",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption for your sensitive data",
    },
    {
      icon: Clock,
      title: "Auto-Expiry",
      description: "Set time or view-based expiration for your pastes",
    },
  ], []);

  const handleLogout = () => {
    signOut();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <FileCode className="h-4 w-4" />
              <span>Simple. Fast. Secure.</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              Share code snippets
              <br />
              <span className="gradient-text">effortlessly</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create, share, and manage your code pastes with powerful features like 
              auto-expiration, view limits, and secure sharing.
            </p>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </section>

          {/* Paste Form */}
          <section className="max-w-3xl mx-auto">
            <PasteForm onSubmit={handleCreatePaste} isAuthenticated={isAuthenticated} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PasteBin. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
