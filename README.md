# Task Manager

A full-stack task management application built with **React** on the frontend and **Spring Boot** on the backend.  
It allows users to register/login, create tasks, update tasks, delete tasks, and manage task stages across **Todo**, **In Progress**, and **Done**.

## Features

- User authentication with login/signup
- Create new tasks
- Edit existing tasks
- Delete tasks
- Move tasks between stages
- Dashboard with grouped task columns
- Task count summary cards
- Protected dashboard route for authenticated users

## Tech Stack

### Frontend
- React
- React Router DOM
- Axios
- Vite
- Inline CSS / custom styling

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- MySQL

## Project Structure

```text
TaskManager/
│
├── frontend/        # React frontend
└── backend/         # Spring Boot backend
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

### 3. Run backend

```bash
cd backend
./mvnw spring-boot:run
```

or on Windows:

```bash
mvnw spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

## API Overview

Main backend endpoints used in the project:

- `POST /auth/register` → Register user
- `POST /auth/login` → Login user
- `GET /api/v1/tasks` → Fetch all tasks
- `POST /api/v1/tasks` → Create task
- `PUT /api/v1/tasks/{id}` → Update task
- `DELETE /api/v1/tasks/{id}` → Delete task
- `PATCH /api/v1/tasks/{id}/stage` → Update task stage

## Assumptions

- Each user manages only their own tasks.
- Authentication token is stored in local storage for session persistence.
- Task stages supported by backend enum are:
  - `TODO`
  - `IN_PROGRESS`
  - `COMPLETED`
- The UI displays `COMPLETED` tasks under the **Done** column.
- The backend is assumed to be running correctly with database configuration already set.

## Tradeoffs

- I used **inline styling** in React for faster development and simpler component-level styling instead of using Tailwind or CSS modules.
- I kept the frontend logic inside the dashboard page first to complete required CRUD functionality quickly before doing deeper component refactoring.
- I implemented button-based stage movement instead of drag-and-drop to keep the solution simpler, stable, and easier to evaluate.
- Token storage is handled through local storage for simplicity, although in production a more secure cookie/session-based approach would be preferred.
- Error handling is kept straightforward and user-visible rather than building a larger notification/toast system.

## Technical Decisions

- **React + Vite** was chosen for a fast and lightweight frontend development experience.
- **Spring Boot** was used for backend development because it provides strong support for REST APIs, security, and database integration.
- **JWT authentication** was used to secure task operations and protect the dashboard route.
- **useMemo** was used on the frontend to group tasks efficiently into Todo, In Progress, and Done columns.
- The backend enum uses `COMPLETED` while the UI shows `Done`; this mapping keeps the interface user-friendly without changing backend semantics.
- CRUD operations were implemented first, followed by stage movement and dashboard improvements, to prioritize assignment completeness.

## Challenges Faced

- Matching frontend task stage values with backend enum values correctly.
- Handling authenticated API requests with JWT.
- Preventing dashboard crashes caused by undefined props during rendering.
- Managing frontend and backend integration while keeping the project structure simple.

## Future Improvements

- Add drag-and-drop task movement
- Add due dates and priorities
- Add search and filtering
- Improve responsive design further
- Add toast notifications
- Deploy backend publicly with database hosting
- Add unit and integration tests

## Submission Notes

This project was developed to satisfy the assignment requirements of:
- full-stack implementation
- GitHub repository with proper README
- assumptions, tradeoffs, and technical decisions

## Author

**Siddhant Sinha**
- GitHub: [https://github.com/Siddhant444-dev](https://github.com/Siddhant444-dev)
