# PrepTrack 🚀
A full-stack MERN application designed to help students track their Data Structures and Algorithms (DSA) problem-solving progress for placement preparation.

## Features
- User Authentication: Secure registration and login using JWT.

- Problem Browser: Browse a master list of DSA problems, filterable by topic, difficulty, and search term.

- Personal Tracking: Add problems to a personal list and update their status (Solved, Attempted, etc.).

- Analytics Dashboard: Visualize progress with dynamic charts and progress rings.

- Dark/Light Mode: A theme toggle for user comfort.

- Responsive UI: Modern, mobile-friendly interface built with Material-UI.

## Tech Stack
- Frontend: React, Material-UI, Axios, Recharts

- Backend: Node.js, Express.js

- Database: MongoDB (with Mongoose)

- Authentication: JWT, bcryptjs

## Getting Started
### Prerequisites
    Node.js and npm: Download here

MongoDB Atlas Account: Get a free cloud database at MongoDB Atlas.

    Git

### Installation
Clone the repository

Bash

git clone ```<your_repository_url>```
```cd PrepTrack```
Install Backend Dependencies

Bash

```cd backend```
```npm install```
Install Frontend Dependencies

Bash

cd ../frontend
npm install
## Environment Setup
Backend
In the backend folder, create a new file named .env.

Add the following variables, replacing the placeholders with your own values.

Code snippet

MONGO_URI=```<your_mongodb_atlas_connection_string>/preptrackerDB
JWT_SECRET=your_super_secret_string_for_tokens
PORT=5000```
Frontend
In the frontend/package.json file, add the following line to proxy API requests to the backend server.

JSON

"proxy": "http://localhost:5000"
## Running the Application
You need to run both servers simultaneously in two separate terminals.

Start the Backend Server

Navigate to the backend directory.

Run the command:

Bash

``` npm run server ```
Start the Frontend Server

Navigate to the frontend directory.

Run the command:

Bash

```npm start```
The application will open at ```http://localhost:3000```