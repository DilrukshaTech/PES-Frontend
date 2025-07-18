import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventStore {
  eventId: string | null;
  setEventId: (id: string | null) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      eventId: null,
      setEventId: (id: string | null) => set({ eventId: id }),
    }),
    {
      name: "event-storage", // <- key in localStorage
    }
  )
);

