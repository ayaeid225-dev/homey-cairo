import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/housing/ListingCard";
import { ListingFilters, Filters } from "@/components/housing/ListingFilters";
import { ListingMap } from "@/components/housing/ListingMap";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

const Listings = () => {
  const [all, setAll] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "", area: "all", type: "all", gender: "all", furnished: false, maxPrice: 20000, amenities: [],
  });

  useEffect(() => {
    supabase.from("listings").select("*").eq("status", "verified").order("is_featured", { ascending: false })
      .then(({ data }) => setAll((data as unknown as Listing[]) ?? []));
  }, []);

  const filtered = useMemo(() => all.filter((l) => {
    if (filters.search && !`${l.title} ${l.area} ${l.address ?? ""}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.area !== "all" && l.area !== filters.area) return false;
    if (filters.type !== "all" && l.type !== filters.type) return false;
    if (filters.gender !== "all" && l.gender_pref !== filters.gender && l.gender_pref !== "any") return false;
    if (filters.furnished && !l.furnished) return false;
    if (l.price > filters.maxPrice) return false;
    if (filters.amenities.length && !filters.amenities.every((a) => l.amenities.includes(a))) return false;
    return true;
  }), [all, filters]);

  const featured = filtered.filter((l) => l.is_featured);

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <aside><ListingFilters filters={filters} setFilters={setFilters} /></aside>
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Browse Housing</h1>
              <p className="text-sm text-muted-foreground">{filtered.length} verified listings</p>
            </div>
          </div>

          <Tabs defaultValue="grid">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-6">
              {featured.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    <Sparkles className="h-4 w-4 text-primary" /> Featured
                  </h2>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </div>
              )}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">All listings</h2>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
                </div>
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">No listings match your filters.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="map">
              <ListingMap listings={filtered} height="600px" />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </AppShell>
  );
};

export default Listings;
