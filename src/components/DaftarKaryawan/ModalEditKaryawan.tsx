import React, { useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Karyawan } from "../../../types/dataKaryawanType";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

interface ModalEditKaryawanProps {
  token: string;
  karyawan: Karyawan;
  onClose: () => void;
  onSubmit: SubmitHandler<Karyawan>;
}

function ModalEditKaryawan({
  token,
  karyawan,
  onClose,
  onSubmit,
}: ModalEditKaryawanProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Karyawan>();

  useEffect(() => {
    if (karyawan) {
      setValue("id", karyawan.id);
      setValue("name", karyawan.name);
      setValue("dateOfBirth", dayjs(karyawan.dateOfBirth).format("YYYY-MM-DD"));
      setValue("phoneNumber", karyawan.phoneNumber);
      setValue("address", karyawan.address);
      setValue("employmentStatus", karyawan.employmentStatus);
      setValue("role", karyawan.role);
    }
  }, [karyawan, setValue]);

  return (
    <div className="flex justify-center p-4 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-lg font-bold text-black mb-4">Edit Karyawan</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* <Input type="hidden" {...register("id")} /> */}
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
          <Input
            crossOrigin={undefined}
            label="Role"
            {...register("role", { required: "Role is required" })}
            className="mb-4"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button color="red" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" color="blue">
              Simpan
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

export default ModalEditKaryawan;
