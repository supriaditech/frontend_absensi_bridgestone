import useSWR from "swr";
import Api from "../service/Api"; // Pastikan path ini sesuai dengan struktur proyek Anda

// Fetcher function
const fetcher = async (url: string, token: string, userId: number) => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.body = {
    userId: userId, // Masukkan userId di sini
  };
  api.token = token;
  return api.call();
};

export const useAbsensiKaryawan = (token: string, userId: number) => {
  console.log(userId);
  const { data, error, mutate } = useSWR(
    token && userId ? ["/attendance/user", token, userId] : null,
    ([url, token, userId]) => fetcher(url, token, userId)
  );

  return {
    absensiData: data?.data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
