import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { HomeyLogo } from "@/components/HomeyLogo";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-soft p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <HomeyLogo className="h-12 w-12" />
          <Button variant="outline" onClick={async () => { await signOut(); navigate("/login"); }}>Sign out</Button>
        </div>
        <div className="bg-card rounded-3xl shadow-soft p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to Homey 👋</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <p className="text-sm text-muted-foreground mt-4">Your home feed and search will appear here next.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
