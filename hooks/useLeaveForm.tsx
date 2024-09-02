import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";
import useSWR from "swr";
import { log } from "console";

const fetcher = async (url: string, token: string, userId: number) => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  //   api.body = {
  //     userId: userId, // Masukkan userId di sini
  //   };
  api.token = token;
  return api.call();
};

const useLeaveForm = (token: any, userId: number) => {
  const [loading, setLoading] = useState(false);

  const { data, error, mutate } = useSWR(
    token && userId ? ["/leave/user", token, userId] : null,
    ([url, token, userId]) => fetcher(url, token, userId)
  );

  const submitLeaveForm = async (data: any) => {
    const formData = new FormData();

    formData.append("document", data.document[0]); // Assume document is a file input
    formData.append("date", data.date);
    formData.append("type", data.type);
    formData.append("durationDays", data.durationDays);
    formData.append("reason", data.reason);

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
          "Izin berhasil diajukan! Silahkan cek izin anda di setujui atau tidak ",
          { autoClose: 3000 }
        );
        return { success: true };
      } else {
        throw new Error(response.meta.message || "Gagal mengajukan izin");
      }
    } catch (error: any) {
      toast.error(
        "Terjadi kesalahan saat mengajukan izin, Silahkan cek apakah izin sudah pernah di buat di tanggal ini",
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
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export { useLeaveForm };
