import Popup from "../../components/popup/Popup";
import { TableTop } from "../../components/top/TableTop";
import { useState } from "react";
import { useAxios } from "../../utils/useAxios";
import { useMutation, useQuery } from "@tanstack/react-query";


import TextInput from "../../components/input/TextInput";
import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import Table from "../../components/table/Table";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Loading from "../../components/loading/Loading";
import { useEventStore } from "../../store/eventStore";

type CriteriaType = {

  eventId: number;
  name: string;
};
export const Criteria = () => {
  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { FetchData } = useAxios();
  const eventId = useEventStore((state) => state.eventId);

  const { data: criteria = [], isFetching } = useQuery({
    queryKey: ["criteria"],
    refetchOnWindowFocus: false,
    queryFn: () =>
      FetchData({
        url: `/criteria`,
        method: "GET",
      }),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: { eventId:number; name: string }) => {
      const finalValues = {
        eventId: values.eventId,
        name: values.name,
      };
      return FetchData({
        url: `/criteria`,
        method: "POST",
        data: finalValues,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setHandleOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
     eventId: eventId ? parseInt(eventId) : 0,
      name: "",
    },
    onSubmit: async (values:CriteriaType) => {
      await mutateAsync(values);
    },
  });

  const tableColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Criteria Name", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="actions">
          <BsPencilSquare className="edit-icon" />
          <BsTrashFill className="delete-icon" />
        </div>
      ),
    },
  ];

  const tableRows = criteria.map((item) => ({
    id: item.id.toString(),
    presenterType: item.presenterType,
    name: item.name,
  }));
  const handleOpenPopup = () => {
    setHandleOpen(true);
  };
  const handleClosePopup = () => {
    setHandleOpen(false);
  };

  return (
    <div className="criteria">
      {(isPending || isFetching) && <Loading />}
      <div className="table">
        <TableTop btnLable="Add Criteria" handleOpen={handleOpenPopup} />
        <Popup
          title="Add Criteria"
          isOpen={handleOpen}
          handleClose={handleClosePopup}
          content={
            <>
             
              <TextInput
                label="Criteria Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </>
          }
          onClick={formik.handleSubmit}
        />

        <Table columns={tableColumns} isLoading={isFetching} rows={tableRows} />
      </div>
    </div>
  );
};
