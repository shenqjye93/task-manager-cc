import React from "react";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Re-use the same status color mapping
const statusColors = {
	pending: "#fff3e0",
	"in-progress": "#e3f2fd",
	completed: "#e8f5e9",
};

const TaskCard = ({ task, onEdit, onDelete }) => {
	return (
		<Card
			sx={{
				mb: 2,
				backgroundColor: statusColors[task.status] || "background.paper",
			}}
		>
			<CardContent>
				<Typography variant="h6" component="div" sx={{ mb: 1 }}>
					{task.title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Due:{" "}
					{task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
				</Typography>
				<Typography variant="caption" color="text.secondary">
					Status: {task.status}
				</Typography>
			</CardContent>
			<CardActions sx={{ justifyContent: "flex-end" }}>
				<IconButton size="small" onClick={() => onEdit(task)}>
					<EditIcon />
				</IconButton>
				<IconButton size="small" onClick={() => onDelete(task.id)}>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
};

export default TaskCard;
