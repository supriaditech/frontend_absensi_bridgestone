import React, { useState } from "react";
import {
  Card,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { useAbsensiKaryawan } from "../../../hooks/useAbsensiKaryawan";
import { useSession } from "next-auth/react";
import { formatToLocalTime } from "../../../utils/formatToLocalTime";

const TABLE_HEAD = ["ID", "Name", "Date", "Checkin", "Checkout", "Status"];
const ITEMS_PER_PAGE = 10; // Jumlah data per halaman

interface TableAbsensiKaryawanProps {
  userId: number;
}

function TableAbsensiKaryawan({ userId }: TableAbsensiKaryawanProps) {
  const { data: session } = useSession() as any;
  const token = session?.accessToken;

  const { absensiData, isLoading, isError } = useAbsensiKaryawan(token, userId);

  const [searchDate, setSearchDate] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman saat ini

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  // Fungsi untuk menentukan kelas berdasarkan status
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

  // Filter data berdasarkan tanggal dan status
  const filteredData = absensiData
    ?.filter((absensi: any) => {
      const formattedDate = new Date(absensi.date).toISOString().split("T")[0];
      return searchDate ? formattedDate === searchDate : true;
    })
    ?.filter((absensi: any) => {
      return searchStatus ? absensi.status === searchStatus : true;
    });

  // Fungsi untuk mendapatkan data berdasarkan halaman saat ini
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Total halaman
  const totalPages = Math.ceil(filteredData?.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 w-full text-center"></h1>
      Data Absensi Karyawan
      {/* Filter Section */}
      <div className="my-4 md:flex gap-4">
        <div className="mb-4 md:mb-0">
          <Input
            crossOrigin={undefined}
            label="Cari berdasarkan tanggal"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border px-2 rounded-lg "
          />
        </div>
        <div>
          <Select
            label="Cari berdasarkan status"
            value={searchStatus}
            onChange={(value) => setSearchStatus(value as string)}
            className="border px-2 rounded-lg"
          >
            <Option value="">Semua Status</Option>
            <Option value="Present">Present</Option>
            <Option value="Late">Late</Option>
            <Option value="Absen">Absen</Option>
            <Option value="Sakit">Sakit</Option>
            <Option value="Izin">Izin</Option>
          </Select>
        </div>
      </div>
      {/* Tampilan untuk layar kecil (sm) menggunakan card */}
      <div className="block md:hidden">
        <div className="grid grid-cols-1 gap-6">
          {paginatedData?.map((absensi: any, index: number) => {
            const formattedDate = formatToLocalTime(absensi.date);
            const formattedCheckInTime = formatToLocalTime(absensi.checkInTime);
            const formattedCheckOutTime = absensi.checkOutTime
              ? formatToLocalTime(absensi.checkOutTime)
              : "Not Checked Out";
            const statusClass = getStatusClass(absensi.status);

            return (
              <Card
                key={absensi.id}
                className="p-4 shadow-lg rounded-lg flex flex-col justify-between"
              >
                <div className="mb-4">
                  <Typography className="text-lg font-semibold">
                    {absensi.user.name}
                  </Typography>
                  <Typography className="text-sm text-gray-500">
                    {formattedDate}
                  </Typography>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Typography className="text-sm font-medium">
                      Checkin:
                    </Typography>
                    <Typography className="text-sm">
                      {formattedCheckInTime}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography className="text-sm font-medium">
                      Checkout:
                    </Typography>
                    <Typography className="text-sm">
                      {formattedCheckOutTime}
                    </Typography>
                  </div>
                </div>

                <div className="mt-4">
                  <Typography
                    className={`text-center p-2 rounded-lg font-semibold ${statusClass}`}
                  >
                    {absensi.status}
                  </Typography>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      {/* Tampilan untuk layar medium ke atas (md) menggunakan table */}
      <div className="hidden md:block">
        <Card className="h-full w-full overflow-scroll p-4 border-2 my-4">
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
              {paginatedData?.map((absensi: any, index: number) => {
                const isLast = index === absensiData.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

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
        </Card>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between md:justify-center gap-4 items-center mt-4">
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
    </div>
  );
}

export default TableAbsensiKaryawan;
