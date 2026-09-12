"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Pane, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Hospital, Pharmacy } from "@/types/medical";
import { formatDistance } from "@/utils/distance";

// Leaflet's default image paths need to be restored when bundled by Next.js.
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = (color: string, emoji: string) => L.divIcon({
  html: `<div style="background:${color};width:42px;height:42px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:19px;line-height:36px">${emoji}</span></div>`,
  className: "swasth-marker",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
});

const hospitalIcon = createCustomIcon("#dc2626", "🏥");
const emergencyHospitalIcon = createCustomIcon("#991b1b", "🚨");
const pharmacyIcon = createCustomIcon("#059669", "💊");
const appointmentIcon = createCustomIcon("#7c3aed", "📅");
const userIcon = L.divIcon({
  html: `<div style="width:22px;height:22px;border-radius:50%;background:#2563eb;border:4px solid white;box-shadow:0 0 0 5px rgba(37,99,235,.25)"></div>`,
  className: "swasth-user-marker",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function MapResize() {
  const map = useMap();
  useEffect(() => {
    const resize = () => map.invalidateSize({ pan: false });
    resize();
    const t = window.setTimeout(resize, 250);
    return () => window.clearTimeout(t);
  }, [map]);
  return null;
}

function FitPlaces({ hospitals, pharmacies, userLocation, appointment }: { hospitals: Hospital[]; pharmacies: Pharmacy[]; userLocation: [number, number] | null; appointment: any | null }) {
  const map = useMap();
  useEffect(() => {
    const points: [number, number][] = [];
    if (userLocation) points.push(userLocation);
    if (appointment && Number.isFinite(appointment.lat) && Number.isFinite(appointment.lng)) points.push([appointment.lat, appointment.lng]);
    hospitals.forEach((p) => points.push([p.lat, p.lng]));
    pharmacies.forEach((p) => points.push([p.lat, p.lng]));
    if (!points.length) return;
    const timer = window.setTimeout(() => {
      if (points.length > 1) map.fitBounds(points, { padding: [90, 90], maxZoom: 15, animate: false });
      else map.setView(points[0], 15, { animate: false });
      map.invalidateSize({ pan: false });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [hospitals, pharmacies, userLocation, appointment, map]);
  return null;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 15, { animate: true, duration: 0.7 });
  }, [target, map]);
  return null;
}

function placeSearchUrl(place: { name: string; address: string }) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.address}`)}`;
}

function directionsUrl(lat: number, lng: number, origin: [number, number] | null) {
  const originPart = origin ? `&origin=${encodeURIComponent(`${origin[0]},${origin[1]}`)}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}${originPart}&travelmode=driving`;
}

interface MedicalMapProps {
  hospitals: Hospital[];
  pharmacies: Pharmacy[];
  userLocation: [number, number] | null;
  selectedHospital: Hospital | null;
  selectedPharmacy: Pharmacy | null;
  filter: "all" | "hospitals" | "pharmacies";
  onFilterChange: (filter: "all" | "hospitals" | "pharmacies") => void;
  onSelectHospital: (h: Hospital) => void;
  onSelectPharmacy: (p: Pharmacy) => void;
  flyTarget: [number, number] | null;
  searchRadius: number;
  appointment: any | null;
  onAppointmentFocus: () => void;
}

export default function MedicalMap({
  hospitals,
  pharmacies,
  userLocation,
  selectedHospital,
  selectedPharmacy,
  filter,
  onFilterChange,
  onSelectHospital,
  onSelectPharmacy,
  flyTarget,
  searchRadius,
  appointment,
  onAppointmentFocus,
}: MedicalMapProps) {
  // India-only viewport. A fallback center is only a map view, never a claimed user location.
  const center: [number, number] = userLocation || [22.9734, 78.6569];
  const indiaBounds: [[number, number], [number, number]] = [[6.0, 67.0], [37.5, 98.0]];

  return (
    <div className="relative h-full w-full">
      {/* These controls are deliberately ABOVE Leaflet's panes, so they cannot disappear behind the map. */}
      <div className="absolute top-4 left-4 z-[2000] pointer-events-auto flex flex-wrap gap-2 max-w-[calc(100%-2rem)]">
        {[
          ["all", "🗺️ All"],
          ["hospitals", `🏥 Hospitals (${hospitals.length})`],
          ["pharmacies", `💊 Pharmacies (${pharmacies.length})`],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value as "all" | "hospitals" | "pharmacies")}
            className={`px-3 py-2 rounded-xl shadow-lg border text-xs font-bold backdrop-blur ${filter === value ? "bg-blue-600 text-white border-blue-600" : "bg-white/95 text-gray-700 border-white hover:bg-white"}`}
          >{label}</button>
        ))}
        {appointment && (
          <button type="button" onClick={onAppointmentFocus} className="px-3 py-2 rounded-xl shadow-lg border border-purple-200 bg-purple-600 text-white text-xs font-bold">
            📅 Appointment
          </button>
        )}
        {userLocation && <>
          <button type="button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hospitals near ${userLocation[0]},${userLocation[1]}`)}`, "_blank", "noopener,noreferrer")} className="px-3 py-2 rounded-xl shadow-lg border border-red-200 bg-white/95 text-red-700 text-xs font-bold">Google Maps • Hospitals</button>
          <button type="button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`pharmacy near ${userLocation[0]},${userLocation[1]}`)}`, "_blank", "noopener,noreferrer")} className="px-3 py-2 rounded-xl shadow-lg border border-emerald-200 bg-white/95 text-emerald-700 text-xs font-bold">Google Maps • Medical Shops</button>
        </>}
      </div>

      {!userLocation && <div className="absolute bottom-4 left-4 z-[2000] max-w-sm bg-white/95 backdrop-blur rounded-xl shadow-xl border border-amber-200 px-3 py-2 pointer-events-none">
        <div className="text-xs font-semibold text-amber-800">📍 Exact device location not available yet</div>
        <div className="text-[11px] text-gray-500 mt-0.5">Press Use my location. Swasth will not invent a location.</div>
      </div>}

      <MapContainer
        center={center}
        zoom={userLocation ? 14 : 5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        minZoom={5}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          noWrap={true}
          bounds={indiaBounds}
        />
        <ZoomControl position="bottomright" />
        <Pane name="healthcareMarkers" style={{ zIndex: 500 }} />
        <Pane name="appointmentMarker" style={{ zIndex: 650 }} />
        <Pane name="userMarker" style={{ zIndex: 700 }} />
        <MapResize />
        <FlyTo target={flyTarget} />
        <FitPlaces hospitals={hospitals} pharmacies={pharmacies} userLocation={userLocation} appointment={appointment} />

        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon} pane="userMarker" zIndexOffset={1200}>
              <Popup><strong>📍 Your current browser location</strong></Popup>
            </Marker>
            <Circle center={userLocation} radius={Math.min(searchRadius * 1000, 15000)} pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.04, weight: 1 }} />
          </>
        )}

        {appointment && Number.isFinite(appointment.lat) && Number.isFinite(appointment.lng) && (
          <Marker position={[appointment.lat, appointment.lng]} icon={appointmentIcon} pane="appointmentMarker" zIndexOffset={1500}>
            <Popup minWidth={270}>
              <div className="p-1">
                <div className="font-bold text-purple-700">📅 Appointment hospital</div>
                <div className="font-semibold text-gray-900 mt-1">{appointment.name}</div>
                <div className="text-xs text-gray-600 mt-1">{appointment.address}</div>
                <div className="text-xs text-gray-600 mt-1">{appointment.date} • {appointment.time}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button type="button" onClick={() => appointment.phone && window.open(`tel:${appointment.phone}`)} disabled={!appointment.phone} className="bg-green-600 text-white text-xs py-2 rounded-lg disabled:opacity-40">📞 Call</button>
                  <button type="button" onClick={() => window.open(directionsUrl(appointment.lat, appointment.lng, userLocation), "_blank", "noopener,noreferrer")} className="bg-purple-600 text-white text-xs py-2 rounded-lg">🗺️ Directions</button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {(filter === "all" || filter === "hospitals") && hospitals.map((hospital) => (
          <Marker
            key={`h-${hospital.id}`}
            position={[hospital.lat, hospital.lng]}
            icon={hospital.emergency ? emergencyHospitalIcon : hospitalIcon}
            pane="healthcareMarkers"
            zIndexOffset={500}
            eventHandlers={{ click: () => onSelectHospital(hospital) }}
          >
            <Popup minWidth={280}>
              <div className="p-1">
                <div className="font-bold text-sm text-gray-900">🏥 {hospital.name}</div>
                <div className="text-xs text-gray-600 mt-1">📍 {hospital.address}</div>
                {hospital.phone && <div className="text-xs text-gray-600 mt-1">📞 {hospital.phone}</div>}
                {hospital.openingHoursText && <div className="text-xs text-gray-600 mt-1">🕐 {hospital.openingHoursText}</div>}
                {hospital.services?.length ? <div className="text-xs text-gray-600 mt-1">Services: {hospital.services.join(", ")}</div> : null}
                <div className="text-[11px] text-gray-400 mt-2">Live mapped details • OpenStreetMap</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button type="button" onClick={() => onSelectHospital(hospital)} className="bg-blue-600 text-white text-xs py-2 rounded-lg">Details</button>
                  <button type="button" onClick={() => window.open(directionsUrl(hospital.lat, hospital.lng, userLocation), "_blank", "noopener,noreferrer")} className="bg-green-600 text-white text-xs py-2 rounded-lg">🗺️ Directions</button>
                </div>
                <button type="button" onClick={() => window.open(placeSearchUrl(hospital), "_blank", "noopener,noreferrer")} className="w-full mt-2 border border-gray-200 text-gray-700 text-xs py-2 rounded-lg">View on Google Maps</button>
              </div>
            </Popup>
          </Marker>
        ))}

        {(filter === "all" || filter === "pharmacies") && pharmacies.map((pharmacy) => (
          <Marker
            key={`p-${pharmacy.id}`}
            position={[pharmacy.lat, pharmacy.lng]}
            icon={pharmacyIcon}
            pane="healthcareMarkers"
            zIndexOffset={450}
            eventHandlers={{ click: () => onSelectPharmacy(pharmacy) }}
          >
            <Popup minWidth={280}>
              <div className="p-1">
                <div className="font-bold text-sm text-gray-900">💊 {pharmacy.name}</div>
                <div className="text-xs text-gray-600 mt-1">📍 {pharmacy.address}</div>
                {pharmacy.phone && <div className="text-xs text-gray-600 mt-1">📞 {pharmacy.phone}</div>}
                {pharmacy.openingHoursText && <div className="text-xs text-gray-600 mt-1">🕐 {pharmacy.openingHoursText}</div>}
                <div className="text-[11px] text-gray-400 mt-2">Live mapped details • OpenStreetMap</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button type="button" onClick={() => onSelectPharmacy(pharmacy)} className="bg-blue-600 text-white text-xs py-2 rounded-lg">Details</button>
                  <button type="button" onClick={() => window.open(directionsUrl(pharmacy.lat, pharmacy.lng, userLocation), "_blank", "noopener,noreferrer")} className="bg-green-600 text-white text-xs py-2 rounded-lg">🗺️ Directions</button>
                </div>
                <button type="button" onClick={() => window.open(placeSearchUrl(pharmacy), "_blank", "noopener,noreferrer")} className="w-full mt-2 border border-gray-200 text-gray-700 text-xs py-2 rounded-lg">View on Google Maps</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
