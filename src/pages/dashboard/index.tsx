import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Master from "@/components/Master";
import { ApiResponse, Karyawan } from "../../../types/dataKaryawanType";
import { useDataKaryawan } from "../../../hooks/useDataKaryawan";
import { Button, Card, Typography } from "@material-tailwind/react";
import Api from "../../../service/Api";

interface PageDashboardProps {
  initialData: ApiResponse;
  token: string;
}

const TABLE_HEAD = [
  "ID",
  "User ID",
  "Name",
  "Address",
  "Phone Number",
  "Status",
  "Actions",
];

const isKaryawanArray = (data: any): data is Karyawan[] => {
  return (
    Array.isArray(data) && data.every((item) => "id" in item && "name" in item)
  );
};

const PageDashboard: React.FC<PageDashboardProps> = ({
  initialData,
  token,
}) => {
  const { dataKaryawan, isLoading, isError } = useDataKaryawan(token);

  // Use initialData if dataKaryawan is undefined and ensure it's an array of Karyawan
  const displayedData: Karyawan[] = isKaryawanArray(dataKaryawan)
    ? dataKaryawan
    : initialData.data;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(displayedData.length / itemsPerPage);

  if (isLoading && !dataKaryawan) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const handleEdit = (id: number) => {
    // Handle edit action
    console.log(`Edit karyawan with ID ${id}`);
  };

  const handleDelete = (id: number) => {
    // Handle delete action
    console.log(`Delete karyawan with ID ${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate data to be displayed on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = displayedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Master title="Halaman Utama">
      <div className="p-6 bg-white rounded-lg">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 bg-abuTua rounded-3xl"></div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Supriadi</h1>
            <h6 className="leading-tight text-gray-700">Admin</h6>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4 w-full text-center mt-10">
          Data Karyawan
        </h1>
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((karyawan: Karyawan, index: number) => {
                const isLast = index === currentData.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={karyawan.id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {karyawan.id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {karyawan.userId}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {karyawan.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {karyawan.address}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {karyawan.phoneNumber}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {karyawan.employmentStatus}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Button
                        color="blue"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEdit(karyawan.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        size="sm"
                        onClick={() => handleDelete(karyawan.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </div>
    </Master>
  );
};

export default PageDashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await getSession(context);
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
  api.url = "/user/all";
  api.auth = true;
  api.token = token;
  const initialData = await api.call();

  return {
    props: {
      initialData,
      token: token,
    },
  };
};
