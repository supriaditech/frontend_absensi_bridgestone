import { useState } from "react";
import { toast } from "react-toastify";
import Api from "../service/Api";

interface CheckOutResult {
  success: boolean;
  message?: string;
}

const useCheckOut = (token: string) => {
  const [loading, setLoading] = useState(false);

  const checkOut = async (userId: number): Promise<CheckOutResult> => {
    setLoading(true);
    try {
      const api = new Api();
      api.url = "/attendance/checkout";
      api.auth = true;
      api.token = token;
      api.body = { userId };

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success("Check-out successful!", { autoClose: 3000 });
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

  return { checkOut, loading };
};

export { useCheckOut };
