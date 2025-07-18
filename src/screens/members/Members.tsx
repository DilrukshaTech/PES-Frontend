import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableTop } from "../../components/top/TableTop";
import { useAxios } from "../../utils/useAxios";
import Table from "../../components/table/Table";
import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { useFormik } from "formik";
import TextInput from "../../components/input/TextInput";
import Popup from "../../components/popup/Popup";
import { useState } from "react";
import Loading from "../../components/loading/Loading";

type MemberType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  memberId: string;
};
export const Members = () => {
  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { FetchData } = useAxios();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    refetchOnWindowFocus: false,
    queryFn: () =>
      FetchData({
        url: `/members`,
        method: "GET",
      }),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: MemberType) => {
      const finalValues = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      return FetchData({
        url: `/members`,
        method: "POST",
        data: finalValues,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setHandleOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      memberId: "",
    },
    onSubmit: async (values: MemberType) => {
      try {
        await mutateAsync(values);
      } catch (error) {
        console.error("Error adding member:", error);
      }
    },
  });

  const tableColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "memberId", headerName: "Member Id", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: any) => (
        <div className="actions">
          <BsPencilSquare className="edit-icon" />
          <BsTrashFill className="delete-icon" />
        </div>
      ),
    },
  ];

  const tableRows = members.map((member: any) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    memberId: member.memberId,
  }));

  const handleOpenPopup = () => {
    setHandleOpen(true);
  };
  return (
    <div className="members-container">
      {isPending && <Loading />}
      <div className="table">
        <TableTop btnLable="Add Member" handleOpen={handleOpenPopup} />

        <Popup
          title="Add New Member"
          isOpen={handleOpen}
          handleClose={setHandleOpen}
          onClick={formik.handleSubmit}
          content={
            <>
              <TextInput
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              <TextInput
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <TextInput
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
            </>
          }
        />

        <Table columns={tableColumns} rows={tableRows} isLoading={isLoading} />
      </div>
    </div>
  );
};
