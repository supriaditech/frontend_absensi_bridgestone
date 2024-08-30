import dynamic from "next/dynamic";
import Master from "@/components/Master";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Api from "../../service/Api";

const DynamicHeader = dynamic(() => import("../components/location/map"), {
  ssr: false,
});


interface LocationProps{
  area:any,
  token:string,
  userType:string
}
function Location({ area, token , userType}: LocationProps) {
  const { data: session } = useSession() as any;
  console.log(session)
  return (
    <Master userType={userType} title="Location Kantor">
      <div className="bg-white rounded-md p-10">
        <DynamicHeader token={token} initialArea={area} />
      </div>
    </Master>
  );
}

export default Location;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await getSession(context);
  const userType = session?.user?.role;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const token = session?.accessToken;
  const api = new Api();
  api.url = "/area/get-location";
  api.auth = true;
  api.token = token;

  let area = null;

  try {
    const response = await api.call();
    if (response.meta.statusCode === 200) {
      area = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch area data:", error);
  }

  return {
    props: {
      token,
      area,userType
    },
  };
};
