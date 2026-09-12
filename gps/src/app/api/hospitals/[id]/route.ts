import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { hospitals } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [hospital] = await db
      .select()
      .from(hospitals)
      .where(eq(hospitals.id, parseInt(id)));

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }
    return NextResponse.json({ hospital });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch hospital" }, { status: 500 });
  }
}
