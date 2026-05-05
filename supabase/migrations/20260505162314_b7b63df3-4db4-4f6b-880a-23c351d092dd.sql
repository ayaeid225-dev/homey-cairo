
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.gender_preference AS ENUM ('male', 'female', 'any');
CREATE TYPE public.listing_type AS ENUM ('apartment', 'room', 'studio', 'shared');

CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type listing_type NOT NULL DEFAULT 'apartment',
  price NUMERIC(10,2) NOT NULL,
  area TEXT NOT NULL,
  address TEXT,
  rooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  furnished BOOLEAN NOT NULL DEFAULT false,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  virtual_tour_link TEXT,
  ar_preview_url TEXT,
  gender_pref gender_preference NOT NULL DEFAULT 'any',
  university TEXT,
  distance_km NUMERIC(5,2),
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  status verification_status NOT NULL DEFAULT 'pending',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verified listings are public" ON public.listings
  FOR SELECT USING (status = 'verified' OR landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Landlords insert own listings" ON public.listings
  FOR INSERT WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords update own listings" ON public.listings
  FOR UPDATE USING (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Landlords delete own listings" ON public.listings
  FOR DELETE USING (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_area ON public.listings(area);
CREATE INDEX idx_listings_price ON public.listings(price);

-- Saved listings
CREATE TABLE public.saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, listing_id)
);
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own saves" ON public.saved_listings FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Users add own saves" ON public.saved_listings FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Users remove own saves" ON public.saved_listings FOR DELETE USING (student_id = auth.uid());

-- Reviews
CREATE TABLE public.listing_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(listing_id, reviewer_id)
);
ALTER TABLE public.listing_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public" ON public.listing_reviews FOR SELECT USING (true);
CREATE POLICY "Users add own reviews" ON public.listing_reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Users update own reviews" ON public.listing_reviews FOR UPDATE USING (reviewer_id = auth.uid());
CREATE POLICY "Users delete own reviews" ON public.listing_reviews FOR DELETE USING (reviewer_id = auth.uid());

-- Inventory items per listing (furniture, appliances)
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inventory follows listing visibility" ON public.inventory_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND (l.status = 'verified' OR l.landlord_id = auth.uid()))
);
CREATE POLICY "Landlord manages inventory" ON public.inventory_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.landlord_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.landlord_id = auth.uid())
);

-- Contract templates
CREATE TABLE public.contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are public" ON public.contract_templates FOR SELECT USING (true);

-- Seed sample verified listings + templates
INSERT INTO public.contract_templates (title, category, description, content) VALUES
('Roommate Agreement', 'roommate', 'Standard agreement between roommates covering rent split, chores, guests, and quiet hours.',
 E'ROOMMATE AGREEMENT\n\nThis agreement is entered into between the roommates listed below.\n\n1. RENT: Each roommate agrees to pay their equal share of rent by the 1st of each month.\n2. UTILITIES: Electricity, water, and internet shall be split equally.\n3. CLEANLINESS: Common areas must be kept tidy. Cleaning rotation as agreed.\n4. GUESTS: Overnight guests require 24h notice. Maximum stay 3 nights.\n5. QUIET HOURS: 11 PM – 8 AM on weekdays.\n6. TERMINATION: 30 days written notice required.\n\nSigned: ___________  Date: __________'),
('Standard Lease Agreement', 'lease', 'Landlord-tenant lease covering rent, deposit, utilities, and termination.',
 E'LEASE AGREEMENT\n\nLandlord: ____________\nTenant: ____________\nProperty: ____________\n\n1. TERM: 12 months starting __________\n2. RENT: EGP _____ per month, due on the 1st.\n3. SECURITY DEPOSIT: One month''s rent, refundable on move-out inspection.\n4. UTILITIES: Tenant pays electricity, water, internet.\n5. MAINTENANCE: Landlord handles structural; tenant handles minor repairs.\n6. TERMINATION: 60 days written notice.\n\nSigned: ____________  Date: __________'),
('Short-Term Sublet', 'sublet', 'Sublet template for short stays (1–6 months).',
 E'SUBLET AGREEMENT\n\nSublessor: ____________\nSublessee: ____________\nDuration: From _______ to _______\nMonthly Rent: EGP _____\n\n1. The Sublessee agrees to follow all rules of the original lease.\n2. Damages will be deducted from the deposit.\n3. Quiet hours and guest policy apply.\n\nSigned: ____________  Date: __________');
