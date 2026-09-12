"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Hospital, Pharmacy, MapFilter } from "@/types/medical";
import { getDistance, formatDistance } from "@/utils/distance";
import { getCurrentLocation } from "@/services/location";
import { fetchNearbyPlaces } from "@/services/openStreetMap";
import { HospitalCard, PharmacyCard } from "./PlaceCard";
import HospitalDetail from "./HospitalDetail";
import PharmacyDetail from "./PharmacyDetail";

const MedicalMap = dynamic(() => import("./MedicalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-bounce">🗺️</div>
        <p className="text-gray-600 font-medium">Loading Map...</p>
      </div>
    </div>
  ),
});

type SortBy = "distance" | "rating" | "name";
type PanelView = "list" | "detail";

export default function MedicalGPS() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [nearbyError, setNearbyError] = useState("");
  const [filter, setFilter] = useState<MapFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("distance");
  const [searchRadius, setSearchRadius] = useState(5); // km; India-only live search, up to 15 km
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [panelView, setPanelView] = useState<PanelView>("list");
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = useState<"hospitals" | "pharmacies" | "both">("both");
  const [loading, setLoading] = useState(true);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [open24hOnly, setOpen24hOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [appointment, setAppointment] = useState<any | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState<string[]>([]);

  // Load real nearby healthcare from OpenStreetMap after a location is known.
  const refreshNearby = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      setNearbyError("");
      const places = await fetchNearbyPlaces(latitude, longitude, searchRadius * 1000);
      setHospitals(places.filter((p: any) => p.category === "hospital") as Hospital[]);
      setPharmacies(places.filter((p: any) => p.category === "pharmacy") as Pharmacy[]);
    } catch (error) {
      console.warn("Nearby healthcare data", error);
      setNearbyError("Nearby healthcare is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchRadius]);

  // Get user location
  const getUserLocation = useCallback(async () => {
    if (locationLoading) return;
    setLocationLoading(true);
    setLocationError("");
    try {
      const { latitude, longitude, accuracy } = await getCurrentLocation();
      const loc: [number, number] = [latitude, longitude];
      setUserLocation(loc);
      setFlyTarget(loc);
      window.localStorage.setItem("swasth:last-location", JSON.stringify({ latitude, longitude, accuracy }));
      await refreshNearby(latitude, longitude);
    } catch (error: any) {
      console.warn("Location unavailable", error);
      const code = error?.code;
      setLocationError(code === 1 ? "Location permission is blocked. Allow location for this site in your browser settings." : code === 3 ? "Location request timed out. Please try again." : "Unable to detect your current location. Check Windows 11 Location Services and browser permissions.");
    } finally {
      setLocationLoading(false);
    }
  }, [locationLoading, refreshNearby]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("swasth:last-location") || "null");
      if (Number.isFinite(saved?.latitude) && Number.isFinite(saved?.longitude)) {
        const loc: [number, number] = [saved.latitude, saved.longitude];
        setUserLocation(loc);
        setFlyTarget(loc);
        void refreshNearby(loc[0], loc[1]);
      }
    } catch {}
  }, [refreshNearby]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("swasth:last-appointment") || "null");
      if (saved?.name && saved?.status !== "cancelled" && Number.isFinite(saved?.lat) && Number.isFinite(saved?.lng)) setAppointment(saved);
    } catch {}

    const onBooked = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.name && Number.isFinite(detail?.lat) && Number.isFinite(detail?.lng)) {
        setAppointment(detail);
        setFlyTarget([detail.lat, detail.lng]);
      }
    };
    const onCancelled = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.id) {
        setAppointment((current) => current && String(detail.id) === String(current.id) ? null : current);
      }
    };
    const onRemoved = onCancelled;
    window.addEventListener("swasth:appointment-booked", onBooked);
    window.addEventListener("swasth:appointment-cancelled", onCancelled);
    window.addEventListener("swasth:appointment-removed", onRemoved);
    return () => {
      window.removeEventListener("swasth:appointment-booked", onBooked);
      window.removeEventListener("swasth:appointment-cancelled", onCancelled);
      window.removeEventListener("swasth:appointment-removed", onRemoved);
    };
  }, []);

  useEffect(() => {
    if (userLocation) void refreshNearby(userLocation[0], userLocation[1]);
  }, [searchRadius, userLocation, refreshNearby]);

  // Calculate distances
  const hospitalsWithDistance = useMemo(() => {
    return hospitals.map((h) => ({
      ...h,
      distance: userLocation
        ? getDistance(userLocation[0], userLocation[1], h.lat, h.lng)
        : undefined,
    }));
  }, [hospitals, userLocation]);

  const pharmaciesWithDistance = useMemo(() => {
    return pharmacies.map((p) => ({
      ...p,
      distance: userLocation
        ? getDistance(userLocation[0], userLocation[1], p.lat, p.lng)
        : undefined,
    }));
  }, [pharmacies, userLocation]);

  // Filter & sort
  const filteredHospitals = useMemo(() => {
    let list = hospitalsWithDistance;

    if (searchQuery) {
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (userLocation && searchRadius) {
      list = list.filter((h) => (h.distance || 0) <= searchRadius);
    }

    if (emergencyOnly) list = list.filter((h) => h.emergency);
    if (verifiedOnly) list = list.filter((h) => h.verified);

    list = [...list].sort((a, b) => {
      if (sortBy === "distance") return (a.distance || 999) - (b.distance || 999);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [hospitalsWithDistance, searchQuery, searchRadius, userLocation, emergencyOnly, verifiedOnly, sortBy]);

  const filteredPharmacies = useMemo(() => {
    let list = pharmaciesWithDistance;

    if (searchQuery) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (userLocation && searchRadius) {
      list = list.filter((p) => (p.distance || 0) <= searchRadius);
    }

    if (open24hOnly) list = list.filter((p) => p.open24Hours);
    if (verifiedOnly) list = list.filter((p) => p.verified);

    list = [...list].sort((a, b) => {
      if (sortBy === "distance") return (a.distance || 999) - (b.distance || 999);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [pharmaciesWithDistance, searchQuery, searchRadius, userLocation, open24hOnly, verifiedOnly, sortBy]);

  const handleSelectHospital = (h: Hospital) => {
    setSelectedHospital(h);
    setSelectedPharmacy(null);
    setFlyTarget([h.lat, h.lng]);
    setPanelView("detail");
  };

  const handleSelectPharmacy = (p: Pharmacy) => {
    setSelectedPharmacy(p);
    setSelectedHospital(null);
    setFlyTarget([p.lat, p.lng]);
    setPanelView("detail");
  };

  const handleCloseDetail = () => {
    setSelectedHospital(null);
    setSelectedPharmacy(null);
    setPanelView("list");
  };

  const openDirections = (lat: number, lng: number) => {
    const origin = userLocation ? `&origin=${encodeURIComponent(`${userLocation[0]},${userLocation[1]}`)}` : "";
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}${origin}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };



  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <div
        className={`${
          "w-96"
        } flex-shrink-0 overflow-hidden bg-white shadow-2xl flex flex-col z-10 relative`}
      >
        {/* Sidebar header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                🏥
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight">MediMap GPS</h1>
                <p className="text-blue-200 text-xs">Medical Discovery Platform</p>
              </div>
            </div>

          </div>

          {/* Location bar */}
          <div className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="text-lg">📍</span>
            <div className="flex-1">
              {locationLoading ? (
                <p className="text-sm text-blue-200 animate-pulse">Getting location...</p>
              ) : userLocation ? (
                <p className="text-sm font-medium text-white">Current location detected</p>
              ) : (
                <p className="text-sm text-blue-200">Location not set</p>
              )}
            </div>
            <button
              onClick={getUserLocation}
              disabled={locationLoading}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
            >
              {locationLoading ? "⏳" : "🔄"}
            </button>
          </div>
          {locationError && <p className="mt-2 text-xs text-red-200" role="alert">{locationError}</p>}
        </div>

        {/* Search & filter bar */}
        <div className="p-3 border-b bg-gray-50 flex-shrink-0">
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search real hospitals or pharmacies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 flex-1">
              <span className="text-xs text-gray-500 whitespace-nowrap">Radius:</span>
              <input
                type="range"
                min="1"
                max="15"
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                className="flex-1 h-1.5 accent-blue-600"
              />
              <span className="text-xs font-semibold text-blue-600 w-12">{searchRadius}km</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${showFilters ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400"}`}
            >
              ⚙️ Filters
            </button>
          </div>
          {showFilters && (
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <label className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-200 px-2 py-1.5 cursor-pointer hover:border-blue-400">
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="accent-red-600 w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-700">🚨 Emergency</span>
              </label>
              <label className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-200 px-2 py-1.5 cursor-pointer hover:border-blue-400">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="accent-blue-600 w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-700">✓ Verified</span>
              </label>
              <label className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-200 px-2 py-1.5 cursor-pointer hover:border-blue-400">
                <input
                  type="checkbox"
                  checked={open24hOnly}
                  onChange={(e) => setOpen24hOnly(e.target.checked)}
                  className="accent-purple-600 w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-700">🕐 24h Pharmacy</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none text-gray-700"
              >
                <option value="distance">📏 By Distance</option>
                <option value="rating">⭐ By Rating</option>
                <option value="name">🔤 By Name</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab switcher */}
        {panelView === "list" && (
          <div className="flex border-b flex-shrink-0">
            {(["both", "hospitals", "pharmacies"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "both" ? "🗺️ All" : tab === "hospitals" ? `🏥 Hospitals (${filteredHospitals.length})` : `💊 Pharmacies (${filteredPharmacies.length})`}
              </button>
            ))}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {panelView === "detail" && selectedHospital && (
            <HospitalDetail hospital={selectedHospital} onClose={handleCloseDetail} />
          )}

          {panelView === "detail" && selectedPharmacy && (
            <PharmacyDetail pharmacy={selectedPharmacy} onClose={handleCloseDetail} />
          )}

          {panelView === "list" && (
            <div className="p-3">
              {nearbyError && <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800" role="alert">{nearbyError}</div>}
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3 animate-spin">⏳</div>
                  <p className="text-gray-500 text-sm">Loading nearby places...</p>
                </div>
              ) : (
                <>
                  {(activeTab === "both" || activeTab === "hospitals") && (
                    <div>
                      {activeTab === "both" && (
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                            🏥 Hospitals
                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs font-bold">
                              {filteredHospitals.length}
                            </span>
                          </h2>
                        </div>
                      )}
                      {filteredHospitals.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl">
                          No hospitals found in {searchRadius}km radius
                        </div>
                      ) : (
                        filteredHospitals.map((h) => (
                          <HospitalCard
                            key={h.id}
                            hospital={h}
                            onClick={() => handleSelectHospital(h)}
                            onDirections={() => openDirections(h.lat, h.lng)}
                            selected={selectedHospital?.id === h.id}
                          />
                        ))
                      )}
                    </div>
                  )}

                  {(activeTab === "both" || activeTab === "pharmacies") && (
                    <div className={activeTab === "both" ? "mt-4" : ""}>
                      {activeTab === "both" && (
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                            💊 Pharmacies
                            <span className="bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full text-xs font-bold">
                              {filteredPharmacies.length}
                            </span>
                          </h2>
                        </div>
                      )}
                      {filteredPharmacies.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl">
                          No pharmacies found in {searchRadius}km radius
                        </div>
                      ) : (
                        filteredPharmacies.map((p) => (
                          <PharmacyCard
                            key={p.id}
                            pharmacy={p}
                            onClick={() => handleSelectPharmacy(p)}
                            onDirections={() => openDirections(p.lat, p.lng)}
                            selected={selectedPharmacy?.id === p.id}
                          />
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative">
        {/* Map controls overlay */}
        <div className="absolute top-4 right-4 z-[1200] flex flex-col gap-2 pointer-events-auto">
          {/* Filter buttons */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {[
              { val: "all" as MapFilter, label: "All", emoji: "🗺️" },
              { val: "hospitals" as MapFilter, label: "Hospitals", emoji: "🏥" },
              { val: "pharmacies" as MapFilter, label: "Pharmacies", emoji: "💊" },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFilter(f.val)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium w-full transition-colors ${
                  filter === f.val
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          {/* My location */}
          <button
            onClick={getUserLocation}
            disabled={locationLoading}
            className="bg-white shadow-lg rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 text-xs font-bold text-blue-700"
            title="Use the real browser location"
          >
            {locationLoading ? "⏳ Getting location…" : "📍 Use my location"}
          </button>
        </div>

        <div className="absolute bottom-5 right-4 z-[1200] flex flex-col items-end gap-2 max-w-[360px]">
          {appointment && (
            <div className="w-full bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-purple-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">📅 Appointment</div>
                  <div className="font-semibold text-gray-900 truncate">{appointment.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{appointment.date} • {appointment.time}</div>
                  <div className="text-xs text-gray-500 truncate">{appointment.department || "Consultation"}</div>
                </div>
                <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">Pending</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button type="button" disabled={!appointment.phone} onClick={() => appointment.phone && window.open(`tel:${appointment.phone}`)} className="rounded-xl bg-green-50 text-green-700 py-2 text-xs font-semibold disabled:opacity-40">📞 Call</button>
                <button type="button" onClick={() => setMessageOpen(true)} className="rounded-xl bg-blue-50 text-blue-700 py-2 text-xs font-semibold">💬 Message</button>
                <button type="button" onClick={() => openDirections(appointment.lat, appointment.lng)} className="rounded-xl bg-purple-50 text-purple-700 py-2 text-xs font-semibold">🗺️ Directions</button>
              </div>
            </div>
          )}
          <Link href="/appointments" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl shadow-lg font-medium text-sm transition-colors">📅 My Appointments</Link>
        </div>

        {messageOpen && appointment && (
          <div className="absolute bottom-24 right-4 z-[1300] w-[340px] max-w-[calc(100%-2rem)] bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <div><div className="font-semibold text-sm">💬 Message facility</div><div className="text-[11px] text-blue-100">{appointment.name}</div></div>
              <button type="button" onClick={() => setMessageOpen(false)} className="p-1 hover:bg-white/20 rounded">✕</button>
            </div>
            <div className="p-3 max-h-44 overflow-y-auto space-y-2">
              {messageSent.length === 0 ? <p className="text-xs text-gray-500">Send a message about your appointment.</p> : messageSent.map((m, i) => <div key={i} className="ml-8 bg-blue-50 rounded-xl p-2 text-xs text-gray-700">You: {m}</div>)}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Type a message…" className="flex-1 border rounded-xl px-3 py-2 text-xs" />
              <button type="button" disabled={!messageText.trim()} onClick={() => { const text = messageText.trim(); setMessageSent(v => [...v, text]); setMessageText(""); if (appointment.phone) window.open(`sms:${appointment.phone}?body=${encodeURIComponent(text)}`, "_self"); }} className="bg-blue-600 text-white px-3 rounded-xl text-xs font-semibold disabled:opacity-40">Send</button>
            </div>
            {!appointment.phone && <div className="px-3 pb-3 text-[10px] text-gray-400">No facility phone number is listed in OpenStreetMap, so this stays as an in-app demo conversation.</div>}
          </div>
        )}

        <MedicalMap
          hospitals={filteredHospitals}
          pharmacies={filteredPharmacies}
          userLocation={userLocation}
          selectedHospital={selectedHospital}
          selectedPharmacy={selectedPharmacy}
          filter={filter}
          onFilterChange={setFilter}
          onSelectHospital={handleSelectHospital}
          onSelectPharmacy={handleSelectPharmacy}
          flyTarget={flyTarget}
          searchRadius={searchRadius}
          appointment={appointment}
          onAppointmentFocus={() => appointment && setFlyTarget([appointment.lat, appointment.lng])}
        />
      </div>
    </div>
  );
}
