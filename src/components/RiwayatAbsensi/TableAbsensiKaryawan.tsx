import React from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useAbsensiKaryawan } from "../../../hooks/useAbsensiKaryawan";
import { useSession } from "next-auth/react";
import { formatToLocalTime } from "../../../utils/formatToLocalTime";

const TABLE_HEAD = ["ID", "Name", "Date", "Checkin", "Checkout", "Status"];

interface TableAbsensiKaryawanProps {
  userId: number;
}

function TableAbsensiKaryawan({ userId }: TableAbsensiKaryawanProps) {
  const { data: session } = useSession() as any;
  const token = session?.accessToken;

  const { absensiData, isLoading, isError } = useAbsensiKaryawan(token, userId);

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

  return (
    <div>
      <Card className="h-full w-full overflow-scroll p-4 border-2 my-4">
        <h1 className="text-2xl font-bold mb-6 w-full text-center">
          Data Absensi Karyawan
        </h1>
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
            {absensiData?.map((absensi: any, index: number) => {
              const isLast = index === absensiData.length - 1;
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
                      {index + 1}
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
  );
}

export default TableAbsensiKaryawan;
