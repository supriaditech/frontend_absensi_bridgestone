// pages/index.tsx
import React from "react";
import Head from "next/head";
import CardImage from "@/components/login/CardImage";
import FormLogin from "@/components/login/FormLogin";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface Props {
  message: string;
}

const LoginPage: React.FC<Props> = () => {
  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="This is the login page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="h-screen bg-customColor flex justify-center items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-20">
        <div className="bg-white grid grid-cols-1 md:grid-cols-2 justify-center items-center h-full w-full max-w-4xl rounded-lg shadow-lg">
          <FormLogin />
          <CardImage />
        </div>
      </div>
    </>
  );
};

// SSR function to check for session and redirect accordingly
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await getSession(context);
  const userType = session?.user?.role;

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { userType }, // You can pass additional props here if needed
  };
};

export default LoginPage;
