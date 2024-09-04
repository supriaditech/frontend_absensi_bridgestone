import Master from "@/components/Master";
import TabelAbsensiAdmin from "@/components/RiwayatAbsensi/TabelAbsensiAdmin";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

interface DaftarAbsensi {
  token: string;
  userType: string;
  userId: number;
}
function DaftarAbensi({ token, userType, userId }: DaftarAbsensi) {
  return (
    <Master userType={userType} title="Location Kantor">
      <TabelAbsensiAdmin token={token} userId={userId} />
    </Master>
  );
}

export default DaftarAbensi;

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
