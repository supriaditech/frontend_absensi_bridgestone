// pages/index.tsx
import React from "react";

import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Master from "@/components/Master";
import { ApiResponse } from "../../types/dataKaryawanType";
import PageDashboardAdmin from "@/components/dashboard/DasboardAdmin";
import Api from "../../service/Api";
import DasboardKaryawan from "@/components/dashboard/DasboardKaryawan";

interface Props {
  token: string;
  initialData: ApiResponse | null;
  userType: string;
  session: any;
}

const Page: React.FC<Props> = ({ initialData, token, userType }) => {
  const { data: session } = useSession();
  return (
    <Master userType={userType} title={"Halaman utama"}>
      {userType === "ADMIN" ? (
        <PageDashboardAdmin
          session={session}
          token={token}
          initialData={initialData}
        />
      ) : (
        <DasboardKaryawan token={token} />
      )}
    </Master>
  );
};

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
  let initialData: ApiResponse | null = null;

  if (userType === "ADMIN") {
    const api = new Api();
    api.url = "/user/all";
    api.auth = true;
    api.token = token;
    try {
      initialData = await api.call();
    } catch (error) {
      console.error("Error fetching initial data:", error);
      initialData = null;
    }
  }

  return {
    props: {
      initialData,
      token: token || "",
      userType: userType || "",
      session,
    },
  };
};

export default Page;
