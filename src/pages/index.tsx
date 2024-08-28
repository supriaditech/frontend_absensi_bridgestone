// pages/index.tsx
import React from "react";
import Head from "next/head";
import CardImage from "@/components/login/CardImage";
import FormLogin from "@/components/login/FormLogin";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Master from "@/components/Master";
import { ApiResponse } from "../../types/dataKaryawanType";
import PageDashboardAdmin from "@/components/dashboard/DasboardAdmin";
import Api from "../../service/Api";
import { div } from "@tensorflow/tfjs";

interface Props {
  token: string;
  initialData: ApiResponse;
  userType: string;
}

const Page: React.FC<Props> = ({ initialData, token, userType }) => {
  return (
    <Master userType={userType} title={"Halaman utama"}>
      {userType === "ADMIN" ? (
        <PageDashboardAdmin token={token} initialData={initialData} />
      ) : (
        <div>sad</div>
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
  const api = new Api();
  api.url = "/user/all";
  api.auth = true;
  api.token = token;
  const initialData = await api.call();

  return {
    props: {
      initialData,
      token: token,
      session,
      userType,
    },
  };
};

export default Page;
