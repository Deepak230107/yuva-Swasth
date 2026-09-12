import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

function buildQuery(latitude: number, longitude: number, radiusMeters: number) {
  const radius = Math.min(Math.max(Number(radiusMeters) || 10000, 1500), 15000);
  return `[out:json][timeout:10];(
    nwr["amenity"="hospital"](around:${radius},${latitude},${longitude});
    nwr["healthcare"="hospital"](around:${radius},${latitude},${longitude});
    nwr["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
    nwr["healthcare"="pharmacy"](around:${radius},${latitude},${longitude});
  );out center tags;`;
}

async function fetchJson(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6500);
  try {
    const response = await fetch(url, { ...init, cache: "no-store", signal: controller.signal });
    const body = await response.text();
    if (!response.ok || !body.trim()) throw new Error(`Request failed (${response.status})`);
    return JSON.parse(body);
  } finally {
    clearTimeout(timer);
  }
}

async function requestOverpass(query: string) {
  return Promise.any(
    OVERPASS_ENDPOINTS.map((endpoint) =>
      fetchJson(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: `data=${encodeURIComponent(query)}`,
      })
    )
  );
}

async function requestNominatim(latitude: number, longitude: number) {
  const delta = 0.25;
  const viewbox = `${longitude - delta},${latitude + delta},${longitude + delta},${latitude - delta}`;
  const search = async (q: string) => {
    const params = new URLSearchParams({
      q,
      format: "jsonv2",
      addressdetails: "1",
      limit: "30",
      extratags: "1",
      namedetails: "1",
      lat: String(latitude),
      lon: String(longitude),
      viewbox,
      bounded: "1",
      countrycodes: "in",
    });
    return fetchJson(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { Accept: "application/json", "User-Agent": "Swasth-SIH26133-Demo/1.0" },
    });
  };
  const [hospitals, pharmacies] = await Promise.all([search("hospital"), search("pharmacy")]);
  return [...(Array.isArray(hospitals) ? hospitals : []), ...(Array.isArray(pharmacies) ? pharmacies : [])];
}

function point(element: any): [number, number] | null {
  const lat = Number(element?.lat ?? element?.center?.lat);
  const lon = Number(element?.lon ?? element?.center?.lon);
  return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
}

function formatAddress(tags: Record<string, string> = {}) {
  const first = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const rest = [tags["addr:locality"], tags["addr:suburb"], tags["addr:city"] || tags["addr:town"], tags["addr:district"], tags["addr:state"], tags["addr:postcode"]].filter(Boolean);
  return [first, ...rest].filter(Boolean).join(", ") || "Address not listed";
}

function normalizeOverpass(element: any) {
  const tags = element?.tags ?? {};
  const coords = point(element);
  if (!coords || !tags.name) return null;
  const category = tags.amenity === "pharmacy" || tags.healthcare === "pharmacy" ? "pharmacy" : "hospital";
  return {
    id: `${element.type}-${element.id}`, source: "OpenStreetMap", category, name: String(tags.name),
    address: formatAddress(tags), lat: coords[0], lng: coords[1],
    phone: tags.phone || tags["contact:phone"] || null, website: tags.website || tags["contact:website"] || null,
    type: tags.amenity === "hospital" ? "Hospital" : tags.amenity === "pharmacy" ? "Pharmacy" : "Healthcare facility",
    emergency: category === "hospital" && /yes|24\/7/i.test(String(tags.emergency || "")),
    openingHoursText: tags.opening_hours || null, services: [],
  };
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = (bLat - aLat) * Math.PI / 180;
  const dLng = (bLng - aLng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function normalizeNominatim(item: any, index: number) {
  const coords = point(item);
  if (!coords || !item?.display_name) return null;
  const haystack = `${item.type || ""} ${item.class || ""} ${item.display_name}`.toLowerCase();
  const category = haystack.includes("pharmacy") || haystack.includes("chemist") ? "pharmacy" : "hospital";
  return {
    id: `nominatim-${item.place_id ?? index}`, source: "OpenStreetMap", category, name: String(item.name || item.display_name.split(",")[0]),
    address: String(item.display_name), lat: coords[0], lng: coords[1],
    phone: item.extratags?.phone || item.extratags?.contact_phone || null,
    website: item.extratags?.website || item.extratags?.contact_website || null,
    type: category === "pharmacy" ? "Pharmacy" : "Hospital", emergency: false,
    openingHoursText: item.extratags?.opening_hours || null, services: [], osmId: item.osm_type && item.osm_id ? `${item.osm_type}/${item.osm_id}` : null,
  };
}

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const latitude = Number(params.get("lat"));
  const longitude = Number(params.get("lng"));
  const radius = Number(params.get("radius") || 6000);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "Invalid coordinates", places: [] }, { status: 400 });
  }

  // Swasth SIH26133 is an India-only healthcare finder. Reject locations
  // clearly outside India's service area instead of silently searching another country.
  if (latitude < 6.0 || latitude > 37.5 || longitude < 67.0 || longitude > 98.0) {
    return NextResponse.json({ error: "Swasth currently supports locations in India only.", places: [] }, { status: 400 });
  }

  try {
    const data = await requestOverpass(buildQuery(latitude, longitude, radius));
    const seen = new Set<string>();
    const places = (data.elements || []).map(normalizeOverpass).filter(Boolean).filter((place: any) => {
      if (seen.has(place.id)) return false;
      seen.add(place.id);
      return true;
    });
    return NextResponse.json({ places, source: "OpenStreetMap", fetchedAt: new Date().toISOString() });
  } catch (overpassError) {
    console.warn("Overpass unavailable, using Nominatim fallback", overpassError);
    try {
      const data = await requestNominatim(latitude, longitude);
      const places = (Array.isArray(data) ? data : [])
        .map(normalizeNominatim)
        .filter(Boolean)
        .filter((place: any) => distanceKm(latitude, longitude, place.lat, place.lng) <= Math.min(Math.max(radius, 1500), 15000));
      return NextResponse.json({ places, source: "OpenStreetMap", fallback: true, fetchedAt: new Date().toISOString() });
    } catch (fallbackError) {
      console.error("Nearby healthcare providers unavailable", fallbackError);
      return NextResponse.json({ places: [], source: "unavailable", error: "Nearby healthcare data is temporarily unavailable. Please try again." }, { status: 200 });
    }
  }
}
