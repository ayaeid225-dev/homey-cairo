import { Link } from "react-router-dom";
import { Listing } from "@/lib/types";
import { BadgeCheck, Heart, MapPin, Bed, Bath, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const ListingCard = ({ listing }: { listing: Listing }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("saved_listings").select("id").eq("student_id", user.id).eq("listing_id", listing.id).maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, listing.id]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (saved) {
      await supabase.from("saved_listings").delete().eq("student_id", user.id).eq("listing_id", listing.id);
      setSaved(false);
    } else {
      await supabase.from("saved_listings").insert({ student_id: user.id, listing_id: listing.id });
      setSaved(true);
      toast.success("Saved to favorites");
    }
  };

  return (
    <Link to={`/listings/${listing.id}`} className="group block bg-card rounded-3xl shadow-soft overflow-hidden hover:shadow-elegant transition-smooth">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {listing.photos[0] && (
          <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-smooth" loading="lazy" />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.is_featured && (
            <Badge className="bg-gradient-primary text-primary-foreground border-0">
              <Sparkles className="h-3 w-3 mr-1" /> Featured
            </Badge>
          )}
          <Badge className="bg-accent text-accent-foreground border-0">
            <BadgeCheck className="h-3 w-3 mr-1" /> Verified
          </Badge>
        </div>
        <button onClick={toggleSave} className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-smooth">
          <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-primary">EGP {listing.price.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">/ month</div>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <MapPin className="h-3.5 w-3.5" /> {listing.area}
          {listing.distance_km != null && <span className="text-xs">• {listing.distance_km} km from {listing.university}</span>}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{listing.rooms}</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{listing.bathrooms}</span>
          {listing.furnished && <Badge variant="secondary" className="text-xs">Furnished</Badge>}
        </div>
      </div>
    </Link>
  );
};
