import React, { useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Head from "next/head";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MasterProps } from "../Master";
import { BsFillEnvelopePaperFill } from "react-icons/bs";

interface SidebarProps {
  title: string;
  children: React.ReactNode; // Use React.ReactNode to indicate children
}

function Sidebar({ children, title }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <div className="flex h-screen">
      <Card
        className={`fixed h-full ${
          isSidebarOpen ? "w-64" : "w-24 "
        } p-4 shadow-xl shadow-blue-gray-900/5 transition-all duration-300 z-10`}
      >
        <div className="flex mb-2 p-4 justify-between items-center">
          {isSidebarOpen && (
            <Typography variant="h5" color="blue-gray">
              Sidebar
            </Typography>
          )}
          <button
            onClick={handleToggleSidebar}
            className="p-2 bg-gray-200 rounded"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        <div
          className={`w-w-full flex flex-col justify-center gap-4 ${
            isSidebarOpen ? "w-full" : " items-center "
          } `}
        >
          <Link className={`${isSidebarOpen ? "w-full" : "w-12 "} `} href={"/"}>
            <ListItem className={`${isSidebarOpen ? "w-full" : "w-12 "} `}>
              <ListItemPrefix className={`${!isSidebarOpen && "m-auto "} `}>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isSidebarOpen && "Daftar Karyawan"}
            </ListItem>
          </Link>
          <Link
            className={`${isSidebarOpen ? "w-full" : "w-12 "}`}
            href={"/daftar-absensi"}
          >
            <ListItem className={`${isSidebarOpen ? "w-full" : "w-12 "}`}>
              <ListItemPrefix className={`${!isSidebarOpen && "m-auto "}`}>
                <InboxIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isSidebarOpen && "Daftar absensi"}
            </ListItem>
          </Link>

          <Link
            className={`${isSidebarOpen ? "w-full" : "w-12 "}`}
            href={"/daftar-gaji"}
          >
            <ListItem className={`${isSidebarOpen ? "w-full" : "w-12 "}`}>
              <ListItemPrefix className={`${!isSidebarOpen && "m-auto "}`}>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isSidebarOpen && "Daftar Gaji"}
            </ListItem>
          </Link>

          <Link
            className={`${isSidebarOpen ? "w-full" : "w-12 "}`}
            href={"/location"}
          >
            <ListItem className={`${isSidebarOpen ? "w-full" : "w-12 "}`}>
              <ListItemPrefix className={`${!isSidebarOpen && "m-auto "}`}>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isSidebarOpen && "Atur Wilayah Absensi"}
            </ListItem>
          </Link>

          <Link
            className={`${isSidebarOpen ? "w-full" : "w-12 "}`}
            href={"/permohonan-izin"}
          >
            <ListItem className={`${isSidebarOpen ? "w-full" : "w-12 "}`}>
              <ListItemPrefix className={`${!isSidebarOpen && "m-auto "}`}>
                <BsFillEnvelopePaperFill className="h-4 w-4" />
              </ListItemPrefix>
              {isSidebarOpen && "Periksa Pemohonan Izin"}
            </ListItem>
          </Link>

          <ListItem
            onClick={handleLogout}
            className={`${isSidebarOpen ? "w-full" : "w-12 "}`}
          >
            <ListItemPrefix className={`${!isSidebarOpen && "m-auto "}`}>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            {isSidebarOpen && "Log Out"}
          </ListItem>
        </div>
      </Card>

      <div
        className={`flex-1 h-full ml-${
          isSidebarOpen ? 64 : 40
        } transition-all duration-300`}
      >
        <Head>
          <title>{title}</title>
          <meta name="description" content="This is the dashboard page" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="p-6 h-full ml-20 pb-20 overflow-auto ">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Sidebar;
