const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(helmet()); // Set security headers
app.use(express.json()); // Middleware to parse JSON bodies

const allowList = [
	"http://localhost:3000",
	"https://task-manager-frontend-0rbs.onrender.com",
];

const corsOptions = {
	origin: function (origin, callback) {
		if (allowList.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};
app.use(cors(corsOptions)); // Enable CORS for all routes

// Basic API Key Security Middleware
const apiKeyAuth = (req, res, next) => {
	const apiKey = req.header("X-API-Key");
	if (apiKey && apiKey === process.env.API_KEY) {
		return next();
	}
	res.status(401).json({ error: "Unauthorized: dllm" });
};

// Apply the security middleware to all /api routes
app.use("/api", apiKeyAuth);

// --- Routes ---
app.get("/", (req, res) => {
	res.send(
		"<h1>Task Manager API</h1><p>Welcome! Are you sure the server is running.</p>"
	);
});

// GET /api/tasks - Get all tasks with filtering and sorting
app.get("/api/tasks", async (req, res) => {
	try {
		// Base query
		let queryText = "SELECT * FROM tasks";
		const queryParams = [];
		const whereClauses = [];

		// Filtering by status
		if (req.query.status) {
			queryParams.push(req.query.status);
			whereClauses.push(`status = $${queryParams.length}`);
		}

		// Add WHERE clauses to the query
		if (whereClauses.length > 0) {
			queryText += " WHERE " + whereClauses.join(" AND ");
		}

		// Sorting
		const sortBy = req.query.sortBy || "created_at"; // Default sort
		const order = req.query.order === "asc" ? "ASC" : "DESC"; // Default to DESC
		const allowedSortBy = ["title", "due_date", "status", "created_at"]; // Whitelist sortable columns

		if (allowedSortBy.includes(sortBy)) {
			let sortExpression = sortBy;

			if (sortBy === "title") {
				sortExpression = `LOWER(${sortBy})`;
			}

			queryText += ` ORDER BY ${sortExpression} ${order}`;
		}

		const { rows } = await db.query(queryText, queryParams);
		res.json(rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// POST /api/tasks - Create a new task
app.post("/api/tasks", async (req, res) => {
	try {
		const { title, description, status, due_date } = req.body;
		if (!title) {
			return res.status(400).json({ error: "Title is required" });
		}
		if (!status) {
			return res.status(400).json({ error: "Status is a required field." });
		}

		const allowedStatuses = [
			"pending",
			"non-pending",
			"in-progress",
			"completed",
		];
		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({
				error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
			});
		}

		const newTodo = await db.query(
			"INSERT INTO tasks (title, description, status, due_date) VALUES($1, $2, $3, $4) RETURNING *",
			[title, description, status, due_date]
		);
		res.status(201).json(newTodo.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// PUT /api/tasks/:id - Update a task
app.put("/api/tasks/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, status, due_date } = req.body;

		const updatedTask = await db.query(
			"UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4, updated_at = NOW() WHERE id = $5 RETURNING *",
			[title, description, status, due_date, id]
		);

		if (updatedTask.rows.length === 0) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.json(updatedTask.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// DELETE /api/tasks/:id - Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deleteTask = await db.query(
			"DELETE FROM tasks WHERE id = $1 RETURNING *",
			[id]
		);

		if (deleteTask.rowCount === 0) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.json({ message: "Task was deleted!" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
