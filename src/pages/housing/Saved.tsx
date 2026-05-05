import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/housing/ListingCard";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";

const Saved = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Listing[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("saved_listings").select("listing_id, listings(*)").eq("student_id", user.id)
      .then(({ data }) => {
        const list = (data as unknown as { listings: Listing }[]) ?? [];
        setItems(list.map((d) => d.listings).filter(Boolean));
      });
  }, [user]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center"><Heart className="h-6 w-6 text-primary-foreground" /></div>
          <div>
            <h1 className="text-2xl font-bold">Saved listings</h1>
            <p className="text-sm text-muted-foreground">{items.length} bookmarks</p>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No saved listings yet. Tap the ❤ on any listing to save it.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Saved;
