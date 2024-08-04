// pages/dashboard.tsx
import React from "react";
import Head from "next/head";
import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";

function PageDashboard() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirects to the homepage after logout
  };

  return (
    <>
      <Head>
        <title>Halaman Utama</title>
        <meta name="description" content="This is the dashboard page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="h-screen bg-customColor flex flex-col justify-center items-center px-80 py-40">
        <div className="bg-white grid grid-cols-1 lg:grid-cols-2 justify-center items-center lg:h-full w-full rounded-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
              Welcome to the Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
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
