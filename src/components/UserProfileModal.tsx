import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateUserDetails, getUserProfile } from "@/api/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function UserProfileModal({ open, onClose, userId }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    profile_image: "",
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const baseImageUrl = "http://localhost:5000/uploads/";

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      getUserProfile(userId)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [open, userId]);

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setFormData((prev) => ({ ...prev, profile_image: imageUrl }));
    }
  };


  // Save profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", userId);
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append("profileImage", fileInputRef.current.files[0]);
      }

      await updateUserDetails(formDataToSend);

      const toastInstance = toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        duration: 1500,
      });

      setTimeout(() => {
        toastInstance.dismiss();
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Update Error:", error.message);

      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-lg bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={
                    formData.profile_image
                      ? formData.profile_image.startsWith("http")
                        ? formData.profile_image // For preview URL from `URL.createObjectURL`
                        : `${baseImageUrl}${formData.profile_image}`
                      : "https://via.placeholder.com/100"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border"
                />

                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📷
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Upload your profile picture</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="full_name">Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
