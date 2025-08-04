import { api } from "./api";
import { AxiosError } from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    return response;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(String(error));
  }
};
