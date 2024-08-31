import { Dialog } from "@material-tailwind/react";
import { usePhotoProfile } from "../../../hooks/usePhotoProfile";
import AddPhotoProfile from "./modal/AddPhotoProfile";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
const CheckInComponent = dynamic(() => import("../absensi/CheckInComponent"), {
  ssr: false,
});
interface DasboardKaryawanProps {
  token: string;
}
function DasboardKaryawan({ token }: DasboardKaryawanProps) {
  const { data: session } = useSession() as any;
  const { modalPhotoProfile, setPhotoProfile } = usePhotoProfile(token);
  useEffect(() => {
    if (session) {
      if (
        session.user.photoUrl === "" ||
        session.user.faceDescriptor === null
      ) {
        // If userType is 'GURU' and there's no Guru profile
        setPhotoProfile(true);
      }
    }
  }, [session, setPhotoProfile]);

  return (
    <div>
      {/* <CaptureFace token={token} onClose={() => {}} id={session?.user?.id} /> */}
      <CheckInComponent />
      <Dialog
        size="xxl"
        open={modalPhotoProfile}
        handler={() => {
          setPhotoProfile(false);
        }}
        dismiss={{
          enabled: false, // Disable the ability to close the modal by clicking outside
        }}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="flex-row justify-center item-center"
      >
        <div className="w-full p-4 bg-white rounded-lg shadow-lg ">
          <AddPhotoProfile
            token={session?.accessToken ?? ""}
            userId={session?.user?.userId ?? null}
            id={session?.user.id ?? null}
            onClose={() => {
              setPhotoProfile(false);
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default DasboardKaryawan;
