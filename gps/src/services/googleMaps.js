function openUrl(url) {
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  return popup;
}

function searchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function openNearbyHospitals(latitude, longitude) {
  return openUrl(searchUrl(`hospitals near ${latitude},${longitude}`));
}

export function openNearbyMedicalShops(latitude, longitude) {
  return openUrl(searchUrl(`pharmacy near ${latitude},${longitude}`));
}

export function openPlace(name, address) {
  return openUrl(searchUrl(`${name}, ${address}`));
}

export function openDirections(latitude, longitude, originLatitude = null, originLongitude = null) {
  const origin = Number.isFinite(originLatitude) && Number.isFinite(originLongitude)
    ? `&origin=${encodeURIComponent(`${originLatitude},${originLongitude}`)}`
    : "";
  return openUrl(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}${origin}&travelmode=driving`);
}
