// Tipe untuk data gaji
export interface Salary {
  id: number;
  userId: number;
  initialSalary: number;
  totalMonthlyDeductions: number;
  totalSalary: number;
  month: number;
  year: number;
}

// Tipe untuk data karyawan
export interface Karyawan {
  id: number;
  userId: string;
  password: string;
  name: string;
  dateOfBirth: string; // Bisa juga menggunakan Date jika data diolah
  employmentStartDate: string; // Bisa juga menggunakan Date jika data diolah
  phoneNumber: string;
  address: string;
  employmentStatus: string;
  role: string;
  createdAt: string; // Bisa juga menggunakan Date jika data diolah
  updatedAt: string; // Bisa juga menggunakan Date jika data diolah
  attendanceRecords: any[]; // Sesuaikan tipe jika diketahui
  leaveRecords: any[]; // Sesuaikan tipe jika diketahui
  salary: Salary;
}

// Tipe untuk response API
export interface ApiResponse {
  data: Karyawan[];
}

export interface AddKaryawanData {
  userId: string;
  password: string;
  name: string;
  dateOfBirth: string;
  employmentStartDate: string;
  phoneNumber: string;
  address: string;
  employmentStatus: string;
  role: string;
}
