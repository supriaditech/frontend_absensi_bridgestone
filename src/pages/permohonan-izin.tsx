import TabelPermohonanIzinAdmin from "@/components/absensi/table/TabelPermohonanIzinAdmin";
import Master from "@/components/Master";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

interface PermohonanIzinProps {
  token: string;
  userType: string;
  userId: number;
}

function PermohonanIzin({ userType, token, userId }: PermohonanIzinProps) {
  return (
    <Master title="Permohonan Izin" userType={userType}>
      <TabelPermohonanIzinAdmin token={token} userId={userId} />
    </Master>
  );
}

// SSR function to check for session and redirect accordingly
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

export default PermohonanIzin;
