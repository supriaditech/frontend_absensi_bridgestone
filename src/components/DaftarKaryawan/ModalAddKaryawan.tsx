import React from "react";
import { Button, Input } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDataKaryawan } from "../../../hooks/useDataKaryawan";

interface ModalAddKaryawanProps {
  token: string;
  onClose: () => void;
}

function ModalAddKaryawan({ token, onClose }: ModalAddKaryawanProps) {
  const { register, handleSubmit, onSubmit, errors, loading } =
    useDataKaryawan(token);

  const handleFormSubmit = async (data: any) => {
    const result = await onSubmit(data);
    console.log(result);
    if (result !== undefined) {
      onClose();
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-lg font-bold text-black mb-4">Tambah Karyawan</p>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            crossOrigin={undefined}
            label="User ID"
            {...register("userId", { required: "User ID is required" })}
            className="mb-4"
          />
          <Input
            crossOrigin={undefined}
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="mb-4"
          />
          <Input
            crossOrigin={undefined}
            label="Name"
            {...register("name", { required: "Name is required" })}
            className="mb-4"
          />
          <Input
            crossOrigin={undefined}
            label="Date of Birth"
            type="date"
            {...register("dateOfBirth", {
              required: "Date of Birth is required",
            })}
            className="mb-4"
          />
          <Input
            crossOrigin={undefined}
            label="Employment Start Date"
            type="date"
            {...register("employmentStartDate", {
              required: "Employment Start Date is required",
            })}
            className="mb-4"
          />
          <Input
            crossOrigin={undefined}
            label="Phone Number"
            {...register("phoneNumber", {
              required: "Phone Number is required",
            })}
            className="mb-4"
          />
          <Input
            crossOrigin={undefined}
            label="Address"
            {...register("address", { required: "Address is required" })}
            className="mb-4"
          />
          <Input
            crossOrigin={undefined}
            label="Employment Status"
            {...register("employmentStatus", {
              required: "Employment Status is required",
            })}
            className="mb-4"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button color="red" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" color="blue" disabled={loading}>
              {loading ? "Menambahkan..." : "Simpan"}
            </Button>
          </div>
        </form>
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
    </div>
  );
}

export default ModalAddKaryawan;
