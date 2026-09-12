export async function fetchNearbyPlaces(latitude, longitude, radiusMeters = 6000) {
  const url = `/api/nearby?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}&radius=${encodeURIComponent(radiusMeters)}`;
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `Healthcare request failed (${response.status})`);
  if (data?.source === "unavailable") throw new Error(data.error || "Nearby healthcare data is temporarily unavailable.");
  return data.places || [];
}
