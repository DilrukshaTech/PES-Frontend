import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableTop } from "../../components/top/TableTop";
import { useAxios } from "../../utils/useAxios";
import Table from "../../components/table/Table";
import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { useFormik } from "formik";

import Popup from "../../components/popup/Popup";
import { useState } from "react";
import Loading from "../../components/loading/Loading";
import { useEventStore } from "../../store/eventStore";
import DropDown from "../../components/input/DropDown";
type MemberType = {
  type: string;
  id: number;
 sessionId?: number;
 members: { memberId: number }[];
};


export const AssignIndividual = () => {

  const queryClient = useQueryClient();
  const { FetchData } = useAxios();
    const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const eventId = useEventStore((state) => state.eventId);
 

  const { data: events = [],isFetching } = useQuery({
    enabled: !!eventId,
    queryKey: ["events"],
    refetchOnWindowFocus: false,
    queryFn: () =>
      FetchData({
        url: `/events/${eventId}`,
        method: "GET",
      }),
  });


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
      ...values,
        members: values.members.map((member) => ({
          memberId: member.memberId,
         
        })),
      };
      return FetchData({
        url: `/presenters`,
        method: "POST",
        data: finalValues,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presenters"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setHandleOpen(false);
      
      
    },
  });

  const formik = useFormik({
    initialValues: {
     type:"Individual",
     sessionId: 0,
      members: [{ memberId: 0 }],
    },
    onSubmit: async (values: MemberType) => {
      try {
        await mutateAsync(values);
        formik.resetForm();
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

  const tableRows =
    (events as any)?.sessions?.flatMap((session: any) =>
      session.presenters.flatMap((presenter: any) =>
        presenter.members.map((member: any) => ({
          id: member.id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          memberId: member.memberId,
          sessionName: session.name,
          presenterType: presenter.type,
        }))
      )
    ) || [];

  const handleOpenPopup = () => {
    setHandleOpen(true);
  };

  const handleClosePopup = () => {
    setHandleOpen(false);
  };

  return (
    <div className="individual">
      {(isLoading || isPending || isFetching ) && <Loading />}
      <div className="table">
        <TableTop btnLable="Assign Individual" handleOpen={handleOpenPopup} />

          <Popup
          title="Assign Individual"
          isOpen={handleOpen}
          handleClose={handleClosePopup}
          onClick={formik.handleSubmit}
          content={
            <>
             <DropDown
                label="Session"
                name="sessionId"
                value={formik.values.sessionId}
                onChange={formik.handleChange}
                options={
                  events?.sessions?.map((session: any) => ({
                    label: session.name,
                    value: session.id,
                  })) || []
                }
              />
             <DropDown
                label="Member"
                name="members[0].memberId"
                value={formik.values.members[0].memberId}
                onChange={formik.handleChange}
                options={
                  members.map((member: any) => ({
                    label: member.name,
                    value: member.id,
                  })) || []
                }
              />
             
             
            </>
          }
          />
        <Table
          columns={tableColumns}
          rows={tableRows}
          isLoading={isLoading || isPending}
        />
      </div>
    </div>
  );
};
