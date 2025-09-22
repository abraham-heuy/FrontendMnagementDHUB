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
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create event");
  }
  return res.json();
};

export const updateEvent = async (
  id: number,
  data: EventFormData
): Promise<Event> => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update event");
  }
  return res.json();
};

export const deleteEvent = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
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
