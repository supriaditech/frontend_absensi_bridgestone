import GajiKaryawan from "@/components/daftarGaji/GajiKaryawan";
import TabelDaftarGajiAdmin from "@/components/daftarGaji/TabelDaftarGajiAdmin";
import Master from "@/components/Master";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

interface RiwayatGajiKaryawanProps {
  token: string;
  userType: string;
  userId: number;
}

function RiwayatGajiKaryawan({ token, userType }: RiwayatGajiKaryawanProps) {
  return (
    <Master userType={userType} title="Location Kantor">
      <div className="min-h-screen bg-gray-100 ">
        <GajiKaryawan token={token} />
      </div>
    </Master>
  );
}

export default RiwayatGajiKaryawan;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const token = session?.accessToken;
  const userType = session?.user?.role;
  const userId = session?.user?.id;
  return {
    props: {
      token: token || "",
      userType: userType || "",
      session,
      userId,
    },
  };
};
