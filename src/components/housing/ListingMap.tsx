import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Listing } from "@/lib/types";
import { Link } from "react-router-dom";

const icon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background:hsl(215 65% 18%); width:32px; height:32px; border-radius:50% 50% 50% 0; transform: rotate(-45deg); display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 3px solid white;"><span style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 14px;">🏠</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export const ListingMap = ({ listings, height = "400px" }: { listings: Listing[]; height?: string }) => {
  const points = listings.filter((l) => l.latitude && l.longitude);
  const center: [number, number] = points.length
    ? [points[0].latitude!, points[0].longitude!]
    : [30.0444, 31.2357];

  return (
    <div className="rounded-3xl overflow-hidden shadow-soft border border-border" style={{ height }}>
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.map((l) => (
          <Marker key={l.id} position={[l.latitude!, l.longitude!]} icon={icon}>
            <Popup>
              <Link to={`/listings/${l.id}`} className="block min-w-[180px]">
                <strong>{l.title}</strong>
                <div>EGP {l.price.toLocaleString()} / mo</div>
                <div className="text-xs">{l.area}</div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
