import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@material-tailwind/react";
import { toast, ToastContainer } from "react-toastify";
import { usePhotoProfile } from "../../../../hooks/usePhotoProfile";
import { useSession } from "next-auth/react";
import { ApiUrl } from "../../../../config/config";
import CaptureFace from "../Capture-face";

interface AddPhotoProfileProps {
  token: string;
  userId: any;
  id: number | undefined;
  onClose: () => void;
}

const AddPhotoProfile: React.FC<AddPhotoProfileProps> = ({
  token,
  userId,
  id,
  onClose,
}) => {
  const { uploadPhoto, loading } = usePhotoProfile(token);

  const { data: session } = useSession() as any;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    session?.user?.Murid?.photo ? ApiUrl + "/" + session.user.Murid.photo : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL for the selected file
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const result = await uploadPhoto(userId, id ?? 0, selectedFile);
      //   if (result.success) {
      //     onClose(); // Close the modal only on success
      //   }
    } else {
      toast.error("Pilih foto terlebih dahulu.", { autoClose: 3000 });
    }
  };
console.log(session)
  return (
    <div className="flex flex-col items-center justify-center p-4 ">
      <h2 className="text-2xl font-bold mb-5 text-center text-black">
        Lengkapi Profile Anda
      </h2>
      {session.user.photoUrl === "" && (
        <div className="relative w-72 h-72 mb-4 ">
          <div className="relative rounded-full w-full h-full overflow-hidden bg-gray-500">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>

          <div className=" w-full flex flex-col justify-start items-center">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload">
              <p
                className="absolute bottom-4 right-16 transform translate-y-1/2 translate-x-1/2 rounded-full bg-green-500 w-14 h-14 text-white text-2xl flex items-center justify-center"
                style={{ zIndex: 10 }}
              >
                +
              </p>
            </label>
            <p className="mt-4 text-gray-600 w-40 text-center">
              Upload your photo
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                color="green"
                onClick={handleUpload}
                disabled={loading || !selectedFile}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {session.user.photoUrl !== "" &&
        session.user.faceDescriptor === null && (
          <CaptureFace token={token} onClose={onClose} id={id} />
        )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddPhotoProfile;
