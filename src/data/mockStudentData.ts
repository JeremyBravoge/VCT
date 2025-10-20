export interface StudentProfile {
  name: string;
  admissionNumber: string;
  class: string;
  level: string;
  photo: string;
}

export interface Grade {
  subject: string;
  currentTerm: number;
  previousTerm: number;
  grade: string;
  trend: string;
}

export interface Attendance {
  current: number;
  total: number;
  present: number;
  absent: number;
  late: number;
}

export interface Payment {
  date: string;
  amount: number;
  method: string;
  receipt: string;
}

export interface Fees {
  totalDue: number;
  totalPaid: number;
  balance: number;
  dueDate: string;
  payments: Payment[];
}

export interface Assignment {
  subject: string;
  title: string;
  dueDate: string;
  status: string;
}

export interface StudentData {
  profile: StudentProfile;
  grades: Grade[];
  attendance: Attendance;
  fees: Fees;
  assignments: Assignment[];
}

export const mockStudentData: StudentData = {
  profile: {
    name: "Mary Wanjiku",
    admissionNumber: "STD2024001",
    class: "Grade 7A",
    level: "Upper Primary",
    photo: "/placeholder.svg"
  },
  grades: [
    { subject: "Mathematics", currentTerm: 85, previousTerm: 78, grade: "A", trend: "up" },
    { subject: "English", currentTerm: 78, previousTerm: 82, grade: "B+", trend: "down" },
    { subject: "Science", currentTerm: 92, previousTerm: 88, grade: "A", trend: "up" },
    { subject: "Social Studies", currentTerm: 75, previousTerm: 70, grade: "B", trend: "up" },
    { subject: "Kiswahili", currentTerm: 80, previousTerm: 76, grade: "B+", trend: "up" },
    { subject: "CRE", currentTerm: 88, previousTerm: 85, grade: "A-", trend: "up" }
  ],
  attendance: {
    current: 94,
    total: 180,
    present: 169,
    absent: 8,
    late: 3
  },
  fees: {
    totalDue: 28000,
    totalPaid: 20000,
    balance: 8000,
    dueDate: "2025-02-15",
    payments: [
      { date: "2025-01-15", amount: 10000, method: "M-Pesa", receipt: "MPT001" },
      { date: "2025-01-05", amount: 10000, method: "Bank Transfer", receipt: "BNK001" }
    ]
  },
  assignments: [
    { subject: "Mathematics", title: "Algebra Problems", dueDate: "2025-01-15", status: "pending" },
    { subject: "English", title: "Essay Writing", dueDate: "2025-01-12", status: "submitted" },
    { subject: "Science", title: "Lab Report", dueDate: "2025-01-18", status: "pending" }
  ]
};
