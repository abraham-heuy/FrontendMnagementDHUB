import type { Event, EventFormData } from "../types/events";

const API_URL = import.meta.env.VITE_API_URL;

export const getEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${API_URL}/events/`);
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }
  const data = await res.json();

  // Ensure we always return an array
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.events)) {
    return data.events;
  }

  throw new Error("Unexpected response format for events");
};

export const createEvent = async (data: EventFormData): Promise<Event> => {
  const res = await fetch(`${API_URL}/events/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create event");
  }
  return res.json();
};

export const updateEvent = async (
  id: string,
  data: EventFormData
): Promise<Event> => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update event");
  }
  return res.json();
};

export const deleteEvent = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete event");
  }
};


//filter events based on the category: 
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  const res = await fetch(`${API_URL}/events/category/${category}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch events in category: ${category}`);
  }
  const data = await res.json();

  // Normalize to always return an array
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.events)) {
    return data.events;
  }

  throw new Error("Unexpected response format for events by category");
};


// add to your existing service file
export const getRoles = async (): Promise<{ id: string; name: string }[]> => {
  const res = await fetch(`${API_URL}/events/roles`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch roles");
  const data = await res.json();
  // data.roles expected
  return Array.isArray(data.roles) ? data.roles : [];
};

export type StageDto = {
  stage_id: string;
  name: string;
  order: number;
  substages?: { substage_id: string; name: string; order: number }[];
};

export const getStages = async (): Promise<StageDto[]> => {
  const res = await fetch(`${API_URL}/events/stages`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch stages");
  const data = await res.json();
  return Array.isArray(data.stages) ? data.stages : [];
};
