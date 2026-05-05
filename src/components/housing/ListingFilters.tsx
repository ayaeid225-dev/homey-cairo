import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Filters = {
  search: string;
  area: string;
  type: string;
  gender: string;
  furnished: boolean;
  maxPrice: number;
  amenities: string[];
};

const AMENITIES = ["WiFi", "AC", "Washer", "Elevator", "Security", "Parking", "Garden", "Doorman"];

export const ListingFilters = ({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) => {
  const toggleAmenity = (a: string) => {
    setFilters({
      ...filters,
      amenities: filters.amenities.includes(a) ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a],
    });
  };

  return (
    <div className="bg-card rounded-3xl shadow-soft p-5 space-y-5 lg:sticky lg:top-20">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input placeholder="Title or area..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Area</Label>
        <Select value={filters.area} onValueChange={(v) => setFilters({ ...filters, area: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            <SelectItem value="New Cairo">New Cairo</SelectItem>
            <SelectItem value="Zamalek">Zamalek</SelectItem>
            <SelectItem value="Maadi">Maadi</SelectItem>
            <SelectItem value="Dokki">Dokki</SelectItem>
            <SelectItem value="Nasr City">Nasr City</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="room">Private Room</SelectItem>
            <SelectItem value="shared">Shared Room</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Gender preference</Label>
        <Select value={filters.gender} onValueChange={(v) => setFilters({ ...filters, gender: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="male">Male only</SelectItem>
            <SelectItem value="female">Female only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Max price: EGP {filters.maxPrice.toLocaleString()}</Label>
        <Slider min={1000} max={20000} step={500} value={[filters.maxPrice]} onValueChange={([v]) => setFilters({ ...filters, maxPrice: v })} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="furnished">Furnished only</Label>
        <Switch id="furnished" checked={filters.furnished} onCheckedChange={(c) => setFilters({ ...filters, furnished: c })} />
      </div>
      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button key={a} onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                filters.amenities.includes(a) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}>
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
