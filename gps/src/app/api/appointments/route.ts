import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ appointments: [], mode: "browser_demo" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientName, patientPhone, patientEmail, department, doctor, appointmentDate, appointmentTime, notes } = body;
    if (!patientName || !patientPhone || !department || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const appointment = {
      id: `swasth-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      patientName, patientPhone, patientEmail: patientEmail || null, department,
      doctor: doctor || null, appointmentDate, appointmentTime, notes: notes || null,
      status: "pending_confirmation", createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ appointment, mode: "browser_demo" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create appointment request" }, { status: 400 });
  }
}


export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Appointment id is required" }, { status: 400 });
  return NextResponse.json({ ok: true, id, status: "cancelled", mode: "browser_demo" });
}
