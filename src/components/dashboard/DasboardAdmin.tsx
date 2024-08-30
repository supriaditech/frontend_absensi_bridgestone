import React, { useState, useMemo, useEffect } from "react";

import { ApiResponse, Karyawan } from "../../../types/dataKaryawanType";
import { useDataKaryawan } from "../../../hooks/useDataKaryawan";
import {
  Button,
  Card,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import ModalAddKaryawan from "@/components/DaftarKaryawan/ModalAddKaryawan";
import ModalEditKaryawan from "@/components/DaftarKaryawan/ModalEditKaryawan";
import ModalDeleteKaryawan from "@/components/DaftarKaryawan/ModalDeleteKaryawan";
import { useSession } from "next-auth/react";

interface PageDashboardProps {
  initialData: any;
  token: string;
  session: any;
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

const PageDashboardAdmin: React.FC<PageDashboardProps> = ({
  initialData,
  token,
  session,
}) => {
  const {
    dataKaryawan,
    isLoading,
    isError,
    openModal,
    setOpenModal,
    openModalEdit,
    setOpenModalEdit,
    selectedKaryawan,
    setSelectedKaryawan,
    onEditSubmit,
    setIdKaryawan,
    openModalDelete,
    setOpenModalDelete,
    idKaryawan,
  } = useDataKaryawan(token);

  const [searchQuery, setSearchQuery] = useState("");
  const [displayedData, setDisplayedData] = useState<ApiResponse>();

  useEffect(() => {
    if (dataKaryawan) {
      setDisplayedData(dataKaryawan);
    } else {
      setDisplayedData(initialData.data);
    }
  }, [dataKaryawan, initialData.data]);

  const filteredData = useMemo(() => {
    return (
      displayedData?.data?.filter(
        (karyawan) =>
          karyawan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          karyawan.userId.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? []
    );
  }, [searchQuery, displayedData]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  if (isLoading && !dataKaryawan) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const handleEdit = (karyawan: Karyawan) => {
    setSelectedKaryawan(karyawan);
    setOpenModalEdit(true);
  };

  const handleDelete = (id: number) => {
    setIdKaryawan(id);
    setOpenModalDelete(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 bg-abuTua rounded-3xl"></div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            {session?.user.name}
          </h1>
          <h6 className="leading-tight text-gray-700">{session?.user.role}</h6>
        </div>
      </div>
      <Card className="h-full w-full overflow-scroll p-4 border-2 my-4">
        <h1 className="text-2xl font-bold mb-6 w-full text-center">
          Data Karyawan
        </h1>
        <div className="flex justify-between gap-40 mb-4">
          <div className="w-96">
            <Input
              crossOrigin={undefined}
              label="Cari Karyawan..."
              className="w-76"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="mr-2 bg-buttonGreen w-60"
            onClick={() => setOpenModal(true)}
          >
            Tambah Karyawan
          </Button>
        </div>
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
            {currentData?.map((karyawan: Karyawan, index: number) => {
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
                      {index + 1}
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
                      onClick={() => handleEdit(karyawan)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      size="sm"
                      onClick={() => handleDelete(karyawan?.id)}
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
      <Dialog
        open={openModal}
        handler={() => setOpenModal(!openModal)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="flex-row justify-center item-center"
      >
        <ModalAddKaryawan token={token} onClose={() => setOpenModal(false)} />
      </Dialog>
      {selectedKaryawan && (
        <Dialog
          open={openModalEdit}
          handler={() => setOpenModalEdit(!openModalEdit)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          className="flex-row justify-center item-center"
        >
          <ModalEditKaryawan
            token={token}
            karyawan={selectedKaryawan}
            onClose={() => setOpenModalEdit(false)}
            onSubmit={onEditSubmit}
          />
        </Dialog>
      )}
      <Dialog
        open={openModalDelete}
        handler={() => setOpenModalDelete(!openModalDelete)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="flex-row justify-center item-center"
      >
        <ModalDeleteKaryawan
          token={token}
          onClose={() => setOpenModalDelete(false)}
          karyawanId={idKaryawan}
        />
      </Dialog>
    </div>
  );
};

export default PageDashboardAdmin;
