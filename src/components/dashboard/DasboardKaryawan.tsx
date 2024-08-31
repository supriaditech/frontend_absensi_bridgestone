import {
  Dialog,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { usePhotoProfile } from "../../../hooks/usePhotoProfile";
import AddPhotoProfile from "./modal/AddPhotoProfile";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Square3Stack3DIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { FaCalendarCheck } from "react-icons/fa6";
import { IoLogOutSharp } from "react-icons/io5";
import { MdOutlineEmojiPeople } from "react-icons/md";
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

  const data = [
    {
      label: "Checkin",
      value: "checkin",
      icon: FaCalendarCheck,
      desc: <CheckInComponent />,
    },
    {
      label: "Checkout",
      value: "Checkout",
      icon: IoLogOutSharp,
      desc: <div>sad</div>,
    },
  ];

  return (
    <div>
      {/* <CaptureFace token={token} onClose={() => {}} id={session?.user?.id} /> */}

      <Tabs value="checkin">
        <TabsHeader>
          {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <div className="flex bg-green-400 p-4 items-center justify-center">
          <MdOutlineEmojiPeople color="white" className="w-6 h-6" />
          <p className="text-white font-bold">
            Halo kamu hari ini belum Checkin
          </p>
        </div>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>

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
