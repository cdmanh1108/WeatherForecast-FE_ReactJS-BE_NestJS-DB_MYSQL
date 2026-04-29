import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { ConfirmDialog } from "../components/dialog/ConfirmDialog";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Camera,
  LogOut,
  Loader2,
} from "lucide-react";
import { formatDate } from "../utils/formatters";
import { userService } from "../services/api/user/user.service";
import { cityService } from "../services/api/city/city.service";
import { toast } from "sonner";
import { ROUTES } from "../utils/constants";

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { t, language } = useLanguage();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    fullname: user?.fullname || "",
  });

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarPreviewObjectUrl, setAvatarPreviewObjectUrl] = useState<
    string | null
  >(null);
  const [currentCityName, setCurrentCityName] = useState(
    user?.currentCity || "Not set",
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    setEditForm({ fullname: user.fullname });

    if (!avatarPreviewObjectUrl) {
      setAvatarPreview(user.avatar || "");
    }
  }, [user, avatarPreviewObjectUrl]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    const loadCurrentCity = async () => {
      if (!user.currentCityId) {
        setCurrentCityName(user.currentCity || "Not set");
        return;
      }

      try {
        const city = await cityService.getCityById(user.currentCityId);
        if (!isCancelled) {
          setCurrentCityName(city.name);
        }
      } catch (error) {
        console.error("Error loading current city:", error);
        if (!isCancelled) {
          setCurrentCityName(user.currentCity || "Not set");
        }
      }
    };

    void loadCurrentCity();

    return () => {
      isCancelled = true;
    };
  }, [user?.currentCityId, user?.currentCity]);

  useEffect(() => {
    return () => {
      if (avatarPreviewObjectUrl) {
        URL.revokeObjectURL(avatarPreviewObjectUrl);
      }
    };
  }, [avatarPreviewObjectUrl]);

  if (!user) return null;

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      if (editForm.fullname !== user.fullname) {
        await userService.updateFullname(editForm.fullname);
      }
      updateProfile({ fullname: editForm.fullname });
      setIsEditingProfile(false);
      toast.success(t("common.updateSuccess"));
    } catch (error) {
      toast.error(t("profile.updateError") || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ fullname: user.fullname });
    setIsEditingProfile(false);
  };

  const handleAvatarFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (avatarPreviewObjectUrl) {
      URL.revokeObjectURL(avatarPreviewObjectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreviewObjectUrl(objectUrl);
    setSelectedAvatarFile(file);
    setAvatarPreview(objectUrl);
  };

  const handleConfirmAvatar = async () => {
    if (!selectedAvatarFile) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedProfile = await userService.updateAvatar(selectedAvatarFile);
      const updatedAvatar = updatedProfile.avatar || user.avatar || "";

      updateProfile({ avatar: updatedAvatar });
      setAvatarPreview(updatedAvatar);
      setIsChangingAvatar(false);
      setSelectedAvatarFile(null);

      if (avatarPreviewObjectUrl) {
        URL.revokeObjectURL(avatarPreviewObjectUrl);
        setAvatarPreviewObjectUrl(null);
      }

      toast.success(t("common.updateSuccess"));
    } catch (error) {
      toast.error(t("profile.updateError") || "Failed to update avatar");
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAvatar = () => {
    if (avatarPreviewObjectUrl) {
      URL.revokeObjectURL(avatarPreviewObjectUrl);
      setAvatarPreviewObjectUrl(null);
    }

    setAvatarPreview(user.avatar || "");
    setSelectedAvatarFile(null);
    setIsChangingAvatar(false);
  };

  const confirmLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("profile.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 mb-8">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={
                    avatarPreview ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt={user.fullname}
                />
                <AvatarFallback className="text-4xl">
                  {user.fullname}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingAvatar(true)}
                disabled={isLoading}
              >
                <Camera className="mr-2 h-4 w-4" />
                {t("profile.changeAvatar")}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-end">
                {!isEditingProfile ? (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    disabled={isLoading}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t("profile.editProfile")}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                    >
                      {t("profile.cancel")}
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t("profile.save")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">{t("auth.fullname")}</Label>
                  {isEditingProfile ? (
                    <Input
                      id="fullname"
                      value={editForm.fullname}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          fullname: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.fullname}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">{t("auth.username")}</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.username}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t("profile.address")}</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{currentCityName || "Not set"}</span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>{t("profile.memberSince")}</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(user.createdAt, language)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button
                  variant="destructive"
                  onClick={() => setShowLogoutDialog(true)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav.logout")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isChangingAvatar} onOpenChange={setIsChangingAvatar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.changeAvatar")}</DialogTitle>
            <DialogDescription>
              Choose an image from your device to update avatar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatarFile">Avatar image</Label>
              <Input
                id="avatarFile"
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                disabled={isLoading}
              />
            </div>

            {avatarPreview && (
              <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <p className="text-sm font-medium">
                  {t("profile.avatarPreview")}
                </p>
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} alt="Preview" />
                  <AvatarFallback>{user.fullname}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelAvatar}
              disabled={isLoading}
            >
              {t("profile.cancel")}
            </Button>
            <Button
              onClick={handleConfirmAvatar}
              disabled={!selectedAvatarFile || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("profile.confirmChange")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title={t("nav.logout")}
        description="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        variant="destructive"
      />
    </div>
  );
};
