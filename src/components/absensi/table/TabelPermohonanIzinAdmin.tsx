import React, { useState } from "react";
import {
  Typography,
  Input,
  Select,
  Option,
  Button,
  Dialog,
} from "@material-tailwind/react";
import { useLeaveForm } from "../../../../hooks/useLeaveForm";
import { formatToLocalTime } from "../../../../utils/formatToLocalTime";
import Image from "next/image";
import { ToastContainer } from "react-toastify";

interface TablePemhonanIzinPropsAdmin {
  token: string;
  userId: number;
}

function TabelPermohonanIzinAdmin({
  token,
  userId,
}: TablePemhonanIzinPropsAdmin) {
  const {
    leaveDataAllUser,
    modalAction,
    setModalAction,
    valueAction,
    setValueAction,
    handleApiAction,
  } = useLeaveForm(token, userId);
  const [searchDate, setSearchDate] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [idIzin, setIdIzin] = useState<Number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const TABLE_HEAD = [
    "ID",
    "User ID",
    "Name",
    "Start Date",
    "Lama libur",
    "Alasan",
    "Status",
    "Action",
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

  const filteredLeaveData = leaveDataAllUser?.filter((leave: any) => {
    const formattedDate = new Date(leave.date).toISOString().split("T")[0];
    const matchesDate = searchDate ? formattedDate === searchDate : true;
    const matchesStatus = searchStatus ? leave.status === searchStatus : true;

    // Check if the searchTerm matches either the user's name or userId
    const matchesNameOrId = searchTerm
      ? leave.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.user.userId.toString().includes(searchTerm)
      : true;

    return matchesDate && matchesStatus && matchesNameOrId;
  });

  const handleAction = (value: string, id: number) => {
    setIdIzin(id);
    setValueAction(value);
    setModalAction(true);
  };
  return (
    <div className="w-full py-10">
      <div className="mx-20 py-10 border-2 rounded-md px-10">
        <p className="text-center text-xl font-bold">Status Permohonan Izin</p>

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
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
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
            {filteredLeaveData?.map((leave: any, index: number) => {
              const isLast = index === filteredLeaveData.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              const formattedDate = formatToLocalTime(leave.date);
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
                      {leave.user.userId}
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
                  <td
                    className={`${classes} text-center rounded-lg flex gap-4`}
                  >
                    <Button
                      size="sm"
                      className="bg-blue-400"
                      disabled={leave.status === "Approved" ? true : false}
                      onClick={() => handleAction("Approved", leave.id)}
                    >
                      Approved
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-400"
                      onClick={() => handleAction("Rejected", leave.id)}
                      disabled={leave.status === "Rejected" ? true : false}
                    >
                      Rejected
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Dialog
        open={modalAction}
        handler={() => setModalAction(!modalAction)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="flex-row justify-center item-center"
      >
        <div className="p-20 flex flex-col justify-center items-center">
          <Image
            src={"/assets/dataKaryawan/permission.png"}
            width={200}
            height={200}
            alt="Ilustrasi"
          />
          <p className="my-4 text-lg font-bold text-black">
            Apakah anda yakin ingin {valueAction} izin ini
          </p>
          <div className="flex gap-6 justify-center items-center">
            <Button
              size="sm"
              className={
                valueAction === "Approved" ? `bg-blue-400` : `bg-red-400`
              }
              onClick={() => handleApiAction(idIzin ?? null)}
            >
              {valueAction}
            </Button>
            <Button
              size="sm"
              className="bg-black"
              onClick={() => setModalAction(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default TabelPermohonanIzinAdmin;
