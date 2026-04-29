import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGUAGE } from "../utils/constants";

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: "Dashboard",
        map: "Map",
        profile: "Profile",
        alerts: "Alerts",
        favorites: "Favorites",
        logout: "Logout",
      },
      // Auth
      auth: {
        login: "Login",
        register: "Register",
        email: "Email",
        password: "Password",
        fullname: "Full Name",
        username: "Username",
        rememberMe: "Remember Me",
        forgotPassword: "Forgot Password?",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        signUp: "Sign Up",
        signIn: "Sign In",
        emailRequired: "Email is required",
        passwordRequired: "Password is required",
        usernameRequired: "Username is required",
        invalidEmail: "Invalid email address",
        loginSuccess: "Login successful",
        registerSuccess: "Registration successful",
        loginError: "Invalid email or password",
        registerError: "Registration failed",
        invalidUsername: "Invalid username",
        invalidPassword: "Invalid password",
        unauthorized: "Unauthorized",
        tokenExpired: "Token expired",
        tokenInvalid: "Token invalid",
        userAlreadyExists: "User already exists",
        userNotFound: "User not found",
        passwordTooShort: "Password must be at least 6 characters",
        logoutSuccess: "Logged out successfully",
      },
      // Dashboard
      dashboard: {
        searchCity: "Search city...",
        currentWeather: "Current Weather",
        feelsLike: "Feels Like",
        humidity: "Humidity",
        pressure: "Pressure",
        windSpeed: "Wind Speed",
        uvIndex: "UV Index",
        visibility: "Visibility",
        cloudCoverage: "Cloud Coverage",
        lastUpdated: "Last Updated",
        hourlyForecast: "Hourly Forecast",
        dailyForecast: "Daily Forecast",
        weatherHistory: "Weather History",
        temperature: "Temperature",
        selectCity: "Select a city to view weather",
      },
      // Profile
      profile: {
        title: "Profile",
        editProfile: "Edit Profile",
        changeAvatar: "Change Avatar",
        save: "Save",
        cancel: "Cancel",
        phone: "Phone",
        address: "Address",
        memberSince: "Member Since",
        updateSuccess: "Profile updated successfully",
        updateError: "Failed to update profile",
        avatarPreview: "Avatar Preview",
        confirmChange: "Confirm Change",
      },
      // Alerts
      alerts: {
        title: "Weather Alerts",
        createAlert: "Create Alert",
        alertHistory: "Alert History",
        noAlerts: "No alerts configured",
        deleteConfirm: "Are you sure you want to delete this alert?",
        deleteSuccess: "Alert deleted successfully",
        createSuccess: "Alert created successfully",
        city: "City",
        condition: "Condition",
        value: "Value",
        active: "Active",
        inactive: "Inactive",
        notifications: "Notifications",
        markAsRead: "Mark as Read",
        markAsUnread: "Mark as Unread",
        noNotifications: "No notifications",
      },
      // Favorites
      favorites: {
        title: "Favorite Cities",
        addCity: "Add City",
        removeConfirm: "Remove this city from favorites?",
        removeSuccess: "City removed from favorites",
        addSuccess: "City added to favorites",
        noCities: "No favorite cities yet",
        viewWeather: "View Weather",
      },
      // Common
      common: {
        yes: "Yes",
        no: "No",
        confirm: "Confirm",
        close: "Close",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        warning: "Warning",
        info: "Info",
        theme: "Theme",
        language: "Language",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        updateSuccess: "Updated successfully",
      },
      // Weather conditions
      weather: {
        clear: "Clear",
        clouds: "Cloudy",
        rain: "Rain",
        drizzle: "Drizzle",
        thunderstorm: "Thunderstorm",
        snow: "Snow",
        mist: "Mist",
        fog: "Fog",
        haze: "Haze",
      },
    },
  },
};

const savedLanguage = LANGUAGE.EN;

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: LANGUAGE.EN,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
