import Master from "@/components/Master";
import { Card, Typography } from "@material-tailwind/react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

function Contact({ userType }: any) {
  const { data: session } = useSession();

  return (
    <Master userType={userType} title="Contact Person">
      <div className="flex justify-center mt-10">
        <Card className="w-full max-w-7xl p-6 shadow-lg rounded-lg">
          <p className="text-center font-bold text-xl pb-8">Contact Person</p>
          {/* Avatar */}
          <div className="flex flex-col items-center justify-center mb-6">
            <Image
              src={"/assets/logo/profile.png"}
              alt={"Photo"}
              width={200}
              height={200}
              //   size="xl"
              className=""
            />
            <p className="pt-4 font-semibold">Junaidi</p>
            <p>Hrd Manager</p>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              {/* Email */}
              <div className="flex text-center justify-center gap-4 items-center">
                <Typography className="text-gray-600">Email:</Typography>
                <Typography className="text-gray-900">
                  JunaidiBridgeston@gmail.com
                </Typography>
              </div>

              {/* Phone Number */}
              <div className="flex text-center justify-center gap-4 items-center">
                <Typography className="text-gray-600">Telepon:</Typography>
                <Typography className="text-gray-900">
                  0852-8335-4883
                </Typography>
              </div>
              <p className="pt-4 text-lg font-semibold text-center">
                Sosial Media
              </p>
              <div className="flex justify-center items-center gap-4 pt-2">
                <Image
                  src={"/assets/sosialMedia/facebook.png"}
                  alt={"Photo"}
                  width={50}
                  height={50}
                  //   size="xl"
                  className=""
                  onClick={() =>
                    (window.location.href =
                      "https://www.facebook.com/bridgestone/")
                  }
                />
                <Image
                  src={"/assets/sosialMedia/instagram.png"}
                  alt={"Photo"}
                  width={50}
                  height={50}
                  //   size="xl"
                  className=""
                  onClick={() =>
                    (window.location.href =
                      "https://www.instagram.com/bridgestone.id/")
                  }
                />
                <Image
                  src={"/assets/sosialMedia/youtube.png"}
                  alt={"Photo"}
                  width={50}
                  height={50}
                  //   size="xl"
                  className=""
                  onClick={() =>
                    (window.location.href =
                      "https://www.youtube.com/user/bridgestonetires")
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Master>
  );
}

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

  return {
    props: {
      token: token || "",
      userType: userType || "",
      session,
    },
  };
};
export default Contact;
