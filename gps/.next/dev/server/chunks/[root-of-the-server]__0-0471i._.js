module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Swasth/gps/src/app/api/nearby/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Swasth$2f$gps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Swasth/gps/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = "force-dynamic";
const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
];
function buildQuery(latitude, longitude, radiusMeters) {
    const radius = Math.min(Math.max(Number(radiusMeters) || 10000, 1500), 15000);
    return `[out:json][timeout:10];(
    nwr["amenity"="hospital"](around:${radius},${latitude},${longitude});
    nwr["healthcare"="hospital"](around:${radius},${latitude},${longitude});
    nwr["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
    nwr["healthcare"="pharmacy"](around:${radius},${latitude},${longitude});
  );out center tags;`;
}
async function fetchJson(url, init) {
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), 6500);
    try {
        const response = await fetch(url, {
            ...init,
            cache: "no-store",
            signal: controller.signal
        });
        const body = await response.text();
        if (!response.ok || !body.trim()) throw new Error(`Request failed (${response.status})`);
        return JSON.parse(body);
    } finally{
        clearTimeout(timer);
    }
}
async function requestOverpass(query) {
    return Promise.any(OVERPASS_ENDPOINTS.map((endpoint)=>fetchJson(endpoint, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `data=${encodeURIComponent(query)}`
        })));
}
async function requestNominatim(latitude, longitude) {
    const delta = 0.25;
    const viewbox = `${longitude - delta},${latitude + delta},${longitude + delta},${latitude - delta}`;
    const search = async (q)=>{
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
            countrycodes: "in"
        });
        return fetchJson(`https://nominatim.openstreetmap.org/search?${params}`, {
            headers: {
                Accept: "application/json",
                "User-Agent": "Swasth-SIH26133-Demo/1.0"
            }
        });
    };
    const [hospitals, pharmacies] = await Promise.all([
        search("hospital"),
        search("pharmacy")
    ]);
    return [
        ...Array.isArray(hospitals) ? hospitals : [],
        ...Array.isArray(pharmacies) ? pharmacies : []
    ];
}
function point(element) {
    const lat = Number(element?.lat ?? element?.center?.lat);
    const lon = Number(element?.lon ?? element?.center?.lon);
    return Number.isFinite(lat) && Number.isFinite(lon) ? [
        lat,
        lon
    ] : null;
}
function formatAddress(tags = {}) {
    const first = [
        tags["addr:housenumber"],
        tags["addr:street"]
    ].filter(Boolean).join(" ");
    const rest = [
        tags["addr:locality"],
        tags["addr:suburb"],
        tags["addr:city"] || tags["addr:town"],
        tags["addr:district"],
        tags["addr:state"],
        tags["addr:postcode"]
    ].filter(Boolean);
    return [
        first,
        ...rest
    ].filter(Boolean).join(", ") || "Address not listed";
}
function normalizeOverpass(element) {
    const tags = element?.tags ?? {};
    const coords = point(element);
    if (!coords || !tags.name) return null;
    const category = tags.amenity === "pharmacy" || tags.healthcare === "pharmacy" ? "pharmacy" : "hospital";
    return {
        id: `${element.type}-${element.id}`,
        source: "OpenStreetMap",
        category,
        name: String(tags.name),
        address: formatAddress(tags),
        lat: coords[0],
        lng: coords[1],
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        type: tags.amenity === "hospital" ? "Hospital" : tags.amenity === "pharmacy" ? "Pharmacy" : "Healthcare facility",
        emergency: category === "hospital" && /yes|24\/7/i.test(String(tags.emergency || "")),
        openingHoursText: tags.opening_hours || null,
        services: []
    };
}
function distanceKm(aLat, aLng, bLat, bLng) {
    const R = 6371;
    const dLat = (bLat - aLat) * Math.PI / 180;
    const dLng = (bLng - aLng) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function normalizeNominatim(item, index) {
    const coords = point(item);
    if (!coords || !item?.display_name) return null;
    const haystack = `${item.type || ""} ${item.class || ""} ${item.display_name}`.toLowerCase();
    const category = haystack.includes("pharmacy") || haystack.includes("chemist") ? "pharmacy" : "hospital";
    return {
        id: `nominatim-${item.place_id ?? index}`,
        source: "OpenStreetMap",
        category,
        name: String(item.name || item.display_name.split(",")[0]),
        address: String(item.display_name),
        lat: coords[0],
        lng: coords[1],
        phone: item.extratags?.phone || item.extratags?.contact_phone || null,
        website: item.extratags?.website || item.extratags?.contact_website || null,
        type: category === "pharmacy" ? "Pharmacy" : "Hospital",
        emergency: false,
        openingHoursText: item.extratags?.opening_hours || null,
        services: [],
        osmId: item.osm_type && item.osm_id ? `${item.osm_type}/${item.osm_id}` : null
    };
}
async function GET(request) {
    const params = new URL(request.url).searchParams;
    const latitude = Number(params.get("lat"));
    const longitude = Number(params.get("lng"));
    const radius = Number(params.get("radius") || 6000);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Swasth$2f$gps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid coordinates",
            places: []
        }, {
            status: 400
        });
    }
    // Swasth SIH26133 is an India-only healthcare finder. Reject locations
    // clearly outside India's service area instead of silently searching another country.
    if (latitude < 6.0 || latitude > 37.5 || longitude < 67.0 || longitude > 98.0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Swasth$2f$gps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Swasth currently supports locations in India only.",
            places: []
        }, {
            status: 400
        });
    }
    try {
        const data = await requestOverpass(buildQuery(latitude, longitude, radius));
        const seen = new Set();
        const places = (data.elements || []).map(normalizeOverpass).filter(Boolean).filter((place)=>{
            if (seen.has(place.id)) return false;
            seen.add(place.id);
            return true;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Swasth$2f$gps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            places,
            source: "OpenStreetMap",
            fetchedAt: new Date().toISOString()
        });
    } catch (overpassError) {
        console.warn("Overpass unavailable, using Nominatim fallback", overpassError);
        try {
            const data = await requestNominatim(latitude, longitude);
            const places = (Array.isArray(data) ? data : []).map(normalizeNominatim).filter(Boolean).filter((place)=>distanceKm(latitude, longitude, place.lat, place.lng) <= Math.min(Math.max(radius, 1500), 15000));
            return __TURBOPACK__imported__module__$5b$project$5d2f$Swasth$2f$gps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                places,
                source: "OpenStreetMap",
                fallback: true,
                fetchedAt: new Date().toISOString()
            });
        } catch (fallbackError) {
            console.error("Nearby healthcare providers unavailable", fallbackError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Swasth$2f$gps$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                places: [],
                source: "unavailable",
                error: "Nearby healthcare data is temporarily unavailable. Please try again."
            }, {
                status: 200
            });
        }
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-0471i._.js.map