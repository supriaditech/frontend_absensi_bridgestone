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
import { useAbsensiKaryawanAdmin } from "../../../hooks/useAbsensiKaryawanAdmin";
import * as XLSX from "xlsx";

interface TabelAbsensiAdmin {
  userId: number;
  token: string;
}

function TabelAbsensiAdmin({ userId, token }: TabelAbsensiAdmin) {
  const ITEMS_PER_PAGE = 10; // Jumlah data per halaman
  const TABLE_HEAD = [
    "ID",
    "User ID",
    "Name",
    "Date",
    "Checkin",
    "Checkout",
    "Status",
  ];
  const [searchDate, setSearchDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  console.log(searchDate);
  const { absensiData, isLoading, isError } = useAbsensiKaryawanAdmin(
    token,
    userId
  );

  console.log("absensiData", absensiData);
  const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman saat ini

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  // Fungsi untuk memfilter data berdasarkan tanggal, searchTerm (nama atau userId), dan searchStatus
  const filteredData = absensiData
    ?.filter((absensi: any) => {
      const formattedDate = new Date(absensi.date).toISOString().split("T")[0]; // Menyesuaikan format dengan input date
      return searchDate ? formattedDate === searchDate : true;
    })
    ?.filter((absensi: any) => {
      return (
        absensi.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        absensi.user.userId.toString().includes(searchTerm)
      );
    })
    ?.filter((absensi: any) => {
      return searchStatus ? absensi.status === searchStatus : true;
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

  function getStatusClass(status: string): string {
    switch (status) {
      case "Present":
        return "bg-green-500 text-white";
      case "Late":
        return "bg-yellow-500 text-black";
      case "Absen":
        return "bg-red-500 text-white";
      case "Sakit":
        return "bg-blue-500 text-white";
      case "Izin":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white"; // Default jika status tidak dikenal
    }
  }

  const exportToExcel = (data: any[], month: string, year: string) => {
    // Konversi data ke format yang sesuai untuk Excel
    const formattedData = data.map((item, index) => ({
      No: index + 1,
      "User ID": item.user.userId,
      Nama: item.user.name,
      Jabatan: item.user.employmentStatus,

      Date: formatToLocalTime(item.date),
      "Waktu Checkin ": formatToLocalTime(item.checkInTime) || 0,
      "Waktu Checkout": formatToLocalTime(item.checkOutTime) || 0,
      Status: item.status || 0,
    }));

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Gaji");

    // Ekspor file
    const fileName = `Rekap_Absensi_${month}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div>
      <Card className="h-full w-full overflow-scroll p-4 border-2 my-4">
        <h1 className="text-2xl font-bold mb-6 w-full text-center">
          Data Absensi Karyawan
        </h1>
        <div className="my-4 flex gap-4">
          <div>
            <Input
              crossOrigin={undefined}
              label="Cari berdasarkan tanggal"
              type="date"
              id="searchDate"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border px-2 rounded-lg"
            />
          </div>
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
              id="searchStatus"
              label="Cari berdasarkan status"
              value={searchStatus}
              onChange={(value: any) => setSearchStatus(value)}
              className="border px-2 rounded-lg"
            >
              <Option value="">Semua</Option>
              <Option value="Present">Present</Option>
              <Option value="Late">Late</Option>
              <Option value="Absen">Absen</Option>
              <Option value="Sakit">Sakit</Option>
              <Option value="Izin">Izin</Option>
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
            {currentData?.map((absensi: any, index: number) => {
              const isLast = index === currentData.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              // Format waktu secara manual ke waktu lokal
              const formattedDate = formatToLocalTime(absensi.date);
              const formattedCheckInTime = formatToLocalTime(
                absensi.checkInTime
              );
              const formattedCheckOutTime = absensi.checkOutTime
                ? formatToLocalTime(absensi.checkOutTime)
                : "Not Checked Out";
              const statusClass = getStatusClass(absensi.status);
              return (
                <tr key={absensi.id}>
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
                      {absensi.user.userId}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {absensi.user.name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formattedDate}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formattedCheckInTime}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formattedCheckOutTime}
                    </Typography>
                  </td>
                  <td className={`${classes} text-center rounded-lg`}>
                    <Typography
                      variant="small"
                      className={`font-normal ${statusClass} rounded-lg`}
                    >
                      {absensi.status}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Button
          onClick={() => exportToExcel(filteredData, searchDate, "")}
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

export default TabelAbsensiAdmin;
