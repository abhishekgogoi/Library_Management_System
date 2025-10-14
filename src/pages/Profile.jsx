import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileImage } from "../store/slices/profileSlice";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  Upload,
  BookOpen,
  TrendingUp,
  Heart,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profileImage = useSelector((state) => state.profile.profileImage);
  const rentals = useSelector((state) => state.rentals.rentals);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setSelectedFile(file);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (previewImage) {
      dispatch(updateProfileImage(previewImage));
      toast.success("Profile picture updated successfully!");
      setPreviewImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalRentals = rentals.length;
  const activeRentals = rentals.filter((r) => !r.returned).length;
  const completedRentals = rentals.filter((r) => r.returned).length;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="profile-page">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-800 mb-2">
            Profile
          </h1>
          <p className="text-slate-600">
            Manage your account information and view statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-slate-800">
                Profile Picture
              </CardTitle>
              <CardDescription>Update your profile image</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {/* Current or Preview Image */}
              <div className="relative">
                <Avatar className="h-32 w-32" data-testid="profile-avatar">
                  <AvatarImage
                    src={previewImage || profileImage}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-slate-200 text-slate-700 text-3xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {previewImage && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <Upload className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Preview Info */}
              {previewImage && selectedFile && (
                <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Preview</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}{" "}
                    KB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                data-testid="image-upload-input"
              />

              {/* Action Buttons */}
              {previewImage ? (
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={handleSaveImage}
                    className="flex-1 bg-slate-800 hover:bg-slate-700"
                    data-testid="save-image-button"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelPreview}
                    variant="outline"
                    className="flex-1 border-slate-300 hover:bg-slate-100"
                    data-testid="cancel-preview-button"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-100"
                  data-testid="upload-image-button"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              )}

              <p className="text-xs text-slate-500 text-center">
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </CardContent>
          </Card>

          {/* User Information Card */}
          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-slate-800">
                User Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p
                        className="font-medium text-slate-800"
                        data-testid="profile-name"
                      >
                        {user?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p
                        className="font-medium text-slate-800"
                        data-testid="profile-email"
                      >
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-800">
                        {user?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Website</p>
                      <p className="font-medium text-slate-800">
                        {user?.website}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Company</p>
                      <p className="font-medium text-slate-800">
                        {user?.company?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Username</p>
                      <p className="font-medium text-slate-800">
                        {user?.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Card */}
        <Card className="mt-6 border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-slate-800">
              Rental Statistics
            </CardTitle>
            <CardDescription>Your library activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p
                    className="text-2xl font-semibold text-slate-800"
                    data-testid="total-rentals"
                  >
                    {totalRentals}
                  </p>
                  <p className="text-sm text-slate-600">Total Rentals</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p
                    className="text-2xl font-semibold text-slate-800"
                    data-testid="active-rentals"
                  >
                    {activeRentals}
                  </p>
                  <p className="text-sm text-slate-600">Active Rentals</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="p-3 bg-slate-200 rounded-full">
                  <BookOpen className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p
                    className="text-2xl font-semibold text-slate-800"
                    data-testid="completed-rentals"
                  >
                    {completedRentals}
                  </p>
                  <p className="text-sm text-slate-600">Completed</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p
                    className="text-2xl font-semibold text-slate-800"
                    data-testid="wishlist-count"
                  >
                    {wishlist.length}
                  </p>
                  <p className="text-sm text-slate-600">Wishlist</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental History */}
        {rentals.length > 0 && (
          <Card className="mt-6 border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-slate-800">
                Recent Rental History
              </CardTitle>
              <CardDescription>Your last 5 rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rentals
                  .slice(-5)
                  .reverse()
                  .map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      data-testid={`rental-history-${rental.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-800 text-sm">
                            {rental.bookTitle}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(
                              rental.rentalStartTime
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          rental.returned
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {rental.returned ? "Returned" : "Active"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
