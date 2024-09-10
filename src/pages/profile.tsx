import Master from "@/components/Master";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import { Card, Typography, Avatar } from "@material-tailwind/react";
import { ApiUrl } from "../../config/config";

interface ProfileProps {
  userType: string;
}

function Profile({ userType }: ProfileProps) {
  const { data: session } = useSession() as any;

  const user = session?.user;

  return (
    <Master userType={userType} title="Profile">
      <div className="flex justify-center mt-10">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <Avatar
              src={ApiUrl + user?.photoUrl || "/default-avatar.png"}
              alt={user?.name}
              size="xl"
              className="border-2 border-gray-300 shadow-md"
            />
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div className="text-center">
              <Typography variant="h5" className="font-bold text-gray-800">
                {user?.name}
              </Typography>
              <Typography className="text-sm text-gray-500">
                {user?.employmentStatus} - {user?.role}
              </Typography>
            </div>

            <div className="space-y-2">
              {/* Email */}
              <div className="flex justify-between items-center">
                <Typography className="text-gray-600">Email:</Typography>
                <Typography className="text-gray-900">
                  {user?.userId}
                </Typography>
              </div>

              {/* Date of Birth */}
              <div className="flex justify-between items-center">
                <Typography className="text-gray-600">
                  Tanggal Lahir:
                </Typography>
                <Typography className="text-gray-900">
                  {new Date(user?.dateOfBirth).toLocaleDateString()}
                </Typography>
              </div>

              {/* Employment Start Date */}
              <div className="flex justify-between items-center">
                <Typography className="text-gray-600">Mulai Kerja:</Typography>
                <Typography className="text-gray-900">
                  {new Date(user?.employmentStartDate).toLocaleDateString()}
                </Typography>
              </div>

              {/* Phone Number */}
              <div className="flex justify-between items-center">
                <Typography className="text-gray-600">Telepon:</Typography>
                <Typography className="text-gray-900">
                  {user?.phoneNumber}
                </Typography>
              </div>

              {/* Address */}
              <div className="flex justify-between items-center">
                <Typography className="text-gray-600">Alamat:</Typography>
                <Typography className="text-gray-900">
                  {user?.address}
                </Typography>
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

export default Profile;
