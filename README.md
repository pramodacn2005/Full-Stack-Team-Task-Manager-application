# Team Task Manager

A Full-Stack Team Task Manager application built with Node.js, Express, MongoDB, React (Vite), and Tailwind CSS.

## Features
- **User Authentication:** JWT-based signup and login.
- **Role-Based Access Control:** Admin vs Member permissions.
- **Project Management:** Admins can create projects and assign team members.
- **Task Management:** Create, assign, prioritize, and track task status.
- **Dashboard:** Visual overview of tasks and project status with charts.

## Prerequisites
- Node.js
- MongoDB (local or Atlas)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "Team Task Manager"
   ```

2. **Backend Setup:**
   - Go to the `backend` directory.
   - Run `npm install` to install dependencies.
   - Configure the environment variables in `backend/.env`:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
     JWT_SECRET=yoursupersecretjwtkey
     NODE_ENV=development
     ```

3. **Frontend Setup:**
   - Go to the `frontend` directory.
   - Run `npm install` to install dependencies.
   - The frontend connects to `http://localhost:5000/api` by default. This can be configured in `frontend/.env`.

4. **Running Locally:**
   From the root directory, install `concurrently` (if not installed automatically):
   ```bash
   npm install
   ```
   Then run the development command:
   ```bash
   npm run dev
   ```
   This will start both the backend server and the React frontend concurrently.

## Railway Deployment

This project is configured to be deployed easily on Railway.

1. Create a new Railway project and connect your GitHub repository.
2. Add a **MongoDB** plugin to your Railway project.
3. In the Railway project settings, add the following Environment Variables:
   - `MONGO_URI`: (Use the connection string provided by the Railway MongoDB plugin)
   - `JWT_SECRET`: (A secure random string)
   - `PORT`: 5000
4. Railway will automatically detect the root `package.json` and run the `build` script (`npm run build`), which installs frontend dependencies, builds the Vite app, and installs backend dependencies.
5. The `start` script will run `node backend/server.js`. 
   **Note for production:** You will need to configure Express in `backend/server.js` to serve the static files from `frontend/dist`. 

### Production Static Serving (If deployed as monorepo on Railway)
Add this to `backend/server.js` below your API routes:
```javascript
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}
```
