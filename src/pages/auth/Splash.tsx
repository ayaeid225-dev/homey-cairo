import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeyLogo } from "@/components/HomeyLogo";
import { useAuth } from "@/contexts/AuthContext";

const Splash = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const seen = localStorage.getItem("homey_onboarded");
    const t = setTimeout(() => {
      if (user) navigate("/home", { replace: true });
      else if (seen) navigate("/login", { replace: true });
      else navigate("/onboarding", { replace: true });
    }, 1800);
    return () => clearTimeout(t);
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero">
      <div className="animate-scale-in">
        <div className="bg-white rounded-3xl p-6 shadow-glow animate-float">
          <HomeyLogo className="h-32 w-32" />
        </div>
      </div>
      <div className="mt-8 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-primary-foreground">Homey</h1>
        <p className="mt-2 text-primary-foreground/80">Find. Connect. Live Easy.</p>
      </div>
    </div>
  );
};

export default Splash;