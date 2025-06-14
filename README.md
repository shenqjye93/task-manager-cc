# Full-Stack Task Manager

A complete task management web application built with PostgreSQL, Express.js, React, Node.js. This project is fully containerized with Docker for easy and consistent development and has been deployed to the cloud.

## Live Demo

- **Frontend:** [https://task-manager-frontend-0rbs.onrender.com](https://task-manager-frontend-0rbs.onrender.com/)
- **Backend API:** [https://task-manager-backend-9ork.onrender.com](https://task-manager-backend-9ork.onrender.com)

---

[Here's a screenshot showing the main interface of the Task Manager app.](assets/task-manager.png)

[Toggled view](assets/task-manager-toggle.png)

---

## Core Features

- **Full CRUD Functionality:** Create, Read, Update, and Delete tasks.
- **Advanced Filtering & Sorting:** Dynamically filter tasks by status and sort them by various criteria.
- **RESTful API:** A well-structured backend API built with Node.js and Express.
- **Secure Endpoints:** API is secured with a basic API Key authentication middleware.
- **Responsive Frontend:** A clean and responsive user interface built with React and Material-UI.
- **Containerized Environment:** The entire stack (frontend, backend, database) is containerized using Docker.
- **Live Deployment:** The application is deployed and live on Render.

---

## Tech Stack

| Category       | Technology                                          |
| :------------- | :-------------------------------------------------- |
| **Frontend**   | React.js, Material-UI, Axios                        |
| **Backend**    | Node.js, Express.js                                 |
| **Database**   | PostgreSQL                                          |
| **DevOps**     | Docker, Docker Compose, WSL 2                       |
| **Deployment** | Render (for Web Services, Static Site and Database) |

---

## Local Development Setup

There are two ways to run this project locally: using Docker (recommended for consistency) or running the services manually on your local machine.

### Prerequisites

- [Git]
- [Node.js] (v20 or higher)
- [Docker Desktop]
- npm

### Method 1: Docker Setup (Recommended)

This is the easiest and most reliable way to get the entire stack running, as it mirrors the production environment.

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/shenqjye93/task-manager-cc.git
    cd task-manager
    ```

2.  **Create the Environment File**
    Create a `.env` file in the project's root directory. This file will be used by `docker compose`. **Include this file in .gitignore and should not be committed.**

    ```
    # .env (in project root)
    DB_USER=myappuser
    DB_PASSWORD=mysecretpassword
    DB_DATABASE=task_manager_db
    DB_HOST=db
    DB_PORT=5432
    PORT=5000
    API_KEY=YOUR_SECRET_API_KEY
    ```

3.  **Build and Run the Containers**
    Use the modern `docker compose` command

    ```bash
    docker compose up --build
    ```

    This command will build the images for the frontend and backend and start all three services.

4.  **Initialize the Database**
    The first time you run the application, you need to create the tables in the database container. Open a **new terminal window** and run:

    ```bash
    docker compose exec db psql -U myappuser -d task_manager_db < server/database.sql
    ```

5.  **Access the Application**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:5000](http://localhost:5000)

### Method 2: Manual Local Setup (Without Docker)

This method requires you to have PostgreSQL and Node.js installed on your machine.

1.  **Setup the Database**

    - Install and start PostgreSQL on your local machine.
    - Create a user and a database:
      ```sql
      CREATE USER myappuser WITH PASSWORD 'mysecretpassword';
      CREATE DATABASE task_manager_db OWNER myappuser;
      ```
    - Run the schema creation script:
      ```bash
      psql -U myappuser -d task_manager_db < server/database.sql
      ```

2.  **Setup the Backend**

    - In a terminal, navigate to the `server/` directory.
    - Create a `.env` file with your local database credentials (see `server/.env` example).
    - Install dependencies and start the server:
      ```bash
      cd server
      npm install
      npm run dev
      ```

3.  **Setup the Frontend**
    - In a **new terminal**, navigate to the `client/` directory.
    - Install dependencies and start the React app:
      ```bash
      cd client
      npm install
      npm start
      ```

---

## API Endpoints

All endpoints are prefixed with `/api` and require an `X-API-Key` header for authentication.

| Method   | Endpoint     | Description                                    | Request Body (Example)                                    |
| :------- | :----------- | :--------------------------------------------- | :-------------------------------------------------------- |
| `GET`    | `/tasks`     | Get all tasks. Supports filtering and sorting. | N/A (Use query params: `?status=pending&sortBy=due_date`) |
| `POST`   | `/tasks`     | Create a new task.                             | `{ "title": "My New Task", "description": "Details..." }` |
| `PUT`    | `/tasks/:id` | Update an existing task.                       | `{ "title": "Updated Title", "status": "completed" }`     |
| `DELETE` | `/tasks/:id` | Delete a specific task.                        | N/A                                                       |

---

## Deployment

This application is deployed on **Render**. The deployment strategy is as follows:

- **Database:** Deployed as a **Render PostgreSQL** instance. This provides a managed, secure, and scalable database.
- **Backend:** Deployed as a **Render Web Service** using its `Dockerfile`. It connects to the database via the internal private network for security and speed.
- **Frontend:** Deployed as a **Render Static Site**. The React application is built into static HTML/CSS/JS files, which are served globally via Render's CDN for the best performance.

The repository is configured with "Deploy on Push," so any commits to the `master` branch will automatically trigger a new deployment on Render.
