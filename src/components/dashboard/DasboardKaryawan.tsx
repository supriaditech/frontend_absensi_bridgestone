import { useState } from "react";
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
import { FaCalendarCheck } from "react-icons/fa6";
import { IoLogOutSharp } from "react-icons/io5";
import { MdOutlineEmojiPeople } from "react-icons/md";
import { useCheckIn } from "../../../hooks/useCheckIn";
import { useCheckOut } from "../../../hooks/useCheckOut";

const CheckInComponent = dynamic(() => import("../absensi/CheckInComponent"), {
  ssr: false,
});
const CheckoutComponent = dynamic(
  () => import("../absensi/CheckoutComponent"),
  {
    ssr: false,
  }
);

interface DasboardKaryawanProps {
  token: string;
}

function DasboardKaryawan({ token }: DasboardKaryawanProps) {
  const { data: session } = useSession() as any;
  const { modalPhotoProfile, setPhotoProfile } = usePhotoProfile(token);
  const { hasCheckedIn } = useCheckIn(token);
  const { hasCheckedOut } = useCheckOut(token);

  // State untuk melacak tab aktif
  const [activeTab, setActiveTab] = useState("checkin");

  useEffect(() => {
    if (session) {
      if (
        session.user.photoUrl === "" ||
        session.user.faceDescriptor === null
      ) {
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
      value: "checkout",
      icon: IoLogOutSharp,
      desc: <CheckoutComponent />,
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getStatusMessage = () => {
    if (activeTab === "checkin") {
      return hasCheckedIn
        ? "Anda sudah check in hari ini."
        : "Halo kamu hari ini belum Checkin";
    } else {
      return hasCheckedOut
        ? "Anda sudah checkout hari ini."
        : "Halo kamu hari ini belum Checkin atau sudah Checkout";
    }
  };

  const getStatusColor = () => {
    if (activeTab === "checkin") {
      return hasCheckedIn ? "bg-green-400" : "bg-red-400";
    } else {
      return hasCheckedOut ? "bg-green-400" : "bg-red-400";
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <TabsHeader>
          {data.map(({ label, value, icon }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => handleTabChange(value)}
            >
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <div
          className={`flex p-4 items-center justify-center ${getStatusColor()}`}
        >
          <MdOutlineEmojiPeople color="white" className="w-6 h-6" />
          <p className="text-white font-bold">{getStatusMessage()}</p>
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
          enabled: false,
        }}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="flex-row justify-center item-center"
      >
        <div className="w-full p-4 bg-white rounded-lg shadow-lg">
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
