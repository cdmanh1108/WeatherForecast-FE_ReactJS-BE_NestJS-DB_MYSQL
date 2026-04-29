import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  AuthContextType,
  LoginCredentials,
  RegisterData,
} from "../types/auth";
import { authService } from "../services/api/auth/auth.service";
import { storage } from "../utils/localStorage";
import { STORAGE_KEYS } from "../utils/constants";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { userService } from "../services/api/user/user.service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Error code to i18n key mapping
const ERROR_CODE_MAP: { [key: number]: string } = {
  1000: "auth.invalidUsername",
  1001: "auth.invalidPassword",
  1002: "auth.unauthorized",
  1003: "auth.tokenExpired",
  1004: "auth.tokenInvalid",
  2000: "auth.userAlreadyExists",
  2001: "auth.userNotFound",
  2002: "auth.invalidEmail",
  2003: "auth.passwordTooShort",
};

const getErrorMessage = (error: any, t: any): string => {
  // Check if error is from API with error code
  if (error?.response?.data?.errorCode) {
    const i18nKey = ERROR_CODE_MAP[error.response.data.errorCode];
    if (i18nKey) {
      return t(i18nKey);
    }
  }

  // Check for message in response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Fallback to error message
  if (error instanceof Error) {
    return error.message;
  }

  return t("common.error");
};

const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = storage.get<User>(STORAGE_KEYS.USER_DATA);
      const savedToken = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);

      if (savedUser && savedToken) {
        setUser(savedUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const userFromCookieSession = await authService.getCurrentUserFromApi();
      if (userFromCookieSession) {
        storage.set(STORAGE_KEYS.USER_DATA, userFromCookieSession);
        storage.set(STORAGE_KEYS.AUTH_TOKEN, "cookie-authenticated");
        setUser(userFromCookieSession);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    void initializeAuth();
  }, []);

  const syncCurrentCityFromBrowserLocation = async (baseUser: User) => {
    try {
      const position = await getCurrentPosition();
      const updatedProfile = await userService.updateCurrentCityByCoordinates(
        position.coords.latitude,
        position.coords.longitude,
      );

      const userWithCity = {
        ...baseUser,
        currentCityId: updatedProfile.currentCityId,
        currentCity: updatedProfile.currentCity,
      };

      storage.set(STORAGE_KEYS.USER_DATA, userWithCity);
      setUser(userWithCity);
    } catch (locationError) {
      console.warn(
        "Unable to sync current city from browser location",
        locationError,
      );
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user, token } = await authService.login(credentials);

      storage.set(STORAGE_KEYS.USER_DATA, user);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token);

      setUser(user);
      setIsAuthenticated(true);
      void syncCurrentCityFromBrowserLocation(user);

      toast.success(t("auth.loginSuccess"));
    } catch (error) {
      const errorMessage = getErrorMessage(error, t);
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { user, token } = await authService.register(data);

      storage.set(STORAGE_KEYS.USER_DATA, user);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token);

      setUser(user);
      setIsAuthenticated(true);

      toast.success(t("auth.registerSuccess"));
    } catch (error) {
      const errorMessage = getErrorMessage(error, t);
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.info(t("auth.logoutSuccess"));
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    storage.set(STORAGE_KEYS.USER_DATA, updatedUser);
    setUser(updatedUser);

    toast.success(t("common.updateSuccess"));
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
