# 🎓 Student Portal Analytics System (AWS + Power BI)

A complete serverless cloud application built using AWS and Power BI.

This project demonstrates how to collect student registration data, store it in DynamoDB, automatically export it to Amazon S3 using AWS Lambda and EventBridge, and visualize the data in Microsoft Power BI.

---

# 🚀 Project Overview

The application allows students to:

- Register an account
- Login securely
- Enroll in courses
- Store student information in DynamoDB
- Automatically export data to Amazon S3 every 5 hours
- Analyze data using Microsoft Power BI

---

# 🏗️ Architecture

```
Student Browser
       │
       ▼
Frontend (HTML, CSS, JavaScript)
       │
       ▼
Amazon S3 (Static Website Hosting)
       │
       ▼
Amazon API Gateway
       │
       ▼
AWS Lambda Functions
       │
       ▼
Amazon DynamoDB
       │
       ▼
AWS Lambda (Export Students)
       │
       ▼
Amazon S3 (students.csv)
       │
       ▼
Microsoft Power BI
```

---

# ☁️ AWS Services Used

- Amazon S3
- AWS Lambda
- Amazon DynamoDB
- Amazon API Gateway
- Amazon EventBridge
- AWS IAM

---

# 💻 Technologies

- HTML5
- CSS3
- JavaScript
- Python
- Boto3
- AWS Cloud
- Power BI

---

# 📁 Project Structure

```
Mini Cloud Project
│
├── public
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── courses.html
│
├── lambda
│   ├── register
│   ├── login
│   ├── enrollCourse
│   └── exportStudentsToCSV
│
├── powerbi
│   └── StudentPortalDashboard.pbix
│
├── screenshots
│
├── docs
│
├── README.md
├── .gitignore
└── LICENSE
```

---

# ⚙️ Features

- Student Registration
- Student Login
- Course Enrollment
- DynamoDB Database
- CSV Export
- Automatic Scheduled Export
- Power BI Dashboard
- KPI Cards
- Interactive Visualizations

---

# 🔄 Data Flow

1. User registers.
2. API Gateway invokes Lambda.
3. Lambda stores data in DynamoDB.
4. EventBridge triggers Export Lambda every 5 hours.
5. Lambda exports all records into students.csv.
6. CSV is stored in Amazon S3.
7. Power BI reads the CSV.
8. Dashboard refreshes with latest data.

---

# 📊 Dashboard KPIs

- Total Students
- Total Courses
- Students by City
- Students by Age
- Course Distribution
- Learning Goals
- Daily Registrations

---

# 📷 Screenshots

Add screenshots of:

- AWS Architecture
- DynamoDB Table
- Lambda Functions
- EventBridge Schedule
- Amazon S3
- Power BI Dashboard

---

# 👨‍💻 Author

Muhammed Sahal K K

Data Science Student

Cloud Computing | AWS | Power BI | Python | SQL

---

# ⭐ Future Improvements

- Amazon RDS Integration
- User Authentication (JWT)
- Email Notifications
- Power BI Automatic Refresh
- Amazon QuickSight Dashboard
- CI/CD Deployment