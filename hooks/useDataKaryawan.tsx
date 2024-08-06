import useSWR, { SWRResponse } from "swr";
import Api from "../service/Api";
import { ApiResponse } from "../types/dataKaryawanType";

// Definisi interface di atas disini

// Fetcher function
const fetcher = async (url: string, token: string): Promise<ApiResponse> => {
  const api = new Api();
  api.url = url;
  api.auth = true;
  api.token = token;
  const data = await api.call();
  console.log(data);
  return data;
};

// Hook useDataKaryawan
const useDataKaryawan = (token: string) => {
  console.log("========", token);
  const { data, error, mutate }: SWRResponse<ApiResponse, Error> = useSWR<
    ApiResponse,
    Error
  >(["/user/all", token], fetcher.bind(null, "/user/all", token));
  console.log("data", data);
  return {
    dataKaryawan: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export { useDataKaryawan };
