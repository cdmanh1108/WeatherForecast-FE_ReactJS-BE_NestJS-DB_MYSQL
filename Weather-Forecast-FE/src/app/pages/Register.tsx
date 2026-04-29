import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Cloud,
  Lock,
  User,
  UserCircle,
  Moon,
  Sun,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ROUTES } from "../utils/constants";
import { validators } from "../utils/validators";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    password: "",
    fullName: "",
    username: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    const validation = validators.password(password);
    setPasswordValidation(validation.errors);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.password)) {
      newErrors.password = t("auth.passwordRequired");
    } else {
      const passwordCheck = validators.password(formData.password);
      if (!passwordCheck.isValid) {
        newErrors.password = "Password does not meet requirements";
      }
    }

    if (!validators.required(formData.fullName)) {
      newErrors.fullName = "Full name is required";
    }

    if (!validators.required(formData.username)) {
      newErrors.username = "Username is required";
    } else if (!validators.username(formData.username)) {
      newErrors.username =
        "Username must be at least 3 characters (letters, numbers, underscore only)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // Error is handled in AuthContext with toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Theme and Language Controls */}
      <div className="fixed top-4 right-4 flex gap-2">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        {/* <Button 
          variant="outline" 
          size="icon"
          onClick={() => setLanguage(language === LANGUAGE.EN ? LANGUAGE.VI : LANGUAGE.EN)}
        >
          <Globe className="h-5 w-5" />
        </Button> */}
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Cloud className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">WeatherApp</CardTitle>
            <CardDescription className="text-base mt-2">
              {t("auth.register")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("auth.fullname")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">{t("auth.username")}</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className="pl-10"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}

              {/* Password Validation Feedback */}
              {formData.password && (
                <div className="space-y-1 mt-2 p-3 bg-muted rounded-md">
                  <p className="text-xs font-medium mb-2">
                    Password requirements:
                  </p>
                  {[
                    {
                      text: "At least 8 characters",
                      valid: formData.password.length >= 8,
                    },
                    {
                      text: "One uppercase letter",
                      valid: /[A-Z]/.test(formData.password),
                    },
                    {
                      text: "One lowercase letter",
                      valid: /[a-z]/.test(formData.password),
                    },
                    {
                      text: "One number",
                      valid: /[0-9]/.test(formData.password),
                    },
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {req.valid ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          req.valid ? "text-green-600" : "text-muted-foreground"
                        }
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("auth.signUp")
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {t("auth.haveAccount")}{" "}
              </span>
              <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
                {t("auth.signIn")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
