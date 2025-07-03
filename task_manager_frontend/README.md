# Task Manager Frontend (React)

This is the frontend web application for managing tasks. It provides a modern, lightweight user interface for users to register, log in, and manage tasks via integration with the Task Manager FastAPI backend.

---

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [Backend API Integration](#backend-api-integration)
- [Architecture & Design](#architecture--design)
- [Environment Variables](#environment-variables)
- [Customization](#customization)

---

## Features

- User registration and login
- Persistent JWT-based session (stored in localStorage)
- Task CRUD: create, edit, delete, view, and mark tasks as completed
- Responsive dashboard layout with sidebar navigation and topbar
- Modern, minimal styling, dark/light theme toggle

---

## Setup Instructions

1. **Navigate to the frontend directory:**

    ```bash
    cd task_manager_frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Setup connection to backend:**

    - By default, the frontend connects to the backend at `http://localhost:3001`.
    - To change, create a `.env` file:
        ```
        REACT_APP_API_ROOT=http://your-backend-url:PORT
        ```

4. **Start the development server:**

    ```bash
    npm start
    ```

    The app will open at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

- `npm start` – Runs the app in development mode.
- `npm run build` – Builds the app for production into the `build` folder.
- `npm test` – Launches the test runner.

---

## Backend API Integration

The frontend interacts with the backend REST API described in the [backend README](../task_manager_backend/README.md). All API calls are centralized in `src/services/api.js` for easy maintenance.

### Major API Calls (via `api.js`):

- **Authentication**
    - `loginUser(email, password)`
    - `registerUser(email, password)`
- **Tasks**
    - `fetchTasks(token)` — Get user's tasks
    - `createTask(data, token)` — Add a new task
    - `getTask(id, token)` — Get single task details
    - `updateTask(id, data, token)` — Edit a task
    - `deleteTask(id, token)` — Delete a task

All API requests for tasks require the JWT token in the `Authorization` header. Authentication and registration responses include or expect the JWT access token.

#### Error Handling & Loading

- API calls return both `error` and data, and all pages have error and loading state handling.
- Expired, invalid, or missing JWT automatically blocks access to protected routes (handled with context + React Router).

---

## Architecture & Design

- **Component Hierarchy**
    - `App.js` sets up global routing, authentication context (`AuthProvider`), and theme.
    - Routes are protected using the `ProtectedRoute` wrapper (redirects to login if not authenticated).
    - Dashboard-oriented layout (sidebar + topbar + content) via `DashboardLayout` component.
    - Pages in `src/pages/`: `Login`, `Register`, `TaskList`, `TaskDetail`, `TaskEdit`.

- **State Management**
    - Auth state (token, user info, error/loading) is managed in React Context (`services/auth.js`).
    - Task data is managed via React local state in page components, fetched as needed.

- **API Layer**
    - `services/api.js`: All network requests and error handling.
    - `services/auth.js`: Auth context, login/register/logout, JWT in storage.

- **Theming and Customization**
    - Theme is togglable (light/dark), persists for the session.
    - Main brand colors and appearance are managed via CSS variables in `src/App.css`.

#### Core Frontend Architecture (Mermaid)

```mermaid
flowchart TD
    App[[App.js]]
    AuthProvider[[AuthProvider (Context)]]
    Router[[React Router (Routes)]]
    Login[[Login Page]]
    Register[[Register Page]]
    TaskList[[TaskList Page]]
    TaskEdit[[TaskEdit Page]]
    TaskDetail[[TaskDetail Page]]
    Layout[[DashboardLayout]]
    API[[api.js]]
    Backend((FastAPI Backend))

    App --> AuthProvider
    AuthProvider --> Router
    Router --> Login
    Router --> Register
    Router --> TaskList
    Router --> TaskEdit
    Router --> TaskDetail
    Router --> Layout
    Login --> API
    Register --> API
    TaskList --> API
    TaskEdit --> API
    TaskDetail --> API
    API --> Backend
```

---

## Environment Variables

- `REACT_APP_API_ROOT`: Set the backend API URL (default: `http://localhost:3001`).

---

## Customization

- **Styling/Theme:** Edit variables in `src/App.css` for easy color updates.
- **Layout:** Sidebar/menu can be changed in `DashboardLayout.js`.
- **API Root:** Configure backend endpoint in `.env`.
- **Component Modification:** All UI is built with lightweight, plain React and CSS—easy to extend.

---

## Useful Resources

- [React documentation](https://reactjs.org/)
- [FastAPI documentation](https://fastapi.tiangolo.com/)
- [Project Backend README](../task_manager_backend/README.md)

---
