import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, Option, Button, Input } from "@material-tailwind/react";
import { useLeaveForm } from "../../../hooks/useLeaveForm";
import TablePemhonanIzin from "./table/TablePemhonanIzin";
import { useSession } from "next-auth/react";

interface FormIzinProps {
  token: string;
  userId: number;
}

function FormIzin({ token, userId }: FormIzinProps) {
  const { data: session } = useSession() as any;
  const { handleSubmit, control } = useForm();
  const { submitLeaveForm, loading } = useLeaveForm(token, userId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("document", selectedFile); // Menggunakan file yang dipilih
    }

    formData.append("date", data.date);
    formData.append("type", data.type);
    formData.append("durationDays", data.durationDays);
    formData.append("reason", data.reason);

    const result = await submitLeaveForm(formData); // Mengirim formData ke API
    if (result.success) {
      // Handle successful submission (e.g., clear form, redirect, etc.)
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Mengatur tanggal default ke hari ini dengan waktu 08:00
  const defaultDate = new Date().toISOString().substring(0, 10) + "T08:00";

  return (
    <div>
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
                  accept="application/pdf"
                  label="Surat Izin"
                  onChange={(e) => {
                    handleFileChange(e);
                    field.onChange(e.target.files); // Meng-update field form
                  }}
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
      <TablePemhonanIzin token={token} userId={session?.user?.id} />
    </div>
  );
}

export default FormIzin;
