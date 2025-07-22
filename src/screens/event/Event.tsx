import "./event.scss";
import ongoingIcon from "../../assets/ongoing.png";
import completedIcon from "../../assets/completed.png";
import upcomingIcon from "../../assets/cancled.png";
import Table from "../../components/table/Table";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAxios } from "../../utils/useAxios";
import { BsTrashFill } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";
import Loading from "../../components/loading/Loading";
import useFeedbackAlertStore from "../../store/useFeedbackAlartStore";

type EventType = {
  id?: number;
  name: string;
  date: string;
  sessions?: number;
  status?: string;
};

export const Event: React.FC = () => {

  const { showFeedback } = useFeedbackAlertStore();
  const { FetchData } = useAxios();
  const queryClient = useQueryClient();

  const {
    data: events,
    isPending,
    isLoading,
    isFetching,
  } = useQuery<EventType[]>({
    enabled: true, // ensures the query runs when the component mounts
   
    queryKey: ["events"],
    queryFn: () =>
      FetchData({
        url: "/events",
        method: "GET",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await FetchData({
        url: `/events/${id}`,
        method: "DELETE",
      });
    },
    onSuccess: () => {
      showFeedback("Event deleted successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      showFeedback("Failed to delete event. Please try again.", "failed");
    },
  });

 const handleDelete = async (id: number) => {
  try {

    await deleteMutation.mutateAsync(id);
  } catch (err) {
    console.error("Delete failed:", err);
    showFeedback("Delete failed. Check for related sessions.", "failed");
  }
};


  const tableColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Event Name", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    {
      field: "sessions",
      headerName: "No of Sessions",
      width: 150,
      renderCell: (params: { row: { sessions: number } }) => (
        <span>{params.row.sessions || 0}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params: { row: { status: string } }) => {
        let statusClass = "";
        switch (params.row.status?.toLocaleUpperCase()) {
          case "compleated":
            statusClass = "status-completed";
            break;
          case "ongoing":
            statusClass = "status-ongoing";
            break;
          case "canceled":
            statusClass = "status-canceled";
            break;
          case "upcoming":
          default:
            statusClass = "status-upcoming";
            break;
        }
        return <span className={statusClass}>{params.row.status}</span>;
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
     renderCell: (params: { row: { id: number } }) => (
  <div className="actions">
    <BsPencilSquare
      className="edit-icon"
      onClick={(e) => {
        e.stopPropagation(); // prevent row click
        console.log("Edit clicked");
      }}
    />
    <BsTrashFill
      className="delete-icon"
      onClick={(e) => {
        e.stopPropagation(); 
        handleDelete(params.row.id);
      }}
    />
  </div>
),

    },
  ];

  const tableRows =
    Array.isArray(events) && events.length > 0
      ? events.map((event) => ({
          id: event.id,
          name: event.name,
          date: new Date(event.date).toLocaleDateString(),
          sessions: Array.isArray(event.sessions)
            ? event.sessions.map((session) => session.id).length
            : 0,
          status: event.status?.toLocaleUpperCase() || "Upcoming",
        }))
      : [];

  return (
    <div id="event-container">
      {(isPending || isFetching) && 
      
      setTimeout(() => {
       <Loading />
      }, 1000)}
  
    
      <div className="summary">
        <div className="block">
          <div className="content">
            <h3>Ongoing Events</h3>
            <p>{tableRows.filter((row) => row.status === "ONGOING").length}</p>
          </div>
          <div className="icon">
            <img src={ongoingIcon} alt="Ongoing Events" />
          </div>
        </div>
        <div className="block">
          <div className="content">
            <h3>Compleated Events</h3>
            <p>
              {tableRows.filter((row) => row.status === "COMPLETED").length}
            </p>
          </div>
          <div className="icon">
            <img src={completedIcon} alt="Completed Events" />
          </div>
        </div>
        <div className="block">
          <div className="content">
            <h3>Canceled Events</h3>
            <p>{tableRows.filter((row) => row.status === "CANCELED").length}</p>
          </div>
          <div className="icon">
            <img src={upcomingIcon} alt="Upcoming Events" />
          </div>
        </div>
        <div className="block">
          <div className="content">
            <h3>Upcoming Events</h3>
            <p>{tableRows.filter((row) => row.status === "UPCOMING").length}</p>
          </div>
          <div className="icon">
            <img src={upcomingIcon} alt="Upcoming Events" />
          </div>
        </div>
      </div>

      <div className="table">
        <Table
          columns={tableColumns}
          rows={tableRows}
          isLoading={isLoading}
          onRowClick={(row) => console.log("Row clicked:", row)}
        />
      </div>
    </div>
  );
};
