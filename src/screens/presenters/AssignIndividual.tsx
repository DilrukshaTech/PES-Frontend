import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableTop } from "../../components/top/TableTop";
import { useAxios } from "../../utils/useAxios";
import Table from "../../components/table/Table";
import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { useFormik } from "formik";

import Popup from "../../components/popup/Popup";
import { useState } from "react";
import Loading from "../../components/loading/Loading";
import { useEventStore } from "../../store/eventStore";
import DropDown from "../../components/input/DropDown";
import useFeedbackAlertStore from "../../store/useFeedbackAlartStore";

type MemberType = {
  type: string;
  id: number;
 sessionId?: number;
 members: { memberId: number }[];
};


export const AssignIndividual = () => {

  const { showFeedback} =  useFeedbackAlertStore();
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
      showFeedback("Presenter assigned successfully!","success");
      queryClient.invalidateQueries({ queryKey: ["presenters"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setHandleOpen(false);
      
      
    },
  });

  const formik = useFormik({
    initialValues: {
     type:"Individual",
     id: 0,
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


  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return FetchData({
        url: `/presenters/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      showFeedback("Presenter deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["presenters"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Error deleting presenter:", error);
      showFeedback("Failed to delete presenter. Please try again.", "failed");
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Delete failed:", err);
      showFeedback("Delete failed. Please try again.", "failed");
    }
  };

  //send email with QR code
  

  const tableColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "memberId", headerName: "Member Id", width: 150 },
    { field: "sessionName", headerName: "Session Name", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: any) => (
        <div className="actions">
          <FiSend className="email-send-icon"  onClick={()=>sendEmailMutation.mutate({
            eventId: eventId,
            email: params.row.email,
            sessionId: params.row.sessionId,
            memberId: params.row.id
          })}/>
          <BsPencilSquare className="edit-icon" />
          <BsTrashFill className="delete-icon" onClick={()=>handleDelete(params.row.id)}/>
          
        </div>
      ),
    },
  ];

  const tableRows =
    (events as any)?.sessions?.flatMap((session: any) =>
      session.presenters.flatMap((presenter: any) =>
        presenter.members.map((member: any) => ({
          id: presenter.id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          memberId: member.memberId,
          sessionName: session.name,
          sessionId: session.id,
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

 const sendEmailMutation = useMutation({

  mutationFn: async ({
    email,
    eventId,
    sessionId,
    memberId,
  }: {
    email: string;
    eventId: number;
    sessionId: number;
    memberId: number;
  }) => {
    return FetchData({
      url: `/generate-qr/${email}?eventId=${eventId}&sessionId=${sessionId}&memberId=${memberId}`,
      method: "GET",
    });
  },
  onSuccess: () => {
    showFeedback("Email sent successfully!","success");

   
  },
  onError: (error) => {
    alert("Error sending email: " + error.message);
  },
});




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
