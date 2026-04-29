import api from "../../api";
import { ApiResponse } from "../common/api-response";

const getUserProfile = async () => {
  const response = await api.get<
    ApiResponse<{
      userId: string;
      userName: string;
      email: string;
      fullName: string;
      avatar?: string;
      phone?: string;
      address?: string;
    }>
  >("/user");

  if (response.data.result) {
    return response.data.result;
  }

  throw new Error("Failed to fetch user profile");
};

const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.patch<
    ApiResponse<{
      avatar: string;
      fullName?: string;
      userName?: string;
      currentCityId?: number | null;
      currentCity?: string;
    }>
  >("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.result) {
    return response.data.result;
  }

  throw new Error("Failed to update avatar");
};

const updateFullname = async (fullname: string) => {
  const response = await api.patch<
    ApiResponse<{
      fullName: string;
    }>
  >("/user/fullname", {
    fullname,
  });

  if (response.data.result) {
    return response.data.result;
  }

  throw new Error("Failed to update fullname");
};

const updateCurrentCityByCoordinates = async (
  latitude: number,
  longitude: number,
) => {
  const response = await api.patch<
    ApiResponse<{
      userId: number;
      userName: string;
      email: string;
      fullName: string;
      avatar?: string;
      currentCityId: number | null;
      currentCity: string;
      language: string;
      measurementType: string;
      timezone: string;
    }>
  >("/user/current-city/by-coordinates", {
    latitude,
    longitude,
  });

  if (response.data.result) {
    return response.data.result;
  }

  throw new Error("Failed to update current city");
};

export const userService = {
  getUserProfile,
  updateAvatar,
  updateFullname,
  updateCurrentCityByCoordinates,
};
