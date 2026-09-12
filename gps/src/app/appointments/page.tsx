"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Hospital, Appointment } from "@/types/medical";

const STATUS: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700", completed: "bg-blue-100 text-blue-700" };

type DemoAppointment = Omit<Appointment, "id"> & { id: number | string; hospitalName?: string; hospitalAddress?: string; hospitalLat?: number; hospitalLng?: number; hospitalPhone?: string | null };

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);

  const [loading, setLoading] = useState(true);
  const [messageOpen, setMessageOpen] = useState<number | string | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<Record<string, string[]>>({});
  const [actionId, setActionId] = useState<number | string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local: DemoAppointment[] = [];
      try {
        const saved = JSON.parse(localStorage.getItem("swasth:last-appointment") || "null");
        if (saved?.name && saved?.date) {
          local.push({
            id: saved.id || Date.now(), hospitalId: null, patientName: saved.patientName || "Patient", patientPhone: saved.patientPhone || "", patientEmail: null,
            department: saved.department || "General Medicine", doctor: saved.doctor || null, appointmentDate: saved.date, appointmentTime: saved.time,
            status: saved.status || "pending_confirmation", notes: null, createdAt: new Date(), hospitalName: saved.name, hospitalAddress: saved.address,
            hospitalLat: saved.lat, hospitalLng: saved.lng, hospitalPhone: saved.phone || null
          });
        }
      } catch {}
      let dbAppointments: DemoAppointment[] = [];
      try {
        const response = await fetch("/api/appointments");
        const data = response.ok ? await response.json() : { appointments: [] };
        dbAppointments = (data.appointments || []).map((appt: Appointment) => ({ ...appt, hospitalName: "Hospital appointment", hospitalAddress: "Facility details stored in Swasth", hospitalLat: undefined, hospitalLng: undefined, hospitalPhone: null }));
      } catch {}
      if (!cancelled) setAppointments([...local, ...dbAppointments.filter((x) => !local.some((y) => y.id === x.id))]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const sorted = useMemo(() => [...appointments].sort((a, b) => `${b.appointmentDate} ${b.appointmentTime}`.localeCompare(`${a.appointmentDate} ${a.appointmentTime}`)), [appointments]);
  const sendMessage = (id: number | string) => { if (!message.trim()) return; setSent(prev => ({ ...prev, [String(id)]: [...(prev[String(id)] || []), message.trim()] })); setMessage(""); };

  const cancelAppointment = async (appt: DemoAppointment) => {
    if (appt.status === "cancelled" || appt.status === "completed") return;
    const confirmed = window.confirm(`Cancel your appointment at ${appt.hospitalName || "this hospital"} on ${appt.appointmentDate} at ${appt.appointmentTime}?`);
    if (!confirmed) return;
    setActionId(appt.id);
    try {
      await fetch(`/api/appointments?id=${encodeURIComponent(String(appt.id))}`, { method: "DELETE" }).catch(() => null);
      const cancelled = { ...appt, status: "cancelled" };
      setAppointments(prev => prev.map(item => item.id === appt.id ? cancelled : item));
      try {
        const saved = JSON.parse(localStorage.getItem("swasth:last-appointment") || "null");
        if (saved && String(saved.id) === String(appt.id)) {
          localStorage.setItem("swasth:last-appointment", JSON.stringify({ ...saved, status: "cancelled" }));
        }
      } catch {}
      window.dispatchEvent(new CustomEvent("swasth:appointment-cancelled", { detail: { id: appt.id } }));
    } finally {
      setActionId(null);
    }
  };

  const removeAppointment = (appt: DemoAppointment) => {
    if (appt.status !== "cancelled") return;
    const confirmed = window.confirm("Remove this cancelled appointment from My Appointments?");
    if (!confirmed) return;
    try {
      const saved = JSON.parse(localStorage.getItem("swasth:last-appointment") || "null");
      if (saved && String(saved.id) === String(appt.id)) localStorage.removeItem("swasth:last-appointment");
    } catch {}
    setAppointments(prev => prev.filter(item => item.id !== appt.id));
    window.dispatchEvent(new CustomEvent("swasth:appointment-removed", { detail: { id: appt.id } }));
  };

  return <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-5 shadow-xl"><div className="max-w-4xl mx-auto flex items-center justify-between"><div><Link href="/" className="text-blue-200 hover:text-white text-sm">← Back</Link><h1 className="font-bold text-xl mt-2">📅 My Appointments</h1><p className="text-blue-200 text-xs mt-1">Request • confirm • message • call • get directions</p></div><span className="text-sm text-blue-200">{appointments.length} appointment{appointments.length === 1 ? "" : "s"}</span></div></header>
    <section className="max-w-4xl mx-auto px-4 py-6">{loading ? <div className="text-center py-16 text-gray-500">Loading your appointments…</div> : sorted.length === 0 ? <div className="bg-white rounded-2xl p-10 text-center shadow-sm"><div className="text-5xl mb-3">📅</div><h2 className="font-bold text-lg text-gray-800">No appointments yet</h2><p className="text-gray-500 text-sm mt-1 mb-5">Choose a live mapped facility and create a Swasth appointment request.</p><Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">🏥 Find Hospitals</Link></div> : <div className="space-y-4">{sorted.map(appt => <article key={appt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-gray-900">{appt.hospitalName || "Hospital"}</h2><p className="text-sm text-gray-500">{appt.department}{appt.doctor ? ` • ${appt.doctor}` : ""}</p></div><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS[appt.status || "pending"] || STATUS.pending}`}>{appt.status === "pending_confirmation" ? "pending confirmation" : appt.status || "pending"}</span></div>
      <div className="grid sm:grid-cols-3 gap-2 mt-4 text-sm"><div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Date</span><div className="font-semibold">📅 {appt.appointmentDate}</div></div><div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Time</span><div className="font-semibold">🕐 {appt.appointmentTime}</div></div><div className="bg-gray-50 rounded-xl p-3"><span className="text-xs text-gray-500">Location</span><div className="font-semibold truncate">📍 {appt.hospitalAddress || "Hospital location"}</div></div></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4"><button onClick={() => appt.hospitalPhone && window.open(`tel:${appt.hospitalPhone}`)} disabled={!appt.hospitalPhone || appt.status === "cancelled"} className="py-2.5 rounded-xl bg-green-50 text-green-700 font-semibold text-sm disabled:opacity-40">📞 Call</button><button onClick={() => { if (appt.hospitalPhone) { window.open(`sms:${appt.hospitalPhone}?body=${encodeURIComponent(`Hello ${appt.hospitalName || "hospital"}, I have an appointment on ${appt.appointmentDate} at ${appt.appointmentTime}.`)}`, "_self"); } else { setMessageOpen(messageOpen === appt.id ? null : appt.id); } }} disabled={appt.status === "cancelled"} className="py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm disabled:opacity-40">💬 Message</button><button onClick={() => appt.hospitalLat && appt.hospitalLng && window.open(`https://www.google.com/maps/dir/?api=1&destination=${appt.hospitalLat},${appt.hospitalLng}&travelmode=driving`, "_blank", "noopener,noreferrer")} disabled={!appt.hospitalLat || appt.status === "cancelled"} className="py-2.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-sm disabled:opacity-40">🗺️ Directions</button>{appt.status === "cancelled" ? <button onClick={() => removeAppointment(appt)} className="py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">🗑️ Remove</button> : <button onClick={() => cancelAppointment(appt)} disabled={actionId === appt.id || appt.status === "completed"} className="py-2.5 rounded-xl bg-red-50 text-red-700 font-semibold text-sm disabled:opacity-40">{actionId === appt.id ? "Cancelling…" : "✕ Cancel"}</button>}</div>
      {messageOpen === appt.id && <div className="mt-3 rounded-xl border bg-gray-50 p-3"><div className="text-xs font-semibold text-gray-600 mb-2">Message hospital</div><div className="flex gap-2"><input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(appt.id)} placeholder="e.g. I will arrive 10 minutes early" className="flex-1 rounded-lg border px-3 py-2 text-sm"/><button onClick={() => sendMessage(appt.id)} className="bg-blue-600 text-white rounded-lg px-4 text-sm font-semibold">Send</button></div>{sent[String(appt.id)]?.map((m,i) => <div key={i} className="text-xs bg-white rounded-lg p-2 mt-2">You: {m}</div>)}<p className="text-[11px] text-gray-400 mt-2">If a real facility phone is listed, SMS opens on the device. Without a listed number, this is an in-app Swasth demo conversation.</p></div>}
    </article>)}</div>}</section>
  </main>;
}
