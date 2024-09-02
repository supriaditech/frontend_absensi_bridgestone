import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, Option, Button, Input } from "@material-tailwind/react";
import { useLeaveForm } from "../../../hooks/useLeaveForm";

function FormIzin({ token }: { token: string }) {
  const { handleSubmit, control } = useForm();
  const { submitLeaveForm, loading } = useLeaveForm(token);

  const onSubmit = async (data: any) => {
    console.log(data);
    const result = await submitLeaveForm(data);
    if (result.success) {
      // Handle successful submission (e.g., clear form, redirect, etc.)
    }
  };

  // Mengatur tanggal default ke hari ini dengan waktu 08:00
  const defaultDate = new Date().toISOString().substring(0, 10) + "T08:00";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" lg:px-20">
      <div className="grid grid-cols-3 gap-8">
        <div>
          <Controller
            name="type"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Pilih Jenis Izin">
                <Option value="Sakit">Sakit</Option>
                <Option value="Izin">Tidak Hadir</Option>
              </Select>
            )}
          />
        </div>

        <div>
          <Controller
            name="date"
            control={control}
            defaultValue={defaultDate} // Default waktu diatur ke 08:00 pagi
            render={({ field }) => (
              <Input
                crossOrigin={undefined}
                type="datetime-local"
                {...field}
                label="Select date"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="durationDays"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                crossOrigin={undefined}
                type="number"
                {...field}
                label="Jumlah Hari Izin"
              />
            )}
          />
        </div>

        <div className="col-span-2">
          <Controller
            name="reason"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                crossOrigin={undefined}
                type="text"
                {...field}
                label="Alasan Izin"
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="document"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <Input
                crossOrigin={undefined}
                type="file"
                {...field}
                accept="application/pdf"
                label="Surat Izin"
              />
            )}
          />
        </div>
      </div>
      <div className="w-full flex justify-end mt-4">
        <Button type="submit" color="blue" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default FormIzin;
