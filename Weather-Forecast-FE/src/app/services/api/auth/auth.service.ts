import { User, RegisterData } from "../../../types/auth";
import { STORAGE_KEYS } from "../../../utils/constants";
import { storage } from "../../../utils/localStorage";
import api from "../../api";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  result: T;
  errorCode?: number;
}

export interface LoginResponse {
  userId: number;
  userName: string;
  fullName: string;
  email: string;
  avatar: string;
  currentCityId: number | null;
  currentCity: string;
  language: string;
  measurementType: string;
  timezone: string;
}

const COOKIE_AUTH_TOKEN = "cookie-authenticated";

const mapLoginResponseToUser = (loginUser: LoginResponse): User => ({
  id: String(loginUser.userId),
  email: loginUser.email,
  fullname: loginUser.fullName,
  username: loginUser.userName,
  currentCityId: loginUser.currentCityId,
  currentCity: loginUser.currentCity,
  phone: "",
  address: "",
  avatar: loginUser.avatar,
  createdAt: new Date().toISOString(),
});

const createUser = async (data: RegisterData) => {
  const payload = {
    username: data.username,
    fullName: data.fullName,
    password: data.password,
  };

  try {
    await api.post<ApiResponse<unknown>>("/user/create", payload);
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      throw error;
    }
    await api.post<ApiResponse<unknown>>("/user", payload);
  }
};

// Real API authentication service
export const authService = {
  login: async (credentials: {
    username: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      username: credentials.username,
      password: credentials.password,
    });

    if (response.data.result) {
      return {
        user: mapLoginResponseToUser(response.data.result),
        token: COOKIE_AUTH_TOKEN,
      };
    }

    throw new Error("Invalid response from server");
  },

  register: async (
    data: RegisterData,
  ): Promise<{ user: User; token: string }> => {
    await createUser(data);

    return authService.login({
      username: data.username,
      password: data.password,
    });
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
    }
  },

  getCurrentUser: (): User | null => {
    return storage.get<User>(STORAGE_KEYS.USER_DATA);
  },

  getToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  refreshToken: async (): Promise<void> => {
    try {
      const response = await api.post<ApiResponse<null>>("/auth/refresh");
      if (response.status === 200) {
        // Token updated in cookies
        return;
      }
    } catch (error) {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
      throw error;
    }
  },

  getCurrentUserFromApi: async (): Promise<User | null> => {
    try {
      const response = await api.get<ApiResponse<LoginResponse>>("/auth/me");
      if (response.data.result) {
        const loginUser = response.data.result;
        return {
          id: String(loginUser.userId ?? ""),
          email: loginUser.email || "",
          fullname: loginUser.fullName || "",
          username: loginUser.userName,
          currentCityId: loginUser.currentCityId,
          currentCity: loginUser.currentCity,
          phone: "",
          address: "",
          avatar: loginUser.avatar,
          createdAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
    return null;
  },
};
