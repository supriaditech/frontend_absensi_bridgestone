import { useSession } from "next-auth/react";
import { useState } from "react";
import Api from "../service/Api";
import { toast } from "react-toastify";

const usePhotoProfile = (token: any) => {
  const [modalPhotoProfile, setPhotoProfile] = useState(false);

  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const uploadPhoto = async (userId: number, id: any, photo: File) => {
    const formData = new FormData();

    formData.append("id", id);
    formData.append("photo", photo);

    // Inspect FormData entries
    // Array.from(formData.entries()).forEach(([key, value]) => {
    //   console.log(`${key}:`, value);
    // });

    setLoading(true);
    try {
      const api = new Api();
      api.url = "/user/update-photo";
      api.auth = true;
      api.token = token;
      api.type = "multipart"; // Set type ke "multipart" untuk FormData
      api.body = formData;

      const response = await api.call();
      if (response.meta.statusCode === 200) {
        toast.success("Photo berhasil diunggah!", { autoClose: 3000 });
        // setPhotoProfile(false); // Close the modal only on success

        // Update session manually
        await update();
        return { success: true };
      } else {
        throw new Error(response.meta.message || "Gagal mengunggah photo");
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan saat mengunggah photo.", {
        autoClose: 3000,
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    modalPhotoProfile,
    setPhotoProfile,
    uploadPhoto,
    loading,
  };
};

export { usePhotoProfile };
