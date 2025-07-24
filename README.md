
# Excellytics: Interactive Excel Data Visualization Platform

Excellytics is a powerful, full-stack MERN application designed to transform raw Excel data into beautiful, interactive 2D and 3D visualizations. Users can upload their Excel files, select data axes, and instantly generate a variety of charts to gain insights from their data. The platform features a secure, multi-user environment with a dedicated admin panel for user and system management.

## Table of Contents


- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)


## Features

* **Easy File Upload**: Drag-and-drop or browse to upload `.xls` and `.xlsx` files (up to 10MB).
* **Interactive Charting**:
    * Generate a variety of 2D charts (bar, line, pie, scatter) using Chart.js and Recharts.
    * Create stunning 3D column charts with Three.js.
    * Dynamically select X and Y axes to customize visualizations.
* **Data Analysis**: Automatic data type detection and insightful summaries.
* **Export Options**: Download charts as high-quality PNG or PDF files.
* **Secure User Authentication**: JWT-based authentication ensures user data is protected.
* **Personalized Dashboard**: Each user has a dashboard to view and manage their upload history and saved analyses.
* **Comprehensive Admin Panel**:
    * Role-based access control (admin/user).
    * Manage users (view, activate/deactivate, change roles).
    * Monitor system-wide data usage and view detailed analytics.
* **Responsive Design**: A clean, modern UI built with Tailwind CSS that works on all devices.

## Tech Stack

### Frontend

| Technology | Description |
| --- | --- |
| **React** | A JavaScript library for building user interfaces. |
| **React Router**| For declarative routing in a React app. |
| **Tailwind CSS** | A utility-first CSS framework for rapid UI development. |
| **Chart.js & Recharts** | For creating beautiful and interactive 2D charts. |
| **Three.js** | For creating stunning 3D visualizations. |
| **Axios** | A promise-based HTTP client for making API requests. |
| **React Dropzone** | For creating a drag-and-drop file upload zone. |
| **Lucide React** | A library of simply beautiful icons. |

### Backend

| Technology | Description |
| --- | --- |
| **Node.js** | A JavaScript runtime for building server-side applications. |
| **Express.js**| A fast, unopinionated, minimalist web framework for Node.js. |
| **Mongoose** | An Object Data Modeling (ODM) library for MongoDB and Node.js. |
| **MongoDB** | A NoSQL, document-oriented database. |
| **JWT** | JSON Web Tokens for secure authentication. |
| **Bcrypt.js** | A library for hashing passwords. |
| **Multer** | Middleware for handling `multipart/form-data`, used for file uploads. |

## Project Structure

The project is organized into two main folders: `excel-analytics-frontend` and `excel-analytics-backend`.

### Frontend Structure

```

excel-analytics-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── files/
│   │   ├── profile/
│   │   └── ...
│   ├── context/
│   ├── services/
│   ├── App.js
│   └── index.js
├── .env
└── package.json

```

### Backend Structure

```

excel-analytics-backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
├── package.json
└── server.js

````

## Getting Started

### Prerequisites

* Node.js (v14 or later)
* npm
* MongoDB (local or a cloud instance like MongoDB Atlas)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/excellytics.git](https://github.com/your-username/excellytics.git)
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd excellytics/excel-analytics-backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the `excel-analytics-backend` directory and add the following variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
5.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../excel-analytics-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `excel-analytics-frontend` directory and add the following:
    ```
    REACT_APP_API_URL=http://localhost:5000
    ```
4.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The application will be accessible at `http://localhost:3000`.

## Usage

1.  **Register a new account** or log in with an existing one.
2.  On the dashboard, **upload an Excel file**.
3.  Once the file is processed, you will be taken to the **File Viewer**.
4.  **Select the columns** for the X and Y axes to generate charts.
5.  **Explore the different chart types** available.
6.  **Download your charts** as PNG or PDF files.
7.  If you are an admin, you can access the **Admin Panel** to manage users.

## API Endpoints

A summary of the available API endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user. |
| POST | `/api/auth/login` | Log in a user and get a JWT. |
| GET | `/api/files` | Get all files for the logged-in user. |
| POST | `/api/files/upload` | Upload a new Excel file. |
| GET | `/api/files/:id` | Get details of a specific file. |
| DELETE | `/api/files/:id` | Delete a file. |
| GET | `/api/users` | (Admin) Get all users. |
| PATCH | `/api/users/:id/role` | (Admin) Update a user's role. |

## Contributing

Contributions are welcome! If you have suggestions for how to improve this project, please feel free to fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
````

http://googleusercontent.com/memory_tool_content/0
