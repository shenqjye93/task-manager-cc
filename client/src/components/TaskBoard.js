// In client/src/components/TaskBoard.js

import React, { useMemo } from "react";
// --- 1. IMPORT Stack, and we no longer need Grid ---
import { Box, Typography, Paper, Stack } from "@mui/material";
import TaskCard from "./TaskCard";

const Column = ({ title, children }) => (
	<Paper
		sx={{
			p: 2,
			height: "100%",
			backgroundColor: "#f5f5f5",
			display: "flex",
			flexDirection: "column",
		}}
	>
		<Typography variant="h6" gutterBottom align="center">
			{title}
		</Typography>
		<Box sx={{ flexGrow: 1 /* Allows this box to grow and fill space */ }}>
			{children}
		</Box>
	</Paper>
);

const TaskBoard = ({ tasks, onEdit, onDelete }) => {
	// ... (your useMemo for calculating columns remains exactly the same)
	const columns = useMemo(() => {
		const pending = tasks.filter((task) => task.status === "pending");
		const inProgress = tasks.filter((task) => task.status === "in-progress");
		const completed = tasks.filter((task) => task.status === "completed");
		const nonPending = tasks.filter((task) => task.status === "non-pending");

		const threeDaysFromNow = new Date();
		threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
		const dueSoon = tasks.filter((task) => {
			if (!task.due_date || task.status === "completed") return false;
			const dueDate = new Date(task.due_date);
			return dueDate <= threeDaysFromNow;
		});

		return { pending, inProgress, completed, nonPending, dueSoon };
	}, [tasks]);

	// --- 2. REPLACE Grid container with Stack ---
	return (
		<Stack
			direction={{ xs: "column", md: "row" }} // Stacks vertically on small screens, horizontally on medium+
			spacing={2} // This uses the modern `gap` property
			sx={{ width: "100%" }}
		>
			{/* --- 3. EACH "COLUMN" IS NOW A DIRECT CHILD OF THE STACK --- */}
			{/* We tell each child to take up an equal amount of space */}
			<Box sx={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
				<Column title="Pending">
					{columns.pending.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</Column>
			</Box>
			<Box sx={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
				<Column title="In Progress">
					{columns.inProgress.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</Column>
			</Box>
			<Box sx={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
				<Column title="Non-Pending">
					{columns.nonPending.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</Column>
			</Box>
			<Box sx={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
				<Column title="Due Soon">
					{columns.dueSoon.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</Column>
			</Box>
			<Box sx={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
				<Column title="Completed">
					{columns.completed.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</Column>
			</Box>
		</Stack>
	);
};

export default TaskBoard;
