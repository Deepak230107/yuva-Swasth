import {
  pgTable,
  serial,
  text,
  varchar,
  real,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// Hospitals table
export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  type: varchar("type", { length: 100 }).default("General Hospital"),
  rating: real("rating").default(4.0),
  totalReviews: integer("total_reviews").default(0),
  verified: boolean("verified").default(true),
  emergency: boolean("emergency").default(false),
  openingHours: jsonb("opening_hours"),
  services: jsonb("services"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pharmacies table
export const pharmacies = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  phone: varchar("phone", { length: 50 }),
  rating: real("rating").default(4.0),
  totalReviews: integer("total_reviews").default(0),
  verified: boolean("verified").default(true),
  open24Hours: boolean("open_24_hours").default(false),
  openingHours: jsonb("opening_hours"),
  medicines: jsonb("medicines"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  patientName: varchar("patient_name", { length: 255 }).notNull(),
  patientPhone: varchar("patient_phone", { length: 50 }).notNull(),
  patientEmail: varchar("patient_email", { length: 255 }),
  department: varchar("department", { length: 100 }).notNull(),
  doctor: varchar("doctor", { length: 255 }),
  appointmentDate: varchar("appointment_date", { length: 20 }).notNull(),
  appointmentTime: varchar("appointment_time", { length: 20 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type", { length: 20 }).notNull(), // 'hospital' | 'pharmacy'
  entityId: integer("entity_id").notNull(),
  reviewerName: varchar("reviewer_name", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
