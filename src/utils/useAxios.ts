import axios from "axios";
import type { Method } from "axios";

interface FetchDataProps {
  url: string;
  method: Method;
  data?: Record<string, unknown> | null;
}

export const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const FetchData = async <T = unknown>({
    url,
    method,
    data = null,
  }: FetchDataProps): Promise<T> => {
    try {
      const config: any = {
        url,
        method,
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status: number) => status >= 200 && status < 500,
      };

      //only attach data for methods that accept a body (and if data is not null)
      if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && data !== null) {
        config.data = data;
      }

      const response = await axiosInstance(config);

      if (response.status === 204 || !response.data) {
        return {} as T;
      }

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`API ${method} ${url} failed:`, error.response?.data || error);
      } else {
        console.error(`API ${method} ${url} failed:`, error);
      }
      throw error;
    }
  };

  return { FetchData };
};
