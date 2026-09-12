"use client";

import { Hospital, Pharmacy } from "@/types/medical";
import { formatDistance } from "@/utils/distance";

interface HospitalCardProps { hospital: Hospital; onClick: () => void; onDirections: () => void; selected?: boolean; }
interface PharmacyCardProps { pharmacy: Pharmacy; onClick: () => void; onDirections: () => void; selected?: boolean; }

function Meta({ place, type }: { place: Hospital | Pharmacy; type: "hospital" | "pharmacy" }) {
  return <>
    {place.distance !== undefined && <span className="text-xs text-gray-500">{formatDistance(place.distance)}</span>}
    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">Live map data</span>
    {type === "hospital" && (place as Hospital).emergency && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">Emergency</span>}
  </>;
}

export function HospitalCard({ hospital, onClick, onDirections, selected }: HospitalCardProps) {
  return <article onClick={onClick} className={`cursor-pointer rounded-2xl border p-3 mb-2 transition-all hover:shadow-md ${selected ? "border-red-400 bg-red-50 shadow-md" : "border-gray-100 bg-white hover:border-gray-200"}`}>
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{hospital.emergency ? "🚨" : "🏥"}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{hospital.name}</h3><p className="text-xs text-gray-500 mt-0.5">{hospital.type || "Hospital"}</p></div></div>
        <p className="text-xs text-gray-600 mt-1 truncate">📍 {hospital.address}</p>
        {hospital.phone && <p className="text-xs text-gray-600 mt-1">📞 {hospital.phone}</p>}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap"><Meta place={hospital} type="hospital" /></div>
      </div>
    </div>
    <div className="flex gap-2 mt-2.5"><button type="button" onClick={(e) => { e.stopPropagation(); onDirections(); }} className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg font-medium">🗺️ Directions</button><button type="button" onClick={(e) => { e.stopPropagation(); onClick(); }} className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 py-1.5 rounded-lg font-medium">📋 Real Details</button></div>
  </article>;
}

export function PharmacyCard({ pharmacy, onClick, onDirections, selected }: PharmacyCardProps) {
  return <article onClick={onClick} className={`cursor-pointer rounded-2xl border p-3 mb-2 transition-all hover:shadow-md ${selected ? "border-emerald-400 bg-emerald-50 shadow-md" : "border-gray-100 bg-white hover:border-gray-200"}`}>
    <div className="flex items-start gap-3"><div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">💊</div><div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{pharmacy.name}</h3><p className="text-xs text-gray-500 mt-0.5">Pharmacy / medical shop</p></div></div><p className="text-xs text-gray-600 mt-1 truncate">📍 {pharmacy.address}</p>{pharmacy.phone && <p className="text-xs text-gray-600 mt-1">📞 {pharmacy.phone}</p>}<div className="flex items-center gap-1.5 mt-2 flex-wrap"><Meta place={pharmacy} type="pharmacy" /></div></div></div>
    <div className="flex gap-2 mt-2.5"><button type="button" onClick={(e) => { e.stopPropagation(); onDirections(); }} className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg font-medium">🗺️ Directions</button><button type="button" onClick={(e) => { e.stopPropagation(); onClick(); }} className="flex-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-1.5 rounded-lg font-medium">📋 Real Details</button></div>
  </article>;
}
