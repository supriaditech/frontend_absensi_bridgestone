import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { formatToLocalTime } from "../../../utils/formatToLocalTime";
import { useDaftarGaji } from "../../../hooks/useDaftarGaji";
import { convertToRupiah } from "../../../utils/convertRupiah";
import { MONTHS } from "../../../types/month";
import * as XLSX from "xlsx";

interface TabelDaftarGajiAdminProps {
  userId: number;
  token: string;
}

function TabelDaftarGajiAdmin({ userId, token }: TabelDaftarGajiAdminProps) {
  const ITEMS_PER_PAGE = 10; // Jumlah data per halaman
  const TABLE_HEAD = [
    "ID",
    "User ID",
    "Nama",
    "Jabatan",
    "Bulan",
    "Tahun",
    "Jlh. Absen",
    "Jlh. Izin",
    "Jlh. Late",
    "Gaji Harian",
    "Gaji Awal",
    "Potongan",
    "Hasil Gaji",
  ];

  // State untuk pencarian dan filter
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchMonth, setSearchMonth] = useState<string>("");
  const [searchYear, setSearchYear] = useState<string>("Semua Tahun"); // Default: Semua Tahun

  const { gajiData, isLoading, isError } = useDaftarGaji(token, userId);
  const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman saat ini

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  // Fungsi untuk memfilter data berdasarkan nama/userId, bulan, dan tahun
  const filteredData = gajiData?.filter((gaji: any) => {
    const matchTerm =
      gaji.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gaji.user.userId.toString().includes(searchTerm);

    const matchMonth =
      searchMonth !== "" ? gaji.month === Number(searchMonth) : true;

    const matchYear =
      searchYear !== "Semua Tahun" ? gaji.year === Number(searchYear) : true;

    return matchTerm && matchMonth && matchYear;
  });

  // Fungsi untuk mendapatkan data yang akan ditampilkan pada halaman saat ini
  const currentData = filteredData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Menghitung jumlah halaman berdasarkan data yang difilter
  const totalPages = Math.ceil(filteredData?.length / ITEMS_PER_PAGE);

  // Fungsi untuk berpindah halaman
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Fungsi untuk mendapatkan label bulan dari angka bulan
  const getMonthLabel = (monthNumber: number) => {
    const monthObj = MONTHS.find(
      (month) => Number(month.value) === monthNumber
    );
    return monthObj ? monthObj.label : "Unknown Month";
  };

  // Data tahun yang bisa dipilih
  const years = ["Semua Tahun", 2024, 2025, 2026, 2027, 2028, 2029, 2030]; // Tahun statis, bisa dimodifikasi sesuai kebutuhan

  const exportToExcel = (data: any[], month: string, year: string) => {
    // Konversi data ke format yang sesuai untuk Excel
    const formattedData = data.map((item, index) => ({
      No: index + 1,
      "User ID": item.user.userId,
      Nama: item.user.name,
      Jabatan: item.user.employmentStatus,
      Bulan: month,
      Tahun: year,
      "Jumlah Absen": item.attendanceStats?.Absen || 0,
      "Jumlah Izin": item.attendanceStats?.Izin || 0,
      "Jumlah Late": item.attendanceStats?.Late || 0,
      "Gaji Harian": item.dailySalary,
      "Gaji Awal": item.initialSalary,
      "Potongan Gaji": item.totalMonthlyDeductions,
      "Hasil Gaji": item.totalSalary,
    }));

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Gaji");

    // Ekspor file
    const fileName = `Rekap_Gaji_Bulanan_${month}_${year}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div>
      <Card className="h-full w-full overflow-scroll p-4 border-2 my-4">
        <h1 className="text-2xl font-bold mb-6 w-full text-center">
          Data gaji Karyawan
        </h1>
        <div className="my-4 flex gap-4">
          <div>
            <Input
              crossOrigin={undefined}
              label="Cari karyawan..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-2 rounded-lg"
            />
          </div>
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
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData?.map((gaji: any, index: number) => {
              const isLast = index === currentData.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              // Dapatkan nama bulan dari angka bulan
              const monthLabel = getMonthLabel(gaji.month);

              return (
                <tr key={gaji.id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gaji.user.userId}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gaji.user.name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gaji.user.employmentStatus}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {monthLabel}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gaji.year}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gaji?.attendanceStats?.Absen} Hari
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gaji?.attendanceStats?.Izin} Hari
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {gaji?.attendanceStats?.Late} Hari
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {convertToRupiah(gaji.dailySalary)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {convertToRupiah(gaji.initialSalary)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {convertToRupiah(gaji.totalMonthlyDeductions)}
                    </Typography>
                  </td>
                  <td className={`text-center rounded-lg`}>
                    <Typography
                      variant="small"
                      className={`font-normal bg-green-500  text-white rounded-lg`}
                    >
                      {convertToRupiah(gaji.totalSalary)}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Button
          onClick={() => exportToExcel(filteredData, searchMonth, searchYear)}
          className="bg-green-500 text-white"
        >
          Export to Excel
        </Button>

        <div className="flex justify-center gap-6 items-center mt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="bg-blue-500"
          >
            Previous
          </Button>
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="bg-blue-500"
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default TabelDaftarGajiAdmin;
