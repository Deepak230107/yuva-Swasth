function openUrl(url) {
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  return popup;
}

function searchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function openNearbyHospitals(latitude, longitude) {
  const hospitalUrl = `https://www.google.com/maps/search/hospitals+near+${latitude}+${longitude}/@${latitude},${longitude},12z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D`;
  return openUrl(hospitalUrl);
}

export function openNearbyMedicalShops(latitude, longitude) {
  const medicalShopUrl = `https://www.google.com/maps/search/medical+shop+near+me/@${latitude},${longitude},13.25z?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D`;
  return openUrl(medicalShopUrl);
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
