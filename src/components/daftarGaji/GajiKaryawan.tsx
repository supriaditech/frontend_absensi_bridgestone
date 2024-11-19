import React, { useState } from "react";
import { useDaftarGajiKaryawan } from "../../../hooks/useGajiKaryawan";
import { MONTHS } from "../../../types/month";
import { Input, Option, Select } from "@material-tailwind/react";
import { jsPDF } from "jspdf";
interface GajiKaryawanProps {
  token: string;
}

function GajiKaryawan({ token }: GajiKaryawanProps) {
  const { gajiData, isLoading, isError } = useDaftarGajiKaryawan(token);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchMonth, setSearchMonth] = useState<string>("");
  const [searchYear, setSearchYear] = useState<string>("Semua Tahun");
  console.log(gajiData);
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

  const generatePDF = (gaji: any) => {
    const doc = new jsPDF();

    // Header

    doc.setFontSize(12);
    doc.text("PT Bridgestone Sumatra rubber estate", 20, 30);
    doc.setFontSize(10);
    doc.text("Jl. Dolok Merangir No.4, Dolok Merangir I, ", 20, 35);
    doc.setFontSize(10);
    doc.text("Kec. Dolok Batu Nanggar,  ", 20, 40);
    doc.setFontSize(10);
    doc.text("Kabupaten Simalungun, Sumatera Utara 21155 ", 20, 45);

    // Informasi Karyawan dan Periode
    doc.setFontSize(10);
    doc.text("Periode  :", 120, 30);
    doc.text(`${getMonthLabel(gaji.month)} ${gaji.year}`, 150, 30);
    doc.text("Nama Karyawan :", 120, 35);
    doc.text(gaji.user.name, 150, 35);
    doc.text("Jabatan :", 120, 40);
    doc.text(gaji.user.employmentStatus, 150, 40);
    doc.text("Status  :", 120, 45);
    doc.text("Karyawan Tetap", 150, 45);

    // Garis pemisah
    doc.line(20, 50, 190, 50);

    // PENERIMAAN
    doc.setFontSize(10);
    doc.text("PENERIMAAN", 20, 55);
    let yPosition = 60;
    doc.text("Gaji Pokok", 30, yPosition);
    doc.text(`Rp ${gaji.initialSalary.toLocaleString()}`, 170, yPosition, {
      align: "right",
    });
    yPosition += 5;

    // Tambahkan rincian penerimaan lainnya jika ada
    doc.text("Tunjangan", 30, yPosition);
    doc.text("Rp 0", 170, yPosition, { align: "right" });
    yPosition += 5;

    doc.text("Bonus", 30, yPosition);
    doc.text("Rp 0", 170, yPosition, { align: "right" });
    yPosition += 5;

    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;

    doc.text("Total Penghasilan Bruto", 30, yPosition);
    doc.text(`Rp ${gaji.initialSalary.toLocaleString()}`, 170, yPosition, {
      align: "right",
    });

    // Garis pemisah
    yPosition += 10;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;

    // PENGURANGAN
    doc.text("PENGURANGAN", 20, yPosition);
    yPosition += 5;

    doc.text("Permohonan Izin", 30, yPosition);
    doc.text(
      `${gaji.attendanceStats.Izin.toLocaleString()} hari`,
      170,
      yPosition,
      {
        align: "right",
      }
    );
    yPosition += 5;

    doc.text("Permohonan Sakit", 30, yPosition);
    doc.text(
      `${gaji.attendanceStats.Sakit.toLocaleString()} hari`,
      170,
      yPosition,
      {
        align: "right",
      }
    );
    yPosition += 5;

    doc.text("Permohonan Absen", 30, yPosition);
    doc.text(
      `${gaji.attendanceStats.Absen.toLocaleString()} hari`,
      170,
      yPosition,
      {
        align: "right",
      }
    );
    yPosition += 5;

    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;

    // Total pengurangan
    doc.text("Total Pengurangan (B)", 30, yPosition);
    doc.text(
      `Rp ${gaji.totalMonthlyDeductions.toLocaleString()}`,
      170,
      yPosition,
      {
        align: "right",
      }
    );

    // Garis pemisah
    yPosition += 10;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;

    // TOTAL DITERIMA
    doc.text("TOTAL DITERIMA KARYAWAN", 20, yPosition);
    doc.text(`Rp ${gaji.totalSalary.toLocaleString()}`, 170, yPosition, {
      align: "right",
    });

    // Tambahkan tanggal dan tanda tangan
    yPosition += 20;
    const currentDate = new Date();
    const formattedDate = `Medan, ${currentDate.getDate()} ${getMonthLabel(
      currentDate.getMonth() + 1
    )} ${currentDate.getFullYear()}`;

    doc.text(formattedDate, 140, yPosition); // Cetak tanggal
    yPosition += 5;
    doc.text("Manager HRD", 140, yPosition);
    yPosition += 15; // Spasi untuk tanda tangan
    doc.text("Junaidi", 140, yPosition);

    // Save the PDF
    doc.save(
      `Slip_Gaji_${gaji.user.name}_${getMonthLabel(gaji.month)}_${
        gaji.year
      }.pdf`
    );
  };

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
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                onClick={() => generatePDF(gaji)}
              >
                Cetak Slip Gaji
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GajiKaryawan;
