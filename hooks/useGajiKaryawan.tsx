import useSWR from "swr";
import Api from "../service/Api"; // Pastikan path ini sesuai dengan struktur proyek Anda

// Fetcher function
const fetcher = async (url: string, token: string) => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.body = {};
  api.token = token;
  return api.call();
};

export const useDaftarGajiKaryawan = (token: string) => {
  const { data, error, mutate } = useSWR(
    token ? ["/salary/user", token] : null,
    ([url, token]) => fetcher(url, token)
  );

  return {
    gajiData: data?.data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
