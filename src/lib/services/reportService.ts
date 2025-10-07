// src/services/reportsService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const downloadReport = async (type: "applications" | "events" | "progress" | "mentors") => {
  const response = await axios.get(`${API_URL}/reports/${type}`, {
    responseType: "blob",
    withCredentials: true, 
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${type}_report.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
