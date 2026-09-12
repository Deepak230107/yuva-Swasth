/**
 * Swasth no longer seeds synthetic hospitals/pharmacies.
 * The patient-facing map uses live OpenStreetMap data around the browser's real location.
 * Keep this file intentionally empty so demo seed data can never be mistaken for live facilities.
 */
export async function seed() {
  return { hospitals: 0, pharmacies: 0 };
}
