import React from "react";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDataKaryawan } from "../../../hooks/useDataKaryawan";

enum EmployeeStatus {
  SeniorManager = "SeniorManager",
  Manager = "Manager",
  HeadSection = "HeadSection",
  Assistant = "Assistant",
  Foreman = "Foreman",
  Manning = "Manning",
}

interface ModalAddKaryawanProps {
  token: string;
  onClose: () => void;
}

interface SubmitResult {
  success: boolean;
  message?: string; // optional message property
}

function ModalAddKaryawan({ token, onClose }: ModalAddKaryawanProps) {
  const { register, handleSubmit, onSubmit, errors, loading, setValue } =
    useDataKaryawan(token);

  const handleFormSubmit = async (data: any) => {
    const result = (await onSubmit(data)) as SubmitResult; // Explicitly cast to SubmitResult
    console.log(result);
    if (result.success) {
      onClose();
    }
  };

  const handleRoleChange = (value: EmployeeStatus) => {
    setValue("employmentStatus", value);
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
          <div className="w-full">
            <Select
              label="Status"
              onChange={(value) => handleRoleChange(value as EmployeeStatus)}
            >
              {Object.values(EmployeeStatus).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
            {errors.role && (
              <span className="text-red-500 text-sm">
                {errors.role?.message}
              </span>
            )}
          </div>
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
