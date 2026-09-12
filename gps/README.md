# 🏥 MediMap GPS — Medical Discovery Platform

A full-featured GPS-powered medical map application built with **Next.js 16**, **React**, **Leaflet.js**, **PostgreSQL**, and **Drizzle ORM**.

---

## 🌟 Features

### 🗺️ GPS & Map
- **Live GPS location** — Detects your real device location via browser Geolocation API
- **Interactive map** — Powered by **OpenStreetMap + Leaflet.js** (free, no API key needed)
- **Blue radius circle** — Shows your configurable search radius (1–20 km)
- **Animated markers** — Color-coded: 🔴 Hospitals, 🟢 Pharmacies, 🔵 You
- **Fly-to animation** — Smooth map transition when selecting a place
- **Google Maps Directions** — One-click button to open Google Maps turn-by-turn navigation

### 🏥 Hospital Discovery
- Browse nearby hospitals sorted by **distance**, **rating**, or **name**
- Filter by **Emergency only**, **Verified only**
- View hospital **type** (General, Cardiac, Children's, Orthopedic, Urgent Care...)
- **Open/Closed** status badge with real-time calculation

### 💊 Pharmacy / Medical Shop
- Browse nearby pharmacies
- Filter by **24-hour**, **Verified**
- Medicine stock level progress bar
- Search medicines by name

### 🕐 Opening Hours
- Full weekly schedule (Mon–Sun) for every hospital and pharmacy
- **Today highlighted** in the hours view
- Real-time open/closed status based on current time

### ✅ Verified Medicine Availability
- Per-pharmacy medicine list with **In Stock / Out of Stock** status
- Price display per medicine
- Searchable medicine list

### ⭐ Ratings & Reviews
- **Star ratings** (1–5) displayed on cards, markers, popups
- Write reviews with name, rating, and comment
- Reviews stored in PostgreSQL and update entity rating

### 📅 Appointment Booking
- 2-step appointment form inside hospital detail panel
- Select **department**, **date**, **time slot**, **doctor** preference
- Confirmation screen with all booking details
- View all appointments at `/appointments`

### 🚨 Emergency SOS
- Prominent **SOS 911** button visible on the map at all times
- Direct dial button (tel:911)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19 + Tailwind CSS 4 |
| Map | Leaflet.js + react-leaflet |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Language | TypeScript |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Main page (renders MedicalGPS)
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles + Leaflet overrides
│   ├── appointments/
│   │   └── page.tsx              # Appointments list page
│   └── api/
│       ├── health/route.ts        # Health check
│       ├── hospitals/
│       │   ├── route.ts          # GET all hospitals
│       │   └── [id]/route.ts     # GET hospital by ID
│       ├── pharmacies/route.ts   # GET all pharmacies
│       ├── appointments/route.ts # GET/POST appointments
│       └── reviews/route.ts      # GET/POST reviews
│
├── components/
│   ├── MedicalGPS.tsx            # Main app shell (sidebar + map)
│   ├── MedicalMap.tsx            # Leaflet map component (client-only)
│   ├── HospitalDetail.tsx        # Hospital detail sidebar panel
│   ├── PharmacyDetail.tsx        # Pharmacy detail sidebar panel
│   ├── PlaceCard.tsx             # Hospital/Pharmacy list cards
│   ├── ReviewSection.tsx         # Reviews list + write review form
│   └── AppointmentModal.tsx      # 2-step appointment booking modal
│
├── db/
│   ├── index.ts                  # Drizzle DB client
│   ├── schema.ts                 # Table definitions
│   └── seed.ts                   # Demo data seeder
│
├── types/
│   └── medical.ts                # TypeScript interfaces
│
└── utils/
    └── distance.ts               # Haversine distance, open/close utils
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create .env file
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medimap" > .env

# Push schema
npx drizzle-kit push

# Seed with demo data
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medimap npx tsx src/db/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open App
Visit [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Scenarios Covered

| Scenario | How it works |
|----------|-------------|
| User needs emergency hospital | 🚨 SOS button + Emergency filter + Red emergency markers |
| User wants nearest pharmacy open now | Filter by open now + sort by distance |
| User needs 24h pharmacy at night | Filter by "24h Pharmacy" checkbox |
| User wants to check medicine before going | Click pharmacy → Medicines tab → see stock |
| User wants to book doctor appointment | Click hospital → Book Appointment button |
| User wants to navigate to hospital | 🗺️ Directions button → opens Google Maps |
| User wants trusted places | ✓ Verified badge filter |
| User wants best-rated hospital | Sort by ⭐ Rating |
| User in new city | GPS auto-detects location + shows all nearby |

---

## 📦 Downloadable Code

To download this project:
1. All source files are in the `src/` directory
2. Run `zip -r medimap-gps.zip . --exclude node_modules .next .git` to create a ZIP
3. Or clone from the repository

---

## 📝 License

MIT License — Free to use and modify.

## Appointment workflow update
The appointment flow is intentionally implemented as a working Swasth demo workflow: choose facility/department/date/time, save the booking, view it in My Appointments, call the facility, message it (SMS when a phone number is available; otherwise an in-app demo thread), and open driving directions. Without an external hospital scheduling integration, the prototype does not claim that an outside hospital has accepted the booking.
