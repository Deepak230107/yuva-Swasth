import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { patient } from "../../data/mockData";
import { getDistance, formatDistance } from "../../utils/distance";
import { getCurrentLocation } from "../../services/location";
import { openDirections } from "../../services/googleMaps";
import { fetchNearbyPlaces } from "../../services/openStreetMap";
import MedicalMap from "../MedicalMap";
import LanguageSelector from "../LanguageSelector";

const CITY_COORDINATES = {
  Madurai: [9.9252, 78.1198],
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Salem: [11.6643, 78.1460],
  Trichy: [10.7905, 78.7047],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
};

function getPatientCityLocation() {
  const district = patient?.address?.district || "Madurai";
  const city = CITY_COORDINATES[district] || CITY_COORDINATES.Madurai;
  return [city[0], city[1]];
}

export default function MedicalGPS() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [nearbyError, setNearbyError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");
  const [searchRadius, setSearchRadius] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [panelView, setPanelView] = useState("list");
  const [flyTarget, setFlyTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [open24hOnly, setOpen24hOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState([]);

  const refreshNearby = useCallback(async (latitude, longitude) => {
    setLoading(true);
    try {
      setNearbyError("");
      const places = await fetchNearbyPlaces(latitude, longitude, searchRadius * 1000);
      setHospitals(places.filter((p) => p.category === "hospital"));
      setPharmacies(places.filter((p) => p.category === "pharmacy"));
    } catch (error) {
      console.warn("Nearby healthcare data", error);
      setNearbyError("Nearby healthcare is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchRadius]);

  const openFacilityDirections = useCallback((place) => {
    if (!place || !Number.isFinite(place.lat) || !Number.isFinite(place.lng)) return;

    if (userLocation && userLocation.length >= 2 && Number.isFinite(userLocation[0]) && Number.isFinite(userLocation[1])) {
      openDirections(place.lat, place.lng, userLocation[0], userLocation[1]);
      return;
    }

    const citySource = getPatientCityLocation();
    openDirections(place.lat, place.lng, citySource[0], citySource[1]);
  }, [userLocation]);

  const getUserLocation = useCallback(async () => {
    if (locationLoading) return;

    setLocationLoading(true);
    setLocationError("");

    try {
      const { latitude, longitude, accuracy } = await getCurrentLocation();
      const loc = [latitude, longitude];
      setUserLocation(loc);
      setFlyTarget(loc);
      window.localStorage.setItem("swasth:last-location", JSON.stringify({ latitude, longitude, accuracy }));
      await refreshNearby(latitude, longitude);
    } catch (error) {
      console.warn("Location unavailable", error);
      const code = error?.code;
      setLocationError(code === 1 ? "Location permission is blocked. Allow location for this site in your browser settings." : code === 3 ? "Location request timed out. Please try again." : "Unable to detect your current location. Check Windows 11 Location Services and browser permissions.");
    } finally {
      setLocationLoading(false);
    }
  }, [locationLoading, refreshNearby]);

  useEffect(() => {
    const loadLiveLocation = async () => {
      try {
        const saved = JSON.parse(window.localStorage.getItem("swasth:last-location") || "null");
        if (Number.isFinite(saved?.latitude) && Number.isFinite(saved?.longitude)) {
          const loc = [saved.latitude, saved.longitude];
          setUserLocation(loc);
          setFlyTarget(loc);
          void refreshNearby(loc[0], loc[1]);
          return;
        }
      } catch {}

      try {
        const { latitude, longitude, accuracy } = await getCurrentLocation();
        const loc = [latitude, longitude];
        setUserLocation(loc);
        setFlyTarget(loc);
        setLocationError("");
        window.localStorage.setItem("swasth:last-location", JSON.stringify({ latitude, longitude, accuracy }));
        await refreshNearby(latitude, longitude);
        return;
      } catch (error) {
        console.warn("Live location unavailable", error);
        const code = error?.code;
        setLocationError(code === 1 ? "Location permission is blocked. Allow location for this site in your browser settings." : code === 3 ? "Location request timed out. Please try again." : "Unable to detect your current location. Using patient city location instead.");

        const cityLocation = getPatientCityLocation();
        setUserLocation(cityLocation);
        setFlyTarget(cityLocation);
        await refreshNearby(cityLocation[0], cityLocation[1]);
      }
    };

    void loadLiveLocation();
  }, [refreshNearby]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("swasth:last-appointment") || "null");
      if (saved?.name && saved?.status !== "cancelled" && Number.isFinite(saved?.lat) && Number.isFinite(saved?.lng)) {
        setAppointment(saved);
      }
    } catch {}

    const onBooked = (event) => {
      const detail = event.detail;
      if (detail?.name && Number.isFinite(detail?.lat) && Number.isFinite(detail?.lng)) {
        setAppointment(detail);
        setFlyTarget([detail.lat, detail.lng]);
      }
    };

    const onCancelled = (event) => {
      const detail = event.detail;
      if (detail?.id) {
        setAppointment((current) => current && String(detail.id) === String(current.id) ? null : current);
      }
    };

    window.addEventListener("swasth:appointment-booked", onBooked);
    window.addEventListener("swasth:appointment-cancelled", onCancelled);
    window.addEventListener("swasth:appointment-removed", onCancelled);

    return () => {
      window.removeEventListener("swasth:appointment-booked", onBooked);
      window.removeEventListener("swasth:appointment-cancelled", onCancelled);
      window.removeEventListener("swasth:appointment-removed", onCancelled);
    };
  }, []);

  useEffect(() => {
    if (userLocation) void refreshNearby(userLocation[0], userLocation[1]);
  }, [searchRadius, userLocation, refreshNearby]);

  const hospitalsWithDistance = useMemo(() => {
    return hospitals.map((h) => ({
      ...h,
      distance: userLocation ? getDistance(userLocation[0], userLocation[1], h.lat, h.lng) : undefined,
    }));
  }, [hospitals, userLocation]);

  const pharmaciesWithDistance = useMemo(() => {
    return pharmacies.map((p) => ({
      ...p,
      distance: userLocation ? getDistance(userLocation[0], userLocation[1], p.lat, p.lng) : undefined,
    }));
  }, [pharmacies, userLocation]);

  const filteredHospitals = useMemo(() => {
    let list = hospitalsWithDistance;
    if (searchQuery) {
      list = list.filter((h) =>
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
      list = list.filter((p) =>
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

  const renderCardList = () => {
    const hospitalCards = filteredHospitals.map((hospital) => (
      <article key={hospital.id} className="border rounded-xl p-3 mb-3 bg-white shadow-sm">
        <div className="flex justify-between">
          <div>
            <span className="font-bold text-sm text-gray-800">{hospital.name}</span>
            <div className="text-xs text-gray-500 mt-1">📍 {hospital.address}</div>
            {hospital.phone && <div className="text-xs text-gray-500 mt-1">📞 {hospital.phone}</div>}
            {hospital.distance !== undefined && <div className="text-xs text-gray-500 mt-1">📏 {formatDistance(hospital.distance)}</div>}
          </div>
          <div className="gps-card-actions">
            <button type="button" onClick={() => { setSelectedHospital(hospital); setPanelView("detail"); }} className="gps-card-button details-button">Details</button>
            <button type="button" onClick={() => openFacilityDirections(hospital)} className="gps-card-button directions-button">Directions</button>
          </div>
        </div>
      </article>
    ));

    const pharmacyCards = filteredPharmacies.map((pharmacy) => (
      <article key={pharmacy.id} className="border rounded-xl p-3 mb-3 bg-white shadow-sm">
        <div className="flex justify-between">
          <div>
            <span className="font-bold text-sm text-gray-800">{pharmacy.name}</span>
            <div className="text-xs text-gray-500 mt-1">📍 {pharmacy.address}</div>
            {pharmacy.phone && <div className="text-xs text-gray-500 mt-1">📞 {pharmacy.phone}</div>}
            {pharmacy.distance !== undefined && <div className="text-xs text-gray-500 mt-1">📏 {formatDistance(pharmacy.distance)}</div>}
          </div>
          <div className="gps-card-actions">
            <button type="button" onClick={() => { setSelectedPharmacy(pharmacy); setPanelView("detail"); }} className="gps-card-button details-button">Details</button>
            <button type="button" onClick={() => openFacilityDirections(pharmacy)} className="gps-card-button directions-button">Directions</button>
          </div>
        </div>
      </article>
    ));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-red-700">Hospitals</div>
          {hospitalCards}
        </div>
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">Pharmacies</div>
          {pharmacyCards}
        </div>
      </div>
    );
  };

  return (
    <div className="module-page gps-page">
      <header className="module-header">
        <button onClick={() => navigate("/home")} className="back-button" title="Back">
          ←
        </button>
        <div>
          <p className="module-label">Swasth</p>
          <h1>GPS Locator</h1>
        </div>
        <div className="module-header-actions">
          <LanguageSelector />
          <button type="button" className="primary-button" onClick={getUserLocation}>
            {locationLoading ? "Locating..." : "Use my location"}
          </button>
        </div>
      </header>

      <main className="module-main gps-main">
        <section className="gps-dashboard">
          <div className="gps-map-card" style={{ minHeight: 420 }}>
            <div className="gps-map-head">
              <span className="gps-title"><span className="gps-icon">📍</span>Nearby healthcare</span>
              <span className="gps-live"><span className="gps-live-dot" />Live</span>
            </div>
            <div className="gps-map-surface" style={{ minHeight: 340, height: 340 }}>
              <MedicalMap
                hospitals={filteredHospitals}
                pharmacies={filteredPharmacies}
                userLocation={userLocation}
                selectedHospital={selectedHospital}
                selectedPharmacy={selectedPharmacy}
                filter={filter}
                onFilterChange={setFilter}
                onSelectHospital={(h) => { setSelectedHospital(h); setSelectedPharmacy(null); setPanelView("detail"); }}
                onSelectPharmacy={(p) => { setSelectedPharmacy(p); setSelectedHospital(null); setPanelView("detail"); }}
                flyTarget={flyTarget}
                searchRadius={searchRadius}
                appointment={appointment}
                onAppointmentFocus={() => appointment && setFlyTarget([appointment.lat, appointment.lng])}
              />
            </div>
            <div className="gps-location-row">
              <div>
                <span className="gps-kicker">Search radius</span>
                <span className="gps-value">{searchRadius} km</span>
              </div>
              <div>
                <span className="gps-kicker">Nearby</span>
                <span className="gps-value">{filteredHospitals.length + filteredPharmacies.length}</span>
              </div>
              <div>
                <span className="gps-kicker">Status</span>
                <span className="gps-value">{nearbyError ? "Unavailable" : "Live"}</span>
              </div>
            </div>
          </div>

          <div className="gps-details-panel">
            <div className="gps-panel-title">
              <span>Healthcare finder</span>
            </div>
            <div className="gps-detail-list">
              <div className="gps-detail-row">
                <span className="gps-detail-label">Source</span>
                <span className="gps-detail-value source-value">OpenStreetMap</span>
              </div>
              <div className="gps-detail-row">
                <span className="gps-detail-label">Radius</span>
                <span className="gps-detail-value radius-value">{searchRadius} km</span>
              </div>
              <div className="gps-detail-row">
                <span className="gps-detail-label">Results</span>
                <span className="gps-detail-value result-value">{filteredHospitals.length + filteredPharmacies.length}</span>
              </div>

              <div className="gps-filter-strip">
                <input type="text" className="search-box" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or address" />
                <button type="button" className="primary-filter-button" onClick={() => setShowFilters(!showFilters)}>{showFilters ? "Hide" : "Filters"}</button>
              </div>

              {showFilters && (
                <div className="filter-grid">
                  <label className="filter-option"><input type="checkbox" checked={emergencyOnly} onChange={(e) => setEmergencyOnly(e.target.checked)} /><span className="filter-option-text">Emergency</span></label>
                  <label className="filter-option"><input type="checkbox" checked={open24hOnly} onChange={(e) => setOpen24hOnly(e.target.checked)} /><span className="filter-option-text">Open 24h</span></label>
                  <label className="filter-option"><input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} /><span className="filter-option-text">Verified</span></label>
                  <div className="filter-sort-wrap">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-box">
                      <option value="distance">Distance</option>
                      <option value="rating">Rating</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="gps-option-zone">
                <div className="gps-option-zone-title">Facility view filters</div>
                <div className="gps-option-row">
                  <button type="button" className={filter === "all" ? "gps-option-chip active" : "gps-option-chip"} onClick={() => setFilter("all")}>All</button>
                  <button type="button" className={filter === "hospitals" ? "gps-option-chip active hospital-chip" : "gps-option-chip hospital-chip"} onClick={() => setFilter("hospitals")}>Hospitals ({filteredHospitals.length})</button>
                  <button type="button" className={filter === "pharmacies" ? "gps-option-chip active pharmacy-chip" : "gps-option-chip pharmacy-chip"} onClick={() => setFilter("pharmacies")}>Pharmacies ({filteredPharmacies.length})</button>
                </div>

                {userLocation && (
                  <div className="gps-option-row map-link-row">
                    <button type="button" className="gps-map-link-button hospitals-link" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hospitals near ${userLocation[0]},${userLocation[1]}`)}`, "_blank", "noopener,noreferrer")}>Google Maps • Hospitals</button>
                    <button type="button" className="gps-map-link-button pharmacies-link" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`pharmacy near ${userLocation[0]},${userLocation[1]}`)}`, "_blank", "noopener,noreferrer")}>Google Maps • Medical Shops</button>
                  </div>
                )}
              </div>

              {locationError && <div className="gps-error">{locationError}</div>}
              {nearbyError && <div className="gps-error">{nearbyError}</div>}
            </div>
            <div className="gps-timeline">
              <div className="gps-timeline-head"><span>📋 View</span></div>
              <div className="gps-timeline-path">
                <button type="button" className={panelView === "list" ? "gps-view-button active" : "gps-view-button"} onClick={() => setPanelView("list")}>List</button>
                <button type="button" className={panelView === "detail" ? "gps-view-button active" : "gps-view-button"} onClick={() => setPanelView("detail")}>Details</button>
              </div>
              <div className="gps-timeline-labels">
                {panelView === "list" ? renderCardList() : (
                  <div className="detail-panel">
                    {selectedHospital && <div><strong>{selectedHospital.name}</strong><p>{selectedHospital.address}</p><p>{selectedHospital.phone || "Phone not listed"}</p></div>}
                    {selectedPharmacy && <div><strong>{selectedPharmacy.name}</strong><p>{selectedPharmacy.address}</p><p>{selectedPharmacy.phone || "Phone not listed"}</p></div>}
                    {!selectedHospital && !selectedPharmacy && <div className="text-gray-500">Select a hospital or pharmacy to see details.</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
