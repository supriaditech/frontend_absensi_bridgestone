import { Button } from "@material-tailwind/react";
import Image from "next/image";
import React from "react";
import { ToastContainer } from "react-toastify";
import { useDataKaryawan } from "../../../hooks/useDataKaryawan";

interface ModalDeleteKaryawanProps {
  token: string;
  onClose: () => void;
  karyawanId: number;
}

function ModalDeleteKaryawan({
  token,
  onClose,
  karyawanId,
}: ModalDeleteKaryawanProps) {
  const { deleteKaryawan } = useDataKaryawan(token);

  const handleDelete = async () => {
    const result = await deleteKaryawan(karyawanId);
    if (result.success) {
      onClose(); // Close the modal only on success
    }
  };
  return (
    <div className="flex flex-col items-center p-4">
      <Image
        src={"/assets/dataKaryawan/delete.png"}
        width={100}
        height={100}
        alt="Delete Confirmation"
      />
      <p className="text-lg font-bold text-black mb-4">
        Apakah Anda yakin ingin menghapus karyawan ini?
      </p>
      <div className="flex gap-4">
        <Button color="red" onClick={handleDelete}>
          Hapus
        </Button>
        <Button color="blue" onClick={onClose}>
          Batal
        </Button>
      </div>
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

export default ModalDeleteKaryawan;
