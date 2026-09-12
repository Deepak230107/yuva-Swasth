export const patient = {
  patientId: "P001",
  healthId: "SW-82X7-19Q4",
  name: "Meena Patil",
  dob: "1984-05-12",
  gender: "Female",
  phone: "9876543210",

  address: {
    houseNo: "12",
    street: "Main Street",
    village: "Kaveri Nagar",
    district: "Madurai",
    state: "Tamil Nadu",
    pinCode: "625001"
  },

  emergencyContact: {
    name: "Ravi Patil",
    relation: "Son",
    phone: "9876543222"
  },

  bloodGroup: "O+"
}


export const appointments = [
  {
    appointmentId: "APT001",
    patientId: "P001",
    doctor: "Dr. Ravi Kumar",
    specialty: "General Medicine",
    facility: "Madurai District Hospital",
    date: "18 September 2026",
    time: "10:30 AM",
    type: "In-person",
    status: "Upcoming"
  },
  {
    appointmentId: "APT002",
    patientId: "P001",
    doctor: "Dr. Priya Sharma",
    specialty: "General Medicine",
    facility: "Kaveri Nagar Primary Health Centre",
    date: "02 August 2026",
    time: "11:00 AM",
    type: "In-person",
    status: "Completed"
  }
]


export const medicalRecords = [
  {
    recordId: "REC001",
    patientId: "P001",
    date: "02 August 2026",
    facility: "Kaveri Nagar Primary Health Centre",
    healthWorker: "Dr. Priya Sharma",
    diagnosis: "Fever",
    notes: "Patient reported fever and body pain for two days.",
    treatment: "Prescribed medication and advised rest.",
    status: "Completed"
  },
  {
    recordId: "REC002",
    patientId: "P001",
    date: "15 June 2026",
    facility: "Madurai District Hospital",
    healthWorker: "Dr. Ravi Kumar",
    diagnosis: "Routine check-up",
    notes: "Vitals within normal range.",
    treatment: "Continue regular diet and hydration.",
    status: "Completed"
  }
]


export const medicines = [
  {
    medicineId: "MED001",
    patientId: "P001",
    name: "Paracetamol 500 mg",
    dosage: "1 tablet",
    frequency: "Twice a day",
    duration: "3 days",
    prescribedBy: "Dr. Priya Sharma",
    prescribedDate: "02 August 2026",
    status: "Active",
    purpose: "Helps reduce fever and relieve body pain."
  },

  {
    medicineId: "MED002",
    patientId: "P001",
    name: "ORS",
    dosage: "1 sachet",
    frequency: "Once a day",
    duration: "3 days",
    prescribedBy: "Dr. Priya Sharma",
    prescribedDate: "02 August 2026",
    status: "Active",
    purpose: "Helps replace fluids and salts lost during dehydration."
  }
]


export const labReports = [
  {
    reportId: "LAB001",
    patientId: "P001",
    testName: "Complete Blood Count",
    date: "02 August 2026",
    facility: "Madurai District Hospital",
    result: "Within normal range",
    status: "Normal"
  },
  {
    reportId: "LAB002",
    patientId: "P001",
    testName: "Blood Glucose",
    date: "02 August 2026",
    facility: "Madurai District Hospital",
    result: "96 mg/dL",
    status: "Normal"
  }
]


export const careJourney = [
  {
    journeyId: "CJ001",
    patientId: "P001",
    date: "02 August 2026",
    facility: "Kaveri Nagar Primary Health Centre",
    healthWorker: "Dr. Priya Sharma",
    event: "Consultation",
    description: "Consultation for fever and body pain."
  },
  {
    journeyId: "CJ002",
    patientId: "P001",
    date: "02 August 2026",
    facility: "Madurai District Hospital",
    healthWorker: "Lab Department",
    event: "Lab Test",
    description: "Complete Blood Count and Blood Glucose performed."
  },
    {
    journeyId: "CJ003",
    patientId: "P001",
    date: "05 August 2026",
    facility: "Kaveri Nagar Primary Health Centre",
    healthWorker: "Dr. Priya Sharma",
    event: "Specialist Referral",
    description: "Referred to Madurai District Hospital for specialist consultation.",
    referral: {
      from: "Kaveri Nagar Primary Health Centre",
      to: "Madurai District Hospital",
      department: "General Medicine",
      reason: "Specialist consultation",
      status: "Appointment Scheduled"
    }
  },
  {
    journeyId: "CJ004",
    patientId: "P001",
    date: "18 September 2026",
    facility: "Madurai District Hospital",
    healthWorker: "Dr. Ravi Kumar",
    event: "Upcoming Consultation",
    description: "Follow-up consultation."
  }
]


export const todayUpdates = [
  {
    updateId: "TU001",
    title: "Medication reminder",
    description: "Paracetamol 500 mg is due today at 10:00 AM.",
    time: "10:00 AM",
    status: "Today"
  },
  {
    updateId: "TU002",
    title: "Lab status",
    description: "Your latest blood glucose report is ready.",
    time: "11:30 AM",
    status: "Ready"
  },
  {
    updateId: "TU003",
    title: "Care note",
    description: "Hydration and rest are recommended after the visit.",
    time: "01:00 PM",
    status: "Plan"
  }
]


export const healthWorkers = [
  {
    workerId: "HW001",
    name: "Dr. Priya Sharma",
    role: "Medical Officer",
    facility: "Kaveri Nagar Primary Health Centre",
    district: "Madurai"
  },
  {
    workerId: "HW002",
    name: "Dr. Ravi Kumar",
    role: "General Physician",
    facility: "Madurai District Hospital",
    district: "Madurai"
  }
]


export const HEALTH_ID = patient.healthId