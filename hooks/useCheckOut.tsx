import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";
import useSWR from "swr";

interface CheckOutResult {
  success: boolean;
  message?: string;
}

const fetcher = async (url: string, token: string) => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.token = token;
  const data = await api.call();
  return data;
};

const useCheckOut = (token: string) => {
  const [loading, setLoading] = useState(false);

  // Menggunakan SWR untuk memeriksa status check-in
  const { data, error, mutate } = useSWR(
    token ? ["/attendance/hasCheckedOut", token] : null,
    () => fetcher("/attendance/hasCheckedOut", token)
  );

  const hasCheckedOut = data?.data?.hasCheckedOut || false;
  const statusLoading = !data && !error;
  const checkOut = async (
    userId: number,
    latitude: number,
    longitude: number,
    faceDescriptor: Float32Array
  ): Promise<CheckOutResult> => {
    const test = JSON.stringify(Array.from(faceDescriptor));
    setLoading(true);
    try {
      const api = new Api();
      api.url = "/attendance/checkout";
      api.auth = true;
      api.token = token;
      api.body = {
        userId,
        latitude,
        longitude,
        faceDescriptor: JSON.stringify(Array.from(faceDescriptor)),
      };

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success("Check-out successful!", { autoClose: 3000 });
        mutate();
        return { success: true };
      } else {
        throw new Error(response.meta.message || "Failed to check out");
      }
    } catch (error: any) {
      toast.error("An error occurred during check-out. Please try again.", {
        autoClose: 3000,
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { checkOut, loading, setLoading, statusLoading, hasCheckedOut };
};

export { useCheckOut };
