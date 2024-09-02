import React from "react";
import { Typography } from "@material-tailwind/react";
import { useLeaveForm } from "../../../../hooks/useLeaveForm";
import { formatToLocalTime } from "../../../../utils/formatToLocalTime";

interface TablePemhonanIzinProps {
  token: string;
  userId: number;
}
function TablePemhonanIzin({ token, userId }: TablePemhonanIzinProps) {
  const { leaveDataUser, isLoading, isError } = useLeaveForm(token, userId);

  const TABLE_HEAD = [
    "ID",
    "Name",
    "Start Date",
    "Lama libur",
    "Alasan",
    "Status",
  ];
  function getStatusClass(status: string): string {
    switch (status) {
      case "Pending":
        return "bg-gray-500 text-white";
      case "Approved":
        return "bg-green-500 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white"; // Default jika status tidak dikenal
    }
  }
  return (
    <div className=" w-full  py-10">
      <div className="mx-20 py-10 border-2 rounded-md px-10">
        <p className="text-center text-xl font-bold">Status Permohonan Izin</p>
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
            {leaveDataUser?.map((leave: any, index: number) => {
              const isLast = index === leaveDataUser.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              // Format waktu secara manual ke waktu lokal
              const formattedDate = formatToLocalTime(leave.date);
              const formattedCheckInTime = formatToLocalTime(leave.checkInTime);
              const formattedCheckOutTime = leave.checkOutTime
                ? formatToLocalTime(leave.checkOutTime)
                : "Not Checked Out";
              const statusClass = getStatusClass(leave.status);
              return (
                <tr key={leave.id}>
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
                      {leave.user.name}
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
                      {leave.durationDays} hari
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {leave.reason}
                    </Typography>
                  </td>
                  <td className={`${classes} text-center rounded-lg`}>
                    <Typography
                      variant="small"
                      className={`font-normal ${statusClass} rounded-lg`}
                    >
                      {leave.status}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablePemhonanIzin;
