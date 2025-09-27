# PrepTrack 🚀

A full-stack MERN application designed to help students track their Data Structures and Algorithms (DSA) problem-solving progress for placement preparation.



---
## Key Features

* **📊 Dynamic Analytics Dashboard:**
    * KPI cards for at-a-glance stats (Total Tracked, Solved, Solving Rate).
    * Donut chart for Status Breakdown (Solved, Attempted, Not Attempted).
    * Bar chart visualizing Tracked vs. Solved problems by difficulty.
    * Daily Challenge that updates automatically every day at midnight.

* **🔍 Advanced Problem Browser:**
    * A separate, highlighted section for mandatory "Blind 75" interview questions.
    * Modern "glassmorphism" UI with interactive hover effects on problem cards.
    * Dynamic client-side filtering by Topic, Difficulty, and Search term.

* **✅ Personal Problem Management:**
    * Dedicated "My Problems" page to view all tracked questions.
    * Horizontal filters to sort tracked problems by Category, Difficulty, and Status.
    * Simple one-click checkbox to update a problem's status to "Solved".

* **💼 Live Job Search:**
    * Integrated with a third-party API (Adzuna) to search for thousands of real tech jobs.
    * Dynamic filters for Job Title and Location that update results automatically.
    * Pagination to browse through multiple pages of job listings.

* **⚙️ Core Functionality:**
    * Secure user authentication with JWT.
    * Dark/Light mode toggle with preference saved in the browser.
    * Fully responsive design built with Material-UI.

---
## Screenshots

| Dynamic Dashboard                                     | Advanced Problem Browser                               |
| ----------------------------------------------------- | ------------------------------------------------------ |
|  |  |
| **Personal Problem Management** | **Live Job Search** |
|    |      |


---
## Tech Stack

* **Frontend:** React, Material-UI, Axios, Recharts
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JWT, bcryptjs

---
## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

* **Node.js and npm:** [Download here](https://nodejs.org/)
* **MongoDB Atlas Account:** Get a free cloud database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
* **Git**

### Installation

1.  **Clone the repository**
    ```sh
    git clone <your_repository_url>
    cd PrepTrack
    ```

2.  **Install Backend Dependencies**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```sh
    cd ../frontend
    npm install
    ```

---
## Environment Setup

#### Backend

In the `backend` folder, create a new file named `.env` and add the following variables.

```env
# Your MongoDB Atlas connection string.
MONGO_URI=<your_mongodb_atlas_connection_string>/preptrackerDB

# A secret key for signing JWT tokens.
JWT_SECRET=your_super_secret_string_for_tokens

# The port for the backend server.
PORT=5000

# Get these from [https://developer.adzuna.com/](https://developer.adzuna.com/)
ADZUNA_APP_ID=<your_adzuna_app_id>
ADZUNA_APP_KEY=<your_adzuna_app_key>

```
### Frontend
In the frontend/package.json file, add the following line to proxy API requests to the backend server.
```
JSON
    "proxy": "http://localhost:5000"
```

## Running the Application
You need to run both servers simultaneously in two separate terminals.

1. Start the Backend Server
(In the ```/backend``` directory)
```
    nodemon
```
2. Start the Frontend Server
(In the ```/frontend``` directory)
```
    npm start
```
The application will open at ```http://localhost:3000```