export const patient = {
  patientId: "P001",
  healthId: "SW-82X7-19Q4",
  name: "Meena Patil",
  dob: "1984-05-12",
  gender: "Female",
  phone: "9876543210",
  address: "12, Main Street",
  village: "Kaveri Nagar",
  district: "Madurai",
  state: "Tamil Nadu",
  pinCode: "625001",
  emergencyContact: "9876543222",
  bloodGroup: "O+"
}

export const appointments = [
  {
    appointmentId: "APT001",
    patientId: "P001",
    doctor: "Dr. Ravi Kumar",
    specialty: "General Medicine",
    facility: "Madurai District Hospital",
    date: "2026-09-18",
    time: "10:30 AM",
    type: "In-person",
    status: "Upcoming"
  }
]

export const HEALTH_ID = patient.healthId