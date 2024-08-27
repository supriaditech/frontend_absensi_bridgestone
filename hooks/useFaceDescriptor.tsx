import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";

interface SubmitResult {
  success: boolean;
  message?: string; // optional message property
}

const useFaceDescriptor = (token: string) => {
  const [loading, setLoading] = useState(false);

  const saveFaceDescriptor = async (
    userId: number,
    descriptor: Float32Array
  ): Promise<SubmitResult> => {
    setLoading(true);
    try {
      const api = new Api();
      api.url = "/user/update-face-descriptor";
      api.auth = true;
      api.token = token;
      api.body = {
        userId,
        descriptor: JSON.stringify(descriptor), // Mengirimkan deskriptor dalam format JSON
      };

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success("Deskriptor wajah berhasil disimpan!", {
          autoClose: 3000,
        });
        return { success: true };
      } else {
        throw new Error(response.message || "Gagal menyimpan deskriptor wajah");
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat menyimpan deskriptor wajah.", {
        autoClose: 3000,
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    saveFaceDescriptor,
    loading,
    setLoading,
  };
};

export { useFaceDescriptor };
