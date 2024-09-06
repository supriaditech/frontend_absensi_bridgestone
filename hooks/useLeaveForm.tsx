import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";
import useSWR from "swr";

const fetcher = async (url: string, token: string, userId: number) => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.token = token;
  return api.call();
};

const useLeaveForm = (token: any, userId: number) => {
  const [loading, setLoading] = useState(false);

  // Fetch data untuk user tertentu
  const {
    data,
    error,
    mutate: mutateUser,
  } = useSWR(
    token && userId ? ["/leave/user", token, userId] : null,
    ([url, token, userId]) => fetcher(url, token, userId)
  );

  // Fetch data untuk semua user
  const {
    data: dataAllUser,
    error: errorAllUser,
    mutate: mutateAllUser,
  } = useSWR(
    token && userId ? ["/leave/all", token, userId] : null,
    ([url, token, userId]) => fetcher(url, token, userId)
  );

  const submitLeaveForm = async (formData: FormData) => {
    setLoading(true);
    try {
      const api = new Api();
      api.url = "/leave/apply";
      api.auth = true;
      api.token = token;
      api.type = "multipart"; // Set type ke "multipart" untuk FormData
      api.body = formData;

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success(
          "Izin berhasil diajukan! Silahkan cek izin anda di setujui atau tidak",
          { autoClose: 3000 }
        );
        mutateUser();
        mutateAllUser(); // Mutasi untuk semua user
        return { success: true };
      } else {
        throw new Error(response.meta.message || "Gagal mengajukan izin");
      }
    } catch (error: any) {
      toast.error(
        "Terjadi kesalahan saat mengajukan izin, Silahkan cek apakah izin sudah pernah dibuat di tanggal ini",
        {
          autoClose: 3000,
        }
      );
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitLeaveForm,
    loading,
    leaveDataUser: data?.data ?? [],
    leaveDataAllUser: dataAllUser?.data ?? [], // Data untuk semua user
    isLoadingUser: !error && !data,
    isLoadingAllUser: !errorAllUser && !dataAllUser,
    isErrorUser: error,
    isErrorAllUser: errorAllUser,
    mutateUser,
    mutateAllUser,
  };
};

export { useLeaveForm };
