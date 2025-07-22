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
import { useEventStore } from "../../store/eventStore";
import DropDown from "../../components/input/DropDown";
import useFeedbackAlertStore from "../../store/useFeedbackAlartStore";

interface JudgeType {
  sessionId?: number;
  judgeId?: number;
}

interface SessionJudge {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Judge {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Session {
  id: number;
  name: string;
  sessionJudges: { judge: Judge }[];
}

interface EventData {
  id: number;
  name: string;
  sessions: Session[];
}

interface TableRow {
  id: string;
  sessionName: string;
  name: string;
  email: string;
  phone: string;
}

export const AsignNewJudge = () => {
  const { showFeedback } = useFeedbackAlertStore();
  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const { FetchData } = useAxios();
  const queryClient = useQueryClient();
  const eventId = useEventStore((state) => state.eventId);

  const { data: eventData = { id: 0, name: "", sessions: [] }, isLoading } =
    useQuery<EventData>({
      queryKey: ["events"],
      enabled: !!eventId,
      refetchOnWindowFocus: false,
      queryFn: () =>
        FetchData({
          url: `/events/${eventId}`,
          method: "GET",
        }),
    });

  const { data: judges = [], isFetching } = useQuery<Judge[]>({
    queryKey: ["judges"],
    refetchOnWindowFocus: false,
    queryFn: () =>
      FetchData({
        url: `/judges`,
        method: "GET",
      }),
  });

  // mutation to assign judge
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: JudgeType) => {
      return FetchData({
        url: "/sessionjudges",
        method: "POST",
        data: [values],
      });
    },
    onSuccess: () => {
      showFeedback("Judge assigned successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["session-judges"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setHandleOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      sessionId: 0,
      judgeId: 0,
    },
    onSubmit: async (values: JudgeType) => {
      try {
        await mutateAsync(values);
        formik.resetForm();
      } catch (error) {
        console.error("Failed to assign:", error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return FetchData({
        url: `/sessionjudges/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      showFeedback("Judge deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["session-judges"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleDelete = async (id: number) => {
    try {
      console.log("Attempting to delete session judge ID:", id);
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Delete failed:", err);
      showFeedback("Delete failed. Please try again.", "failed");
    }
  };

  const handleOpenPopup = () => setHandleOpen(true);
  const handleClosePopup = () => setHandleOpen(false);

  // Table columns
  const tableColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "sessionName", headerName: "Session Name", flex: 1 },
    { field: "name", headerName: "Judge Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: { row: { id: number } }) => (
        <div className="actions">
          <BsPencilSquare className="edit-icon" />
          <BsTrashFill
            className="delete-icon"
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];

  // table rows
  const tableRows: TableRow[] =
    eventData.sessions?.flatMap((session) =>
      session.sessionJudges.map((sessionJudge) => ({
        id: sessionJudge?.judge.id,
        sessionName: session.name,
        name: sessionJudge.judge.name,
        email: sessionJudge.judge.email,
        phone: sessionJudge.judge.phone,
      }))
    ) || [];

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
              <DropDown
                label="Session"
                name="sessionId"
                value={formik.values.sessionId}
                onChange={(e) =>
                  formik.setFieldValue("sessionId", Number(e.target.value))
                }
                options={
                  eventData?.sessions?.map((session) => ({
                    label: session.name,
                    value: session.id,
                  })) || []
                }
              />

              <DropDown
                label="Judge"
                name="judgeId"
                value={formik.values.judgeId}
                onChange={(e) =>
                  formik.setFieldValue("judgeId", Number(e.target.value))
                }
                options={
                  judges?.map((judge) => ({
                    label: judge.name,
                    value: judge.id,
                  })) || []
                }
              />
            </>
          }
        />

        <Table columns={tableColumns} rows={tableRows} isLoading={isLoading} />
      </div>
    </div>
  );
};
