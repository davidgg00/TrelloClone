import api from "./axios";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async (loginData: LoginData) => {
  try {
    const response = await api.post(`/users/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw new Error("Login failed");
  }
};

export const validToken = async (token: string) => {
  try {
    const response = await api.post(`/users/checkToken`, { token });
    return response.data;
  } catch (error) {
    console.error("Token validation failed", error);
    throw new Error("Token validation failed");
  }
};

export const register = async (registerData: RegisterData) => {
  try {
    const response = await api.post(`/users`, registerData);
    return response.status;
  } catch (error) {
    console.error("Register failed", error);
    throw new Error("Register failed");
  }
}
