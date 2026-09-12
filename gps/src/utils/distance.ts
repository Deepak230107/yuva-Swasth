import { OpeningHours } from "@/types/medical";

// Calculate distance between two lat/lng points in km (Haversine formula)
export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function getCurrentDay(): keyof OpeningHours {
  const days: (keyof OpeningHours)[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[new Date().getDay()];
}

export function isCurrentlyOpen(openingHours: OpeningHours | null | unknown): boolean {
  if (!openingHours || typeof openingHours !== "object") return false;
  const hours = openingHours as OpeningHours;
  const day = getCurrentDay();
  const todayHours = hours[day];
  if (!todayHours) return false;
  if (todayHours.is24h) return true;
  if (todayHours.open === "Closed") return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = todayHours.open.split(":").map(Number);
  const [closeH, closeM] = todayHours.close.split(":").map(Number);
  const openTime = openH * 60 + openM;
  const closeTime = closeH * 60 + closeM;

  return currentTime >= openTime && currentTime <= closeTime;
}

export function getTodayHours(openingHours: OpeningHours | null | unknown): string {
  if (!openingHours || typeof openingHours !== "object") return "Hours N/A";
  const hours = openingHours as OpeningHours;
  const day = getCurrentDay();
  const todayHours = hours[day];
  if (!todayHours) return "Hours N/A";
  if (todayHours.is24h) return "Open 24 Hours";
  if (todayHours.open === "Closed") return "Closed Today";
  return `${todayHours.open} - ${todayHours.close}`;
}
