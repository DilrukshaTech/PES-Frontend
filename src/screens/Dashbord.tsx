import { useQueryClient, useMutation } from "@tanstack/react-query";
import { SideBar } from "../components/sidebar/SideBar";
import { TopBar } from "../components/topbar/TopBar";
import { useAxios } from "../utils/useAxios";
import "./dashbord.scss";
import { Outlet } from "react-router-dom";
import { useFormik } from "formik";
import DropDown from "../components/input/DropDown";
import TextInput from "../components/input/TextInput";
import Popup from "../components/popup/Popup";
import { useState } from "react";
import Loading from "../components/loading/Loading";
import useFeedbackAlertStore from "../store/useFeedbackAlartStore";
type EventType = {
  id?: number;
  name: string;
  date: string;
  sessions?: number;
  status?: string;
};
export const Dashboard = () => {
  const { showFeedback } = useFeedbackAlertStore();
  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const { FetchData } = useAxios();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: EventType) => {
      const finalValues = {
        name: values.name,
        date: new Date(values.date).toISOString(),

        status: values.status || "Upcoming",
      };
      const response = await FetchData({
        url: "/events",
        method: "POST",
        data: finalValues,
      });
      return response;
    },
    onSuccess: () => {
      showFeedback("Event created successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setHandleOpen(false);
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      date: "",
      status: "upcoming",
    },
    onSubmit: async (values: EventType) => {
      try {
        await mutateAsync({
          name: values.name,
          date: values.date,
          status: values.status,
        });
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleOpenPopup = () => {
    setHandleOpen(true);
  };

  const handleClosePopup = () => {
    setHandleOpen(false);
  };
  return (
    <div id="dashbord">
      {isPending && <Loading />}
      <SideBar />
      <div className="dashbord-container">
        <TopBar handleOpen={handleOpenPopup} 
        
        />
        <Outlet />
        <Popup
          isOpen={handleOpen}
          handleClose={handleClosePopup}
          title="Create Event"
          btnText="Create Event"
          content={
            <>
              <TextInput
                label="Event Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                touched={formik.touched.name}
                error={formik.errors.name}
                type="text"
              />
              <TextInput
                name="date"
                value={formik.values.date}
                onChange={(e) => {
                  formik.setFieldValue("date", e.target.value);
                }}
                touched={formik.touched.date}
                error={formik.errors.date}
                type="date"
              />
              <DropDown
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                touched={formik.touched.status}
                error={formik.errors.status}
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "completed", label: "Completed" },
                  { value: "ongoing", label: "Ongoing" },
                  { value: "canceled", label: "Canceled" },
                ]}
              />
            </>
          }
          onClick={formik.handleSubmit}
        />
        
      </div>
    </div>
  );
};
