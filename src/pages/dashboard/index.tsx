import React from "react";
import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";
import Master from "@/components/Master";

function PageDashboard() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirects to the homepage after logout
  };

  return (
    <Master title="Halaman Utama">
      <div className="bg-white h-full grid grid-cols-1 lg:grid-cols-2 justify-center w-full rounded-lg">
        <div className="p-6">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 bg-abuTua rounded-3xl"></div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Supriadi</h1>
              <h6 className="leading-tight text-gray-700">Admin</h6>
            </div>
          </div>
        </div>
      </div>
    </Master>
  );
}

export default PageDashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // You can pass additional props here if needed
  };
};
