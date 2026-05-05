import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARPreview } from "@/components/housing/ARPreview";
import { ListingMap } from "@/components/housing/ListingMap";
import { BadgeCheck, Bed, Bath, MapPin, Wifi, MessageCircle, Star, Sparkles, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Review = { id: string; rating: number; comment: string | null; reviewer_id: string; created_at: string };
type Inventory = { id: string; name: string; quantity: number; condition: string | null };

const ListingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const loadReviews = async () => {
    if (!id) return;
    const { data } = await supabase.from("listing_reviews").select("*").eq("listing_id", id).order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
  };

  useEffect(() => {
    if (!id) return;
    supabase.from("listings").select("*").eq("id", id).maybeSingle().then(({ data }) => setListing(data as unknown as Listing));
    loadReviews();
    supabase.from("inventory_items").select("*").eq("listing_id", id)
      .then(({ data }) => setInventory((data as Inventory[]) ?? []));
    // eslint-disable-next-line
  }, [id]);

  const submitReview = async () => {
    if (!user || !id) { toast.error("Please log in"); return; }
    const { error } = await supabase.from("listing_reviews").upsert({ listing_id: id, reviewer_id: user.id, rating: newRating, comment: newComment });
    if (error) toast.error(error.message);
    else { toast.success("Review posted"); setNewComment(""); loadReviews(); }
  };

  if (!listing) return <AppShell><div className="text-center py-20 text-muted-foreground">Loading...</div></AppShell>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid md:grid-cols-[2fr_1fr] gap-3">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted">
            {listing.photos[activePhoto] && <img src={listing.photos[activePhoto]} alt={listing.title} className="w-full h-full object-cover" />}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {listing.photos.slice(0, 4).map((p, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} className={`aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden ${i === activePhoto ? "ring-4 ring-primary" : ""}`}>
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground border-0"><BadgeCheck className="h-3 w-3 mr-1" /> Verified</Badge>
              {listing.is_featured && <Badge className="bg-gradient-primary text-primary-foreground border-0"><Sparkles className="h-3 w-3 mr-1" /> Featured</Badge>}
              {avgRating && <Badge variant="secondary"><Star className="h-3 w-3 mr-1 fill-current" /> {avgRating} ({reviews.length})</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <div className="flex items-center text-muted-foreground mt-1 gap-1"><MapPin className="h-4 w-4" />{listing.address || listing.area}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">EGP {listing.price.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">/ month</div>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-soft p-5 flex flex-wrap gap-6">
          <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /><span>{listing.rooms} rooms</span></div>
          <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-primary" /><span>{listing.bathrooms} baths</span></div>
          <div className="flex items-center gap-2"><Wifi className="h-5 w-5 text-primary" /><span>{listing.furnished ? "Furnished" : "Unfurnished"}</span></div>
          {listing.distance_km != null && <div>📍 {listing.distance_km} km from {listing.university}</div>}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="bg-gradient-primary shadow-soft gap-2"><MessageCircle className="h-4 w-4" /> Contact Landlord</Button>
          <ARPreview photo={listing.photos[0]} />
          {listing.virtual_tour_link && (
            <Button variant="outline" asChild><a href={listing.virtual_tour_link} target="_blank" rel="noreferrer">3D Virtual Tour</a></Button>
          )}
        </div>

        <section className="bg-card rounded-3xl shadow-soft p-6">
          <h2 className="text-lg font-semibold mb-2">About this place</h2>
          <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
        </section>

        <section className="bg-card rounded-3xl shadow-soft p-6">
          <h2 className="text-lg font-semibold mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((a) => (<Badge key={a} variant="secondary" className="px-3 py-1.5">{a}</Badge>))}
          </div>
        </section>

        <section className="bg-card rounded-3xl shadow-soft p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Package className="h-5 w-5" /> Inventory included</h2>
          {inventory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inventory listed yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {inventory.map((i) => (
                <li key={i.id} className="flex justify-between py-2">
                  <span>{i.name} <span className="text-muted-foreground">×{i.quantity}</span></span>
                  {i.condition && <span className="text-sm text-muted-foreground">{i.condition}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        {listing.latitude && listing.longitude && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Location</h2>
            <ListingMap listings={[listing]} height="350px" />
          </section>
        )}

        <section className="bg-card rounded-3xl shadow-soft p-6 space-y-4">
          <h2 className="text-lg font-semibold">Reviews ({reviews.length})</h2>
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-border pb-3 last:border-0">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-sm">{r.comment}</p>
            </div>
          ))}

          {user && (
            <div className="pt-4 border-t border-border space-y-3">
              <p className="font-medium">Leave a review</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setNewRating(n)}>
                    <Star className={`h-6 w-6 ${n <= newRating ? "fill-primary text-primary" : "text-muted"}`} />
                  </button>
                ))}
              </div>
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your experience..." className="w-full rounded-2xl border border-input p-3 text-sm bg-background" rows={3} />
              <Button onClick={submitReview} className="bg-gradient-primary">Post review</Button>
            </div>
          )}
        </section>

        <Link to="/listings" className="text-sm text-muted-foreground hover:text-foreground">← Back to listings</Link>
      </div>
    </AppShell>
  );
};

export default ListingDetails;
