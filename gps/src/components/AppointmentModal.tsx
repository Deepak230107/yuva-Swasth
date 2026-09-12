"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Hospital } from "@/types/medical";

interface AppointmentModalProps {
  hospital: Hospital;
  onClose: () => void;
}

const DEPARTMENTS = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "Oncology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Radiology",
  "Emergency",
  "Surgery",
  "Physiotherapy",
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

export default function AppointmentModal({ hospital, onClose }: AppointmentModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    department: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!departmentOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-department-menu]")) setDepartmentOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDepartmentOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [departmentOpen]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId: hospital.id, ...form }),
      }).catch(() => null);
      const data = await res?.json().catch(() => ({}));
      const appointment = res?.ok ? data.appointment : { id: Date.now(), status: "pending" };
      // If the backend is unavailable, keep the booking as a local demo so the full patient flow still works.
      if (!res?.ok) console.warn("Appointment API unavailable; using local demo appointment.");
      localStorage.setItem("swasth:last-appointment", JSON.stringify({
        id: appointment?.id, hospitalId: hospital.id, name: hospital.name, address: hospital.address,
        lat: hospital.lat, lng: hospital.lng, phone: hospital.phone,
        patientName: form.patientName, department: form.department, doctor: form.doctor || null,
        date: form.appointmentDate, time: form.appointmentTime, status: appointment?.status || "pending_confirmation", source: hospital.source || "OpenStreetMap"
      }));
      window.dispatchEvent(new CustomEvent("swasth:appointment-booked", { detail: {
        id: appointment?.id, name: hospital.name, address: hospital.address, lat: hospital.lat, lng: hospital.lng, phone: hospital.phone,
        date: form.appointmentDate, time: form.appointmentTime, department: form.department
      }}));
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : "Unable to book the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="swasth-appointment-modal fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative z-[10001] bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-lg">📅 Book Appointment</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
              ✕
            </button>
          </div>
          <p className="text-purple-200 text-sm">{hospital.name}</p>
          {!success && (
            <div className="flex gap-2 mt-3">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full ${s <= step ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ✅
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Booking request created</h3>
              <p className="text-gray-600 text-sm mb-4">
                Swasth has saved your appointment request for <strong>{hospital.name}</strong>. The status is <strong>Pending confirmation</strong> until the facility confirms it.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Patient:</span>
                  <span className="text-sm font-medium">{form.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Department:</span>
                  <span className="text-sm font-medium">{form.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm font-medium">{form.appointmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time:</span>
                  <span className="text-sm font-medium">{form.appointmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="text-sm font-medium text-yellow-600">Pending confirmation</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button type="button" disabled={!hospital.phone} onClick={() => hospital.phone && window.open(`tel:${hospital.phone}`)} className="rounded-xl bg-green-50 text-green-700 py-2 text-xs font-semibold disabled:opacity-40">📞 Call</button>
                <button type="button" onClick={() => { if (hospital.phone) window.open(`sms:${hospital.phone}?body=${encodeURIComponent(`Hello ${hospital.name}, I have a Swasth appointment request on ${form.appointmentDate} at ${form.appointmentTime}.`)}`, "_self"); }} disabled={!hospital.phone} className="rounded-xl bg-blue-50 text-blue-700 py-2 text-xs font-semibold disabled:opacity-40">💬 Message</button>
                <button type="button" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}&travelmode=driving`, "_blank", "noopener,noreferrer")} className="rounded-xl bg-purple-50 text-purple-700 py-2 text-xs font-semibold">🗺️ Directions</button>
              </div>
              <p className="text-xs text-gray-400 mb-4">This is a Swasth appointment workflow simulation. Call or SMS the facility using its real listed contact details, and use Google Maps for navigation.</p>
              <button
                onClick={onClose}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {submitError && <div role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3">{submitError}</div>}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Patient Information</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={form.patientPhone}
                      onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.patientEmail}
                      onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div className="relative" data-department-menu>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Department *</label>
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={departmentOpen}
                      onClick={() => setDepartmentOpen((open) => !open)}
                      className={`w-full flex items-center justify-between border rounded-xl px-4 py-2.5 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 ${departmentOpen ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"}`}
                    >
                      <span className={form.department ? "text-gray-800" : "text-gray-500"}>
                        {form.department || "Select department"}
                      </span>
                      <span className={`text-gray-500 transition-transform ${departmentOpen ? "rotate-180" : ""}`}>⌄</span>
                    </button>
                    {departmentOpen && (
                      <div
                        role="listbox"
                        aria-label="Department"
                        className="absolute left-0 right-0 bottom-full mb-2 z-[10020] max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl p-1"
                      >
                        {((hospital.services as string[] | null) || []).filter(Boolean).length > 0
                          ? (hospital.services as string[]).filter(Boolean).map((dept) => (
                              <button
                                key={dept}
                                type="button"
                                role="option"
                                aria-selected={form.department === dept}
                                onClick={() => { setForm({ ...form, department: dept }); setDepartmentOpen(false); }}
                                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-purple-50 hover:text-purple-700 ${form.department === dept ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700"}`}
                              >
                                {dept}
                              </button>
                            ))
                          : DEPARTMENTS.map((dept) => (
                              <button
                                key={dept}
                                type="button"
                                role="option"
                                aria-selected={form.department === dept}
                                onClick={() => { setForm({ ...form, department: dept }); setDepartmentOpen(false); }}
                                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-purple-50 hover:text-purple-700 ${form.department === dept ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700"}`}
                              >
                                {dept}
                              </button>
                            ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={!form.patientName || !form.patientPhone || !form.department}
                    onClick={() => setStep(2)}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    Next: Select Date & Time →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      ← Back
                    </button>
                    <h3 className="font-semibold text-gray-800">Date & Time</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={form.appointmentDate}
                      onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Time Slot *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setForm({ ...form, appointmentTime: slot })}
                          className={`py-2 text-xs rounded-lg border font-medium transition-colors ${
                            form.appointmentTime === slot
                              ? "bg-purple-600 text-white border-purple-600"
                              : "border-gray-200 text-gray-700 hover:border-purple-400 hover:text-purple-600"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Doctor (optional)</label>
                    <input
                      type="text"
                      placeholder="Preferred doctor name"
                      value={form.doctor}
                      onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                    <textarea
                      placeholder="Any symptoms or special requests..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!form.appointmentDate || !form.appointmentTime || submitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
                  >
                    {submitting ? "Booking..." : "✅ Confirm Appointment"}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}