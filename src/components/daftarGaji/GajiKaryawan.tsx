import React, { useState } from "react";
import { useDaftarGajiKaryawan } from "../../../hooks/useGajiKaryawan";
import { MONTHS } from "../../../types/month";
import { Input, Option, Select } from "@material-tailwind/react";

interface GajiKaryawanProps {
  token: string;
}

function GajiKaryawan({ token }: GajiKaryawanProps) {
  const { gajiData, isLoading, isError } = useDaftarGajiKaryawan(token);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchMonth, setSearchMonth] = useState<string>("");
  const [searchYear, setSearchYear] = useState<string>("Semua Tahun");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  const getMonthLabel = (monthNumber: number) => {
    const monthObj = MONTHS.find(
      (month) => Number(month.value) === monthNumber
    );
    return monthObj ? monthObj.label : "Unknown Month";
  };

  // Data tahun yang bisa dipilih
  const years = ["Semua Tahun", 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // Filter data berdasarkan pencarian
  const filteredData = gajiData?.filter((gaji: any) => {
    // Filter berdasarkan nama karyawan
    const matchesName = gaji.user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter berdasarkan bulan
    const matchesMonth = searchMonth
      ? gaji.month === Number(searchMonth)
      : true;

    // Filter berdasarkan tahun
    const matchesYear =
      searchYear === "Semua Tahun" ? true : gaji.year === Number(searchYear);

    return matchesName && matchesMonth && matchesYear;
  });

  return (
    <div className="p-10">
      <div className="my-4 flex gap-4">
        <div>
          <Select
            label="Pilih Bulan"
            value={searchMonth}
            onChange={(value) => setSearchMonth(value as string)}
            className="border px-2 rounded-lg"
          >
            {MONTHS.map((month) => (
              <Option key={month.value} value={month.value}>
                {month.label}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          {/* Filter tahun */}
          <Select
            label="Pilih Tahun"
            value={searchYear}
            onChange={(value) => setSearchYear(value as string)}
            className="border px-2 rounded-lg"
          >
            {years.map((year) => (
              <Option key={year} value={String(year)}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center ">
        {filteredData?.map((gaji: any) => (
          <div
            key={gaji.id}
            className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6 h-auto"
          >
            <div className="flex flex-col gap-4">
              <div className="text-gray-700">
                <p className="text-xl font-semibold">Nama: {gaji.user.name}</p>
                <p className="text-lg text-gray-500">
                  Jabatan: {gaji.user.employmentStatus}
                </p>
                <p className="text-sm text-gray-400">
                  Bulan/Tahun: {getMonthLabel(gaji.month)}/{gaji.year}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                  <div className="rounded-full w-4 h-4 bg-red-500" />
                  <p className="text-gray-700">
                    Absen: {gaji.attendanceStats.Absen}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                  <div className="rounded-full w-4 h-4 bg-blue-500" />
                  <p className="text-gray-700">
                    Izin: {gaji.attendanceStats.Izin}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                  <div className="rounded-full w-4 h-4 bg-yellow-500" />
                  <p className="text-gray-700">
                    Late: {gaji.attendanceStats.Late}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                  <div className="rounded-full w-4 h-4 bg-green-500" />
                  <p className="text-gray-700">
                    Sakit: {gaji.attendanceStats.Sakit}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Gaji Awal: </span>Rp{" "}
                  {gaji.initialSalary.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Potongan: </span>Rp{" "}
                  {gaji.totalMonthlyDeductions.toLocaleString()}
                </p>
                <p className="text-green-600 font-semibold">
                  <span className="font-semibold">Hasil Gaji: </span>Rp{" "}
                  {gaji.totalSalary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GajiKaryawan;
