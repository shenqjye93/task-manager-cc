# Full-Stack Task Manager

A simple web application for managing tasks, built with the PERN stack (PostgreSQL, Express, React, Node.js) and containerized with Docker.

## Core Features

- Create, Read, Update, and Delete (CRUD) tasks.
- Filter tasks by status (`pending`, `in-progress`, `completed`).
- Sort tasks by title, due date, status, or creation date.
- Responsive UI built with Material-UI.
- Secure API endpoints with a basic API key authentication.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Material-UI
- **Database**: PostgreSQL
- **Deployment**: Docker, Docker Compose

---

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- A running [PostgreSQL](https://www.postgresql.org/) instance (for local setup without Docker)

### 1. Docker Setup (Recommended)

This is the easiest way to get the entire stack running.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/task-manager.git
    cd task-manager
    ```

2.  **Create an environment file:**
    Create a `.env` file in the root directory and copy the contents from the backend `server/.env` example. This file will be used by `docker-compose`.

    ```
    # .env (in project root)
    DB_USER=postgres
    DB_HOST=db
    DB_DATABASE=task_manager_db
    DB_PASSWORD=mysecretpassword
    DB_PORT=5432
    PORT=5000
    API_KEY=YOUR_SUPER_SECRET_API_KEY
    ```

3.  **Build and run the containers:**

    ```bash
    docker-compose up --build
    ```

4.  **Initialize the database:**
    In a new terminal, while the containers are running, execute the SQL script to create the table.

    ```bash
    docker-compose exec db psql -U postgres -d task_manager_db < server/database.sql
    ```

5.  **Access the application:**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:5000/api/tasks](http://localhost:5000/api/tasks)

### 2. Local Setup (Without Docker)

Follow these steps if you prefer to run the services locally.

_Instructions for setting up the server and client locally would go here..._

---

## Simple API Documentation

All endpoints require an `X-API-Key` header for authentication.

| Method   | Endpoint         | Description                                    | Query Params                | Request Body (JSON)                         |
| -------- | ---------------- | ---------------------------------------------- | --------------------------- | ------------------------------------------- |
| `GET`    | `/api/tasks`     | Get all tasks. Supports filtering and sorting. | `status`, `sortBy`, `order` | N/A                                         |
| `POST`   | `/api/tasks`     | Create a new task.                             | N/A                         | `{ "title": "...", "description": "..." }`  |
| `PUT`    | `/api/tasks/:id` | Update an existing task.                       | N/A                         | `{ "title": "...", "status": "completed" }` |
| `DELETE` | `/api/tasks/:id` | Delete a task.                                 | N/A                         | N/A                                         |
