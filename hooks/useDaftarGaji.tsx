import useSWR from "swr";
import Api from "../service/Api"; // Pastikan path ini sesuai dengan struktur proyek Anda

// Fetcher function
const fetcher = async (url: string, token: string, userId: number) => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.body = {};
  api.token = token;
  return api.call();
};

export const useDaftarGaji = (token: string, userId: number) => {
  const { data, error, mutate } = useSWR(
    token && userId ? ["/salary/all", token, userId] : null,
    ([url, token, userId]) => fetcher(url, token, userId)
  );

  return {
    gajiData: data?.data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
