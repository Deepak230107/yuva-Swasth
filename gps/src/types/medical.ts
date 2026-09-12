export interface OpeningHourDay {
  open: string;
  close: string;
  is24h: boolean;
}

export interface OpeningHours {
  monday: OpeningHourDay;
  tuesday: OpeningHourDay;
  wednesday: OpeningHourDay;
  thursday: OpeningHourDay;
  friday: OpeningHourDay;
  saturday: OpeningHourDay;
  sunday: OpeningHourDay;
}

export interface Medicine {
  name: string;
  available: boolean;
  price: string;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  type: string | null;
  rating: number | null;
  totalReviews: number | null;
  verified: boolean | null;
  emergency: boolean | null;
  openingHours: OpeningHours | null;
  services: string[] | null;
  imageUrl: string | null;
  createdAt: Date | null;
  openingHoursText?: string | null;
  source?: string | null;
  osmId?: string | null;
  distance?: number;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  rating: number | null;
  totalReviews: number | null;
  verified: boolean | null;
  open24Hours: boolean | null;
  openingHours: OpeningHours | null;
  medicines: Medicine[] | null;
  imageUrl: string | null;
  createdAt: Date | null;
  openingHoursText?: string | null;
  source?: string | null;
  osmId?: string | null;
  distance?: number;
}

export interface Appointment {
  id: number;
  hospitalId: number | null;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  department: string;
  doctor: string | null;
  appointmentDate: string;
  appointmentTime: string;
  status: string | null;
  notes: string | null;
  createdAt: Date | null;
}

export interface Review {
  id: number;
  entityType: string;
  entityId: number;
  reviewerName: string;
  rating: number;
  comment: string | null;
  createdAt: Date | null;
}

export type MapFilter = "all" | "hospitals" | "pharmacies";
export type ActiveTab = "map" | "list" | "appointments";
