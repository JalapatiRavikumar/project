import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import { toast } from "sonner";
import { signUp, signIn } from "@/lib/auth";

type AuthMode = "signin" | "signup" | "forgot";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get("mode") as AuthMode;
    if (modeParam && ["signin", "signup", "forgot"].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [searchParams]);

  const handleSubmit = async (data: { email: string; password?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "forgot") {
        // Password reset functionality (placeholder)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Reset link sent!", {
          description: "Check your email for the password reset link.",
        });
        return;
      }

      if (!data.password) {
        setError("Password is required");
        return;
      }

      if (mode === "signup") {
        await signUp(data.email, data.password);
        toast.success("Account created!", {
          description: "You can now sign in with your credentials.",
        });
        navigate("/auth?mode=signin");
        return;
      }

      if (mode === "signin") {
        await signIn(data.email, data.password);
        toast.success("Welcome back!");
        navigate("/dashboard");
        return;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Will be replaced with real Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info("Google authentication will be available soon!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AuthForm
            mode={mode}
            onSubmit={handleSubmit}
            onGoogleAuth={handleGoogleAuth}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default Auth;
