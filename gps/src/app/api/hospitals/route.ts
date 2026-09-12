import { NextResponse } from "next/server";

// Patient-facing healthcare discovery is live and location-based via /api/nearby.
// This endpoint intentionally does not return synthetic/seeded facilities.
export async function GET() {
  return NextResponse.json({ hospitals: [], source: "live-map-required" });
}
