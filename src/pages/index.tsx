import React from "react";
import Head from "next/head";
import CardImage from "@/components/login/CardImage";
import FormLogin from "@/components/login/FormLogin";

interface Props {
  message: string;
}

const Page: React.FC<Props> = ({ message }) => {
  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="This is the login page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="h-screen bg-customColor flex justify-center items-center px-80 py-40">
        <div className="bg-white grid grid-cols-2 justify-center items-center h-full w-full rounded-lg">
          <FormLogin />
          <CardImage />
        </div>
      </div>
    </>
  );
};

// This function gets called on every request
export async function getServerSideProps() {
  // Fetch data from an external API or perform other server-side operations
  const message = "Hello, Next.js with SSR!";

  // Pass data to the page via props
  return { props: { message } };
}

export default Page;
