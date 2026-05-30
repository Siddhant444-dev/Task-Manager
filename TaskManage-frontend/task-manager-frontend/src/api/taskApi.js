import axios from "axios";

const TASK_API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTasks = (token) =>
  TASK_API.get("/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createTask = (token, data) =>
  TASK_API.post("/tasks", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const updateTask = (token, id, data) =>
  TASK_API.put(`/tasks/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const updateTaskStage = (token, id, data) =>
  TASK_API.patch(`/tasks/${id}/stage`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const deleteTask = (token, id) =>
  TASK_API.delete(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default TASK_API;