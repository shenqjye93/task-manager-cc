import React, { useState, useEffect, useCallback } from "react";
import { getTasks, deleteTask, createTask, updateTask } from "../services/api";
import {
	Box,
	Button,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const statusColors = {
	pending: "#fff3e0",
	"in-progress": "#e3f2fd",
	completed: "#e8f5e9",
};

const TaskList = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [newTitle, setNewTitle] = useState("");
	const [newStatus, setNewStatus] = useState("pending"); // Default to pending
	const [newDueDate, setNewDueDate] = useState("");
	const [filterStatus, setFilterStatus] = useState("");
	const [sortBy, setSortBy] = useState("created_at");
	const [sortOrder, setSortOrder] = useState("desc");
	const [editingTask, setEditingTask] = useState(null); // Holds the task object being edited
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
	const [taskToDeleteId, setTaskToDeleteId] = useState(null);

	const fetchTasks = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {
				status: filterStatus || undefined,
				sortBy,
				order: sortOrder,
			};
			const response = await getTasks(params);
			setTasks(response.data);
		} catch (err) {
			setError("Failed to fetch tasks. Is the server running?");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [filterStatus, sortBy, sortOrder]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const handleCreateTask = async (e) => {
		e.preventDefault();
		if (!newTitle.trim()) {
			alert("Title cannot be empty");
			return;
		}

		try {
			const newTaskData = {
				title: newTitle,
				status: newStatus,
				due_date: newDueDate || null, // Send null if the date is empty
				description: "",
			};

			await createTask(newTaskData);
			setNewTitle("");
			setNewStatus("pending");
			setNewDueDate("");

			fetchTasks();
		} catch (err) {
			console.error("Failed to create task", err);
		}
	};

	const handleOpenDeleteConfirm = (id) => {
		setTaskToDeleteId(id); // Store the ID of the task to be deleted
		setIsDeleteConfirmOpen(true); // Open the dialog
	};

	const handleCloseDeleteConfirm = () => {
		setIsDeleteConfirmOpen(false); // Close the dialog
		setTaskToDeleteId(null); // Clear the ID
	};

	const handleConfirmDelete = async () => {
		if (taskToDeleteId) {
			try {
				await deleteTask(taskToDeleteId);
				fetchTasks(); // Refresh the list after successful deletion
			} catch (err) {
				console.error("Failed to delete task", err);
				alert("Error: Could not delete the task.");
			} finally {
				handleCloseDeleteConfirm(); // Close the dialog whether it succeeded or failed
			}
		}
	};

	const handleOpenModal = (task) => {
		const formattedTask = {
			...task,
			due_date: task.due_date
				? new Date(task.due_date).toISOString().split("T")[0]
				: "",
		};
		setEditingTask(formattedTask);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingTask(null);
	};

	const handleUpdateTask = async () => {
		if (!editingTask) return;
		try {
			// The 'due_date' can be an empty string, which should be converted to null for the DB
			const taskToUpdate = {
				...editingTask,
				due_date: editingTask.due_date || null,
			};
			await updateTask(editingTask.id, taskToUpdate);
			handleCloseModal();
			fetchTasks();
		} catch (err) {
			console.error("Failed to update task", err);
		}
	};

	const handleEditFormChange = (e) => {
		const { name, value } = e.target;
		setEditingTask({ ...editingTask, [name]: value });
	};

	if (loading)
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	if (error)
		return (
			<Typography color="error" align="center">
				{error}
			</Typography>
		);

	return (
		<Box>
			<Box
				display="flex"
				justifyContent="space-between"
				mb={2}
				flexWrap="wrap"
				gap={2}
			>
				<FormControl sx={{ minWidth: 150 }}>
					<InputLabel>Status</InputLabel>
					<Select
						value={filterStatus}
						label="Status"
						onChange={(e) => setFilterStatus(e.target.value)}
					>
						<MenuItem value="">
							<em>All</em>
						</MenuItem>
						<MenuItem value="pending">Pending</MenuItem>
						<MenuItem value="non-pending">Non-Pending</MenuItem>
						<MenuItem value="in-progress">In Progress</MenuItem>
						<MenuItem value="completed">Completed</MenuItem>
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 150 }}>
					<InputLabel>Sort By</InputLabel>
					<Select
						value={sortBy}
						label="Sort By"
						onChange={(e) => setSortBy(e.target.value)}
					>
						<MenuItem value="created_at">Created Date</MenuItem>
						<MenuItem value="due_date">Due Date</MenuItem>
						<MenuItem value="title">Title</MenuItem>
						<MenuItem value="status">Status</MenuItem>
					</Select>
				</FormControl>

				<FormControl sx={{ minWidth: 120 }}>
					<InputLabel>Order</InputLabel>
					<Select
						value={sortOrder}
						label="Order"
						onChange={(e) => setSortOrder(e.target.value)}
					>
						<MenuItem value="desc">Descending</MenuItem>
						<MenuItem value="asc">Ascending</MenuItem>
					</Select>
				</FormControl>
			</Box>

			<Paper component="form" onSubmit={handleCreateTask} sx={{ p: 2, mb: 3 }}>
				<Typography variant="h6" gutterBottom>
					Add a New Task
				</Typography>
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={2}
					alignItems="center"
				>
					<TextField
						label="New Task Title"
						variant="outlined"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						required
						sx={{ flexGrow: 1, width: "100%" }}
					/>
					<FormControl sx={{ minWidth: 150, width: "100%" }}>
						<InputLabel>Status</InputLabel>
						<Select
							value={newStatus}
							label="Status"
							onChange={(e) => setNewStatus(e.target.value)}
						>
							<MenuItem value="pending">Pending</MenuItem>
							<MenuItem value="non-pending">Non-Pending</MenuItem>
							<MenuItem value="in-progress">In Progress</MenuItem>
							<MenuItem value="completed">Completed</MenuItem>
						</Select>
					</FormControl>
					<TextField
						label="Due Date"
						type="date"
						value={newDueDate}
						onChange={(e) => setNewDueDate(e.target.value)}
						InputLabelProps={{ shrink: true }}
						sx={{ minWidth: 150, width: "100%" }}
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						sx={{ height: "56px" }}
					>
						Add Task
					</Button>
				</Stack>
			</Paper>

			{/* Task List */}
			<List>
				{tasks.map((task) => (
					<ListItem
						key={task.id}
						secondaryAction={
							<>
								{/* --- UPDATED EDIT BUTTON --- */}
								<IconButton
									edge="end"
									aria-label="edit"
									onClick={() => handleOpenModal(task)}
								>
									<EditIcon />
								</IconButton>
								<IconButton
									edge="end"
									aria-label="delete"
									onClick={() => handleOpenDeleteConfirm(task.id)}
								>
									<DeleteIcon />
								</IconButton>
							</>
						}
						sx={{
							bgcolor: statusColors[task.status] || "background.paper",
							mb: 1,
							borderRadius: 1,
							transition: "background-color 0.3s ease-in-out",
						}}
					>
						<ListItemText
							primary={task.title}
							secondary={`Status: ${task.status} | Due: ${
								task.due_date
									? new Date(task.due_date).toLocaleDateString()
									: "N/A"
							}`}
						/>
					</ListItem>
				))}
			</List>
			<Dialog
				open={isDeleteConfirmOpen}
				onClose={handleCloseDeleteConfirm}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle
					id="alert-dialog-title"
					sx={{ display: "flex", alignItems: "center" }}
				>
					<WarningAmberIcon sx={{ mr: 1 }} color="warning" />
					Confirm Deletion
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to permanently delete this task? This action
						cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
					<Button
						onClick={handleConfirmDelete}
						color="error"
						variant="contained"
						autoFocus
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={isModalOpen}
				onClose={handleCloseModal}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Edit Task</DialogTitle>
				<DialogContent>
					{/* Use Stack for easy vertical spacing of form elements */}
					<Stack spacing={2} sx={{ mt: 1 }}>
						<TextField
							label="Title"
							name="title"
							value={editingTask?.title || ""}
							onChange={handleEditFormChange}
							fullWidth
						/>
						<TextField
							label="Description"
							name="description"
							value={editingTask?.description || ""}
							onChange={handleEditFormChange}
							multiline
							rows={4}
							fullWidth
						/>
						<FormControl fullWidth>
							<InputLabel>Status</InputLabel>
							<Select
								name="status"
								value={editingTask?.status || "pending"}
								label="Status"
								onChange={handleEditFormChange}
							>
								<MenuItem value="pending">Pending</MenuItem>
								<MenuItem value="non-pending">Non-Pending</MenuItem>
								<MenuItem value="in-progress">In Progress</MenuItem>
								<MenuItem value="completed">Completed</MenuItem>
							</Select>
						</FormControl>
						<TextField
							label="Due Date"
							name="due_date"
							type="date"
							value={editingTask?.due_date || ""}
							onChange={handleEditFormChange}
							InputLabelProps={{ shrink: true }} // Keeps label from overlapping the date
							fullWidth
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal}>Cancel</Button>
					<Button onClick={handleUpdateTask} variant="contained">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default TaskList;
