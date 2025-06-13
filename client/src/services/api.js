import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API_KEY = "SECRET12345"; // Use the same key as in the backend .env

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
		"X-API-Key": API_KEY,
	},
});

export const getTasks = (params) => {
	// params could be { status: 'pending', sortBy: 'due_date', order: 'asc' }
	return apiClient.get("/tasks", { params });
};

export const createTask = (taskData) => {
	return apiClient.post("/tasks", taskData);
};

export const updateTask = (id, taskData) => {
	return apiClient.put(`/tasks/${id}`, taskData);
};

export const deleteTask = (id) => {
	return apiClient.delete(`/tasks/${id}`);
};
