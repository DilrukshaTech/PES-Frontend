import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import Table from "../../components/table/Table";
import { TableTop } from "../../components/top/TableTop";
import "./session.scss";

import { useAxios } from "../../utils/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/loading/Loading";
import { useEventStore } from "../../store/eventStore";
import { useState } from "react";
import TextInput from "../../components/input/TextInput";
import DropDown from "../../components/input/DropDown";
import Popup from "../../components/popup/Popup";
import { useFormik } from "formik";
import useFeedbackAlertStore from "../../store/useFeedbackAlartStore";
import axios from "axios";

interface SessionType {
  id: number;
  name: string;
  date: string;
  time: string;
  mode: string;
  location?: string;
  sessionJudges: { judge: { id: number; name: string } }[];
  presenters: { id: number; type: string; groupName: string | null }[];
}

interface EventType {
  id: number;
  name: string;
  sessions: SessionType[];
}

type CreateSessionType = {
  name: string;
  date: string;
  time: string;
  mode: string;
  location?: string;
  eventId: number;
};

export const Sessions = () => {
  const {showFeedback }= useFeedbackAlertStore();

  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const { FetchData } = useAxios();
  const eventId = useEventStore((state) => state.eventId);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery<EventType>({
    enabled: !!eventId,
    queryKey: ["events", eventId],
    refetchOnWindowFocus: false,
    queryFn: () =>
      FetchData({
        url: `/events/${eventId}`,
        method: "GET",
      }),
  });

  const { mutateAsync,isPending} = useMutation({
    mutationFn: async (values: CreateSessionType) => {
      const finalValues = {
        ...values,
        date: new Date(values.date).toISOString(),
      };
      const response = await FetchData({
        url: `/sessions`,
        method: "POST",
        data: finalValues,
      });
      return response;
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
       showFeedback("Session created successfully", "success");
      setHandleOpen(false);
     
    },
  });

  
const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://localhost:3000/sessions/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      showFeedback("Session deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
    },
  });

const handleDelete = async (id: number) => {
  try {
    console.log("Attempting to delete session ID:", id);
    await deleteMutation.mutateAsync(id);
  }
  catch (err) {
    console.error("Delete failed:", err);
    showFeedback("Delete failed. Check for related presenters.", "failed");
  }
}

  const formik = useFormik({
    initialValues: {
      name: "",
      date: "",
      time: "",
      mode: "",
      location: "",
      eventId: eventId ? Number(eventId) : 0,
    },
    onSubmit: async (values: CreateSessionType) => {
      try {
        await mutateAsync(values);
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const tableRows =
    data?.sessions?.map((session: SessionType) => {
      const groupCount =
        session.presenters?.filter((p) => p.type === "Group").length || 0;
      const individualCount =
        session.presenters?.filter((p) => p.type === "Individual").length || 0;

      const judgeCount =
        session.sessionJudges?.filter((j) => j.judge).length || 0;

      return {
        id: session.id,
        name: session.name,
        date: new Date(session.date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        time: session.time,
        location: session.location || "N/A",
        judges: judgeCount,
        groups: groupCount,
        individuals: individualCount,
      };
    }) || [];

  const handleOpenPopup = () => {
    setHandleOpen(true);
  };

  const handleClosePopup = () => {
    setHandleOpen(false);
  };

  return (
    <div id="session-container">
      {(isPending || isFetching || isLoading) && <Loading />}
    
      <div className="table">
        <TableTop handleOpen={handleOpenPopup} btnLable="New Session" />

        <Popup
          isOpen={handleOpen}
          handleClose={handleClosePopup}
          title="Create Session"
          btnText="Create Session"
          content={
            <>
              <TextInput
                label="Session Name"
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              <TextInput
              
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
              />

              <TextInput
              label="Time"
                name="time"
                type="time"
                value={formik.values.time}
                onChange={formik.handleChange}
              />
              <TextInput
                label="Location"
                name="location"
                type="text"
                value={formik.values.location}
                onChange={formik.handleChange}
              />
              <DropDown
                label="Mode"
                name="mode"
                value={formik.values.mode}
                onChange={formik.handleChange}
                options={[
                  { label: "Online", value: "online" },
                  { label: "Offline", value: "offline" },
                ]}
              />
            </>
          }
          onClick={formik.handleSubmit}
        />

        <Table
          columns={[
            { field: "id", headerName: "ID", width: 50 },
            { field: "name", headerName: "Session Name", width: 150 },
            { field: "date", headerName: "Date", width: 100 },
            { field: "time", headerName: "Time", width: 100 },
            { field: "location", headerName: "Location", width: 150 },
            { field: "judges", headerName: "No of Judges", width: 130 },
            { field: "groups", headerName: "No of Groups", width: 150 },
            {
              field: "individuals",
              headerName: "No of Individuals",
              width: 150,
            },
            {
              field: "Actions",
              headerName: "Actions",
              width: 200,
              sortable: false,
              filterable: false,
              renderCell: (params: { row: { id: number } }) => (
                <div className="actions">
                  <BsPencilSquare className="edit-icon" />
                  <BsTrashFill className="delete-icon" onClick={()=>handleDelete(params.row.id)}/>
                </div>
              ),
            },
          ]}
          rows={tableRows}
          isLoading={isLoading || isPending || isFetching}
        />
      </div>
    </div>
  );
};
