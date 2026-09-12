"use client";

import { useState } from "react";
import { Hospital } from "@/types/medical";
import AppointmentModal from "./AppointmentModal";

interface HospitalDetailProps { hospital: Hospital; onClose: () => void; }

export default function HospitalDetail({ hospital, onClose }: HospitalDetailProps) {
  const [showAppointment, setShowAppointment] = useState(false);
  const googleSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.name}, ${hospital.address}`)}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hospital.lat},${hospital.lng}`)}&travelmode=driving`;

  return <div className="flex flex-col h-full bg-white">
    <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-4">
      <div className="flex items-start justify-between"><div><div className="text-xs text-red-200 mb-1">Live mapped facility</div><h2 className="font-bold text-lg leading-tight">{hospital.name}</h2><p className="text-red-200 text-sm mt-1">{hospital.type || "Hospital"}</p></div><button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full">✕</button></div>
      {hospital.distance !== undefined && <p className="text-red-200 text-xs mt-3">📏 {hospital.distance < 1 ? `${Math.round(hospital.distance * 1000)} m` : `${hospital.distance.toFixed(1)} km`} from your current location</p>}
    </div>

    <div className="grid grid-cols-3 gap-2 p-3 border-b">
      <button onClick={() => window.open(directions, "_blank", "noopener,noreferrer")} className="p-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold">🗺️ Directions</button>
      <button disabled={!hospital.phone} onClick={() => hospital.phone && window.open(`tel:${hospital.phone}`)} className="p-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold disabled:opacity-40">📞 Call</button>
      <button onClick={() => setShowAppointment(true)} className="p-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-semibold">📅 Appointment</button>
    </div>

    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      <section className="rounded-xl bg-gray-50 p-3">
        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Real details</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>📍 {hospital.address}</p>
          {hospital.phone ? <p>📞 <a className="text-blue-600 hover:underline" href={`tel:${hospital.phone}`}>{hospital.phone}</a></p> : <p className="text-gray-400">Phone number is not listed in the live map data.</p>}
          {hospital.website ? <p>🌐 <a className="text-blue-600 hover:underline" href={hospital.website.startsWith("http") ? hospital.website : `https://${hospital.website}`} target="_blank" rel="noreferrer">{hospital.website}</a></p> : null}
          {hospital.openingHoursText ? <p>🕐 {hospital.openingHoursText}</p> : <p className="text-gray-400">Opening hours are not listed in the live map data.</p>}
        </div>
      </section>

      {hospital.services?.length ? <section className="rounded-xl bg-red-50 border border-red-100 p-3"><h3 className="text-xs font-bold uppercase text-red-700 mb-2">Mapped healthcare services</h3><div className="flex flex-wrap gap-2">{hospital.services.map((service) => <span key={service} className="px-2 py-1 rounded-lg bg-white text-xs text-gray-700 border border-red-100">{service}</span>)}</div></section> : null}

      <section className="rounded-xl border border-gray-100 p-3">
        <p className="text-xs text-gray-500">Source: <strong>{hospital.source || "OpenStreetMap"}</strong></p>
        <p className="text-xs text-gray-400 mt-1">Ratings, reviews, medicine stock and verification are not invented when the live source does not provide them.</p>
      </section>

      <button onClick={() => window.open(googleSearch, "_blank", "noopener,noreferrer")} className="w-full border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Open this facility in Google Maps</button>
    </div>

    <div className="p-3 border-t"><button onClick={() => setShowAppointment(true)} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold shadow-md">📅 Start appointment booking</button></div>
    {showAppointment && <AppointmentModal hospital={hospital} onClose={() => setShowAppointment(false)} />}
  </div>;
}
