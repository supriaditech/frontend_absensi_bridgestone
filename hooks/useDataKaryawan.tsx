import useSWR, { SWRResponse } from "swr";
import Api from "../service/Api";
import {
  AddKaryawanData,
  ApiResponse,
  Karyawan,
} from "../types/dataKaryawanType";
import { useState } from "react";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";

// Fetcher function
const fetcher = async (url: string, token: string): Promise<ApiResponse> => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.token = token;
  const data = await api.call();
  return data;
};

// Hook useDataKaryawan
const useDataKaryawan = (token: string) => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(
    null
  );
  const [idKaryawan, setIdKaryawan] = useState<number>(0);
  console.log(idKaryawan);
  const { data, error, mutate }: SWRResponse<ApiResponse, Error> = useSWR<
    ApiResponse,
    Error
  >(["/user/all", token], fetcher.bind(null, "/user/all", token));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddKaryawanData>({
    defaultValues: {
      userId: "",
      password: "",
      name: "",
      dateOfBirth: "",
      employmentStartDate: "",
      phoneNumber: "",
      address: "",
      employmentStatus: "",
      role: "KARYAWAN",
    },
  });

  const [loading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<AddKaryawanData> = async (data) => {
    setIsLoading(true);
    try {
      const api = new Api();
      api.url = "/auth/register";
      api.auth = true;
      api.token = token;
      api.body = data;

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success("Karyawan berhasil ditambahkan!", { autoClose: 3000 });
        setOpenModal(false); // Close the modal only on success
        mutate(); // Refresh data
        return { success: true };
      } else {
        throw new Error(response.message || "Gagal menambahkan karyawan");
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat menambahkan karyawan.", {
        autoClose: 3000,
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const onEditSubmit: SubmitHandler<Karyawan> = async (data) => {
    setIsLoading(true);
    try {
      const api = new Api();
      api.url = "/user/update";
      api.auth = true;
      api.token = token;
      api.body = {
        ...data,
        dateOfBirth: dayjs(data.dateOfBirth).format("YYYY-MM-DDTHH:mm:ss.sssZ"),
      };

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success("Karyawan berhasil diperbarui!", { autoClose: 3000 });
        setOpenModalEdit(false); // Close the modal only on success
        mutate(); // Refresh data
        return { success: true };
      } else {
        throw new Error(response.message || "Gagal memperbarui karyawan");
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat memperbarui karyawan.", {
        autoClose: 3000,
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKaryawan = async (id: number) => {
    setIsLoading(false);
    try {
      const api = new Api();
      api.url = "/user/delete";
      api.auth = true;
      api.token = token;
      api.body = { id: id };
      const response = await api.call();
      console.log(response);
      console.log(api.body);
      if (response.meta.statusCode === 200) {
        toast.success("Karyawan berhasil dihapus!", { autoClose: 3000 });
        setOpenModalDelete(false); // Close the modal only on success
        mutate(); // Refresh data
        return { success: true };
      } else {
        throw new Error(response.message || "Gagal menghapus data karyawan");
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat menghapus data karyawan.", {
        autoClose: 3000,
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  return {
    dataKaryawan: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    openModal,
    setOpenModal,
    openModalEdit,
    setOpenModalEdit,
    selectedKaryawan,
    setSelectedKaryawan,
    register,
    handleSubmit,
    onSubmit,
    onEditSubmit,
    errors,
    loading,
    setIdKaryawan,
    openModalDelete,
    setOpenModalDelete,
    deleteKaryawan,
    idKaryawan,
  };
};

export { useDataKaryawan };
