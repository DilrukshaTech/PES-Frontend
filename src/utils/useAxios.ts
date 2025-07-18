// src/hooks/useAxios.ts
import axios from "axios";
import type { Method } from "axios";

interface FetchDataProps {
  url: string;
  method: Method;
  data?: Record<string, unknown> | null;
}

export const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
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
      const response = await axiosInstance({
        url,
        method,
        data,
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`API ${method} ${url} failed:`, error.response || error);
      } else {
        console.error(`API ${method} ${url} failed:`, error);
      }
      throw error;
    }
  };

  return { FetchData };
};
