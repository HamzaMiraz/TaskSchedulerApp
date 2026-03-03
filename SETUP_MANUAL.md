# 🚀 Task Tracker - Full Project Setup Guide

Welcome! This guide will help you set up and run the **Task Tracker App** on your local machine. Even if you're new to coding, just follow these steps in order.

---

## 🛠 Prerequisites

Before starting, make sure you have the following installed:

1.  **[Node.js](https://nodejs.org/)** (Recommended: v18 or newer)
2.  **.NET SDK** (Recommended: .NET 8.0 or 10.0)
3.  **[XAMPP](https://www.apachefriends.org/index.html)** (For the MySQL database)
4.  **[VS Code](https://code.visualstudio.com/)** 


---

## 1️⃣ Step 1: Start the Database (MySQL)

We use XAMPP to run the database.

1.  Open the **XAMPP Control Panel**.
2.  Click the **Start** button next to **MySQL**.
3.  *(Optional)* Click **Start** next to **Apache** if you want to use the web-based database manager (`phpMyAdmin`).
4.  Once the "MySQL" label turns green, your database engine is ready!

---

## 2️⃣ Step 2: Choose Your Database Setup

Do you want to use existing data or start fresh?

### **Option A: Copy Existing Data (Recommended if you have a backup)**
If you have a database file (e.g., `task_tracker_db.sql`) from another PC:
1.  Go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
2.  Create a new database named `task_tracker_db`.
3.  Click the **Import** tab at the top.
4.  Choose your `.sql` file and click **Go/Import**.

### **Option B: Start Fresh (Easiest)**
If you don't have an existing database, **do nothing!** The app is configured to automatically create the database and all required tables for you the first time you run it.

---

## 3️⃣ Step 3: Run the Project

You can run the project using the "Easy Way" or the "Manual Way".

### ** Must be Fallow Step 1 (Start the Database (MySQL))**

### **The Easy Way (One-Click)**
1.  Open the main project folder.
2.  Find the file named **`RUN_PROJECT.bat`**.
3.  **Double-click it!**
4.  It will automatically start the Backend, Frontend, and open your browser to the Dashboard.

### **The Manual Way (If the One-Click fails)**

#### **A. Set Up the Backend (.NET)**
1.  Open your terminal/command prompt.
2.  Navigate to your project's `TaskBackend` folder (Right-click folder -> Open in Terminal).
3.  Run the backend:
    ```powershell
    dotnet run
    ```
4.  Wait for the terminal to show `Now listening on: http://localhost:5xxx`. 

#### **B. Set Up the Frontend (Angular)**
1.  Open a **NEW** terminal tab.
2.  Navigate to your project's `TaskFrontend` folder.
3.  Install dependencies (only needed once):
    ```powershell
    npm install
    ```
4.  Start the development server:
    ```powershell
    npm start
    ```
5.  Open your browser and go to: **[http://localhost:4200](http://localhost:4200)**

---

## ✅ You're All Set!

You should now see the Task Tracker app running in your browser. 

### 💡 Troubleshooting
*   **Database Error?** Make sure MySQL is running in XAMPP.
*   **Frontend not loading data?** Ensure the Backend terminal is still running.
*   **Port already in use?** Close any other programs using port 4200 or 5000/5001.

---


