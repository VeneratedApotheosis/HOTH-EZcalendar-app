import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Match the exact shape your backend returns
export interface EventDetails {
  title: string;
  StartTime: string;
  EndTime: string;
  location: string;
}

interface CalendarContextType {
  events: EventDetails[];
  addEvents: (newEvents: EventDetails[]) => void;
  clearEvents: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventDetails[]>([]);

  // Function to merge new Gemini results with existing state
  const addEvents = (newEvents: EventDetails[]) => {
    setEvents((prev) => [...prev, ...newEvents]);
  };

  const clearEvents = () => setEvents([]);
  return <CalendarContext.Provider value={{ events, addEvents, clearEvents }}>{children}</CalendarContext.Provider>;
};

//Custom hook
export const useCalendarLocal = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
  return context;
};
