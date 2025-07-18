import { useQuery } from "@tanstack/react-query";
import SecondaryBtn from "../buttons/SecondaryBtn";
import { Dropdown } from "../dropdown/Dropdown";
import { SearchBar } from "../search/SearchBar";
import "./_.scss";
import { FiSettings, FiUsers, FiFlag } from "react-icons/fi";
import { useAxios } from "../../utils/useAxios";
import { useEventStore } from "../../store/eventStore";

type TopBarProps = {
  handleOpen: () => void;
};

type EventType = {
  id?: number;
  name?: string;
};

export const TopBar = ({ handleOpen }: TopBarProps) => {
  const setEventId = useEventStore((state) => state.setEventId);
  const selectedEventId = useEventStore((state) => state.eventId);

  const { FetchData } = useAxios();

  const { data: events } = useQuery<EventType[]>({
    queryKey: ["events"],
    refetchOnWindowFocus: false,
    queryFn: () =>
      FetchData({
        url: "/events",
        method: "GET",
      }),
  });

  const handleEventChange = (selectedValue: string) => {
    setEventId(selectedValue);
  };

  return (
    <div id="topbar-container">
      <SecondaryBtn
        color="primary"
        size="large"
        variant="contained"
        title="New Event"
        onClick={handleOpen}
        styles={{
          textTransform: "none",
          textWrap: "nowrap",
          fontWeight: 500,
          fontSize: "15px",
          color: "#fff",
          padding: "9px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "nowrap",
          borderRadius: "8px",
        }}
      />

      <div className="searchbar">
        <SearchBar />
      </div>

      <div className="rightbar">
        <SecondaryBtn
          startIcon={<FiSettings />}
          size="large"
          variant="outlined"
          title="Settings"
          styles={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "15px",
            color: "#202224",
            padding: "9px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            boxShadow: "0px 0px 3.7px 1px rgba(0, 0, 0, 0.10)",
            border: "none",
          }}
        />

        <SecondaryBtn
          startIcon={<FiUsers />}
          size="large"
          variant="outlined"
          title="Invite"
          styles={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "15px",
            color: "#202224",
            padding: "9px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            boxShadow: "0px 0px 3.7px 1px rgba(0, 0, 0, 0.10)",
            border: "none",
          }}
        />

       <Dropdown
  styles={{
    padding: "9px 20px",
    boxShadow: "0px 0px 3.7px 1px rgba(0, 0, 0, 0.10)",
    width: "200px",
  }}
  label="Select Event"
  startIcon={<FiFlag />}
  options={Array.isArray(events)
  ? events.map((event) => ({
      label: event.name || "Unnamed Event",
      value: event.id?.toString() || "",
    }))
  : []
}

  value={selectedEventId || undefined} 
  onChange={handleEventChange}
/>

      </div>
    </div>
  );
};
