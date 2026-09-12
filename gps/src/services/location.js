function geoError(code, message) { const e = new Error(message); e.code = code; return e; }
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(geoError("NOT_SUPPORTED", "Location services are not supported.")); return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
}
