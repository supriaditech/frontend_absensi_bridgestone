import useSWR from "swr";
import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";

// Fetcher function
const fetcher = async (url: string, token: string) => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.token = token;
  const data = await api.call();
  return data;
};

interface CheckInResult {
  success: boolean;
  message?: string; // optional message property
}

const useCheckIn = (token: string) => {
  const [loading, setLoading] = useState(false);

  // Menggunakan SWR untuk memeriksa status check-in
  const { data, error, mutate } = useSWR(
    token ? ["/attendance/hasCheckedIn", token] : null,
    () => fetcher("/attendance/hasCheckedIn", token)
  );

  const hasCheckedIn = data?.data?.hasCheckedIn || false;
  const statusLoading = !data && !error;

  const checkIn = async (
    userId: number,
    latitude: number,
    longitude: number,
    faceDescriptor: Float32Array
  ): Promise<CheckInResult> => {
    setLoading(true);
    try {
      const api = new Api();
      api.url = "/attendance/checkin";
      api.auth = true;
      api.token = token;
      api.body = {
        userId,
        latitude,
        longitude,
        faceDescriptor: JSON.stringify(Array.from(faceDescriptor)), // Mengirim deskriptor sebagai array
      };

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success("Check-in successful!", { autoClose: 3000 });
        mutate(); // Mutasi data untuk memastikan status check-in diperbarui
        return { success: true };
      } else {
        throw new Error(response.meta.message || "Failed to check in");
      }
    } catch (error: any) {
      toast.error("An error occurred during check-in. Please try again.", {
        autoClose: 3000,
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { checkIn, loading, hasCheckedIn, statusLoading, setLoading };
};

export { useCheckIn };
