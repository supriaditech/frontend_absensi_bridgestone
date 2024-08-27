import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";

interface AreaData {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export const useArea = (token: string) => {
  const [loading, setLoading] = useState(false);

  const upsertArea = async (data: AreaData) => {
    setLoading(true);
    try {
      const api = new Api();
      api.url = "/area/upsert";
      api.auth = true;
      api.token = token;
      api.body = data;

      const response = await api.call();
      if (
        response.meta.statusCode === 200 ||
        response.meta.statusCode === 201
      ) {
        toast.success("Area berhasil disimpan!", { autoClose: 3000 });
        return { success: true };
      } else {
        throw new Error(response.message || "Gagal menyimpan area");
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat menyimpan area.", {
        autoClose: 3000,
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { upsertArea, loading };
};
