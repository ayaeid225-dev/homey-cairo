import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/housing/ListingCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Search } from "lucide-react";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Listing[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    supabase.from("listings").select("*").eq("status", "verified").eq("is_featured", true).limit(6)
      .then(({ data }) => setFeatured((data as Listing[]) ?? []));
  }, []);

  return (
    <AppShell>
      <section className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-primary-foreground shadow-elegant mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-primary-foreground/80 mb-6 max-w-lg">Find your next safe, verified home near your university.</p>
        <Button size="lg" variant="secondary" className="gap-2" onClick={() => navigate("/listings")}>
          <Search className="h-4 w-4" /> Browse listings <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Featured listings</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/listings")}>See all <ArrowRight className="h-4 w-4 ml-1" /></Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>
    </AppShell>
  );
};

export default Home;
