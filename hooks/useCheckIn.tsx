import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";

interface CheckInResult {
  success: boolean;
  message?: string;
}

const useCheckIn = (token: string) => {
  const [loading, setLoading] = useState(false);

  const checkIn = async (
    userId: number,
    latitude: number,
    longitude: number,
    faceDescriptor: Float32Array
  ): Promise<CheckInResult> => {
    const test = JSON.stringify(Array.from(faceDescriptor));
    console.log(test);
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
      console.log(response);
      if (response.meta.statusCode === 200) {
        toast.success("Check-in successful!", { autoClose: 3000 });
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

  return { checkIn, loading, setLoading };
};

export { useCheckIn };
