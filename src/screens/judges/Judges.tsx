import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import Table from "../../components/table/Table";
import { TableTop } from "../../components/top/TableTop";
import "./judges.scss";
import { useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/loading/Loading";
import { useFormik } from "formik";
import Popup from "../../components/popup/Popup";
import TextInput from "../../components/input/TextInput";

interface JudgeType {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  sessions?: { id: number; name: string }[];
}
export const Judges = () => {
  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const { FetchData } = useAxios();
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ["judges"],
    refetchOnWindowFocus: false,
    queryFn: () =>
      FetchData({
        url: `/judges`,
        method: "GET",
      }),
  });

  const { mutateAsync} = useMutation({
    mutationFn: async (values: JudgeType) => {
      const finalValues = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        category: values.category,
       
      };
      return FetchData({
        url: `/judges`,
        method: "POST",
        data: finalValues,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judges"] });
      setHandleOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
     
    },
    onSubmit: async (values: JudgeType) => {
      try {
        await mutateAsync(values);
        formik.resetForm();
      } catch (error) {
        console.error("Error creating judge:", error);
      }
    },
  });

  const tableRows = data?.map((judge: any) => ({
    id: judge.id,
    name: judge.name,
    email: judge.email,
    phone: judge.phone,
    category: judge.category,
    sessions: judge.sessions.length,
  }));

  const handleOpenPopup = () => {
    setHandleOpen(true);
  };

  const handleClosePopup = () => {
    setHandleOpen(false);
  };
  return (
    <div id="judges-container">
      {(isLoading || isFetching || isPending) && <Loading />}
      <div className="table">
        <TableTop btnLable="New Judge" handleOpen={handleOpenPopup} />

        <Popup
          title="Add New Judge"
          isOpen={handleOpen}
          handleClose={handleClosePopup}
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
              <TextInput
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
               
              />
            </>
          }
        />
        <Table
          columns={[
            { field: "name", headerName: "Name", width: 200 },
            { field: "email", headerName: "Email", width: 200 },
            { field: "phone", headerName: "Phone", width: 150 },
            { field: "category", headerName: "Category", width: 150 },
            { field: "sessions", headerName: "No of Sessions", width: 150 },
            {
              field: "Actions",
              headerName: "Actions",
              width: 200,
              sortable: false,
              filterable: false,
              renderCell: (params: { row: { id: number } }) => (
                <div className="actions">
                  <BsPencilSquare className="edit-icon" />
                  <BsTrashFill className="delete-icon" />
                </div>
              ),
            },
          ]}
          rows={tableRows}
        />
      </div>
    </div>
  );
};
