import Master from "@/components/Master";
import TableAbsensiKaryawan from "@/components/RiwayatAbsensi/TableAbsensiKaryawan";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

interface RiwayatAbsensiProps {
  userId: number;
}
function RiwayatAbsensi({ userId }: RiwayatAbsensiProps) {
  return (
    <Master title="Riwayat Absensi" userType="">
      <TableAbsensiKaryawan userId={userId} />
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

export default RiwayatAbsensi;
