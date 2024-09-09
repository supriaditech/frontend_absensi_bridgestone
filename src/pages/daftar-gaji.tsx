import TabelDaftarGajiAdmin from "@/components/daftarGaji/TabelDaftarGajiAdmin";
import Master from "@/components/Master";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

interface DaftarGajiProps {
  token: string;
  userType: string;
  userId: number;
}

function DaftarGaji({ token, userType, userId }: DaftarGajiProps) {
  return (
    <Master userType={userType} title="Location Kantor">
      <TabelDaftarGajiAdmin token={token} userId={userId} />
    </Master>
  );
}

export default DaftarGaji;

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
