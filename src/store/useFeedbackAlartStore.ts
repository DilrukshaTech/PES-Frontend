import { create } from "zustand";

interface FeedbackAlertState {
  msg: string;
  type: "success" | "failed" | "";
  visible: boolean;
  showFeedback: (msg: string, type: "success" | "failed") => void;
  hideFeedback: () => void;
}

const useFeedbackAlertStore = create<FeedbackAlertState>((set) => ({
  msg: "",
  type: "",
  visible: false,
  showFeedback: (msg, type) => set({ msg, type, visible: true }),
  hideFeedback: () => set({ msg: "", type: "", visible: false }),
}));

export default useFeedbackAlertStore;