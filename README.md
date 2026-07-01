# 🎓 Student Portal Analytics System

A complete **serverless cloud application** built using **AWS** and **Microsoft Power BI**.

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![PowerBI](https://img.shields.io/badge/PowerBI-Dashboard-yellow)
![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-blue)

---

## Live Demo

🌐 Frontend:
[https://studentportal-frontend-sahal.s3.ap-south-1.amazonaws.com/index.html]

📊 Dashboard:
Power BI Desktop (.pbix included)

---
# 🎓 Student Portal Analytics System using AWS & Power BI

## 📖 Overview

The **Student Portal Analytics System** is a serverless cloud application built using **Amazon Web Services (AWS)** and **Microsoft Power BI**. It allows students to register, log in, and enroll in courses through a web-based portal.

Student data is stored in **Amazon DynamoDB** using **AWS Lambda** and **API Gateway**. A scheduled **EventBridge** rule automatically triggers a Lambda function every five hours to export the latest student data as a CSV file to **Amazon S3**. The exported data is then used in **Power BI** to create interactive dashboards and analytics.

This project demonstrates a complete serverless architecture, automated data pipeline, cloud storage, and business intelligence reporting using AWS services.

---

## Features

✅ Student Registration

✅ Student Login

✅ Course Enrollment

✅ AWS Lambda Backend

✅ Amazon DynamoDB

✅ API Gateway

✅ EventBridge Automation

✅ Automatic CSV Export

✅ Amazon S3

✅ Microsoft Power BI Dashboard

---

## Technologies

- HTML
- CSS
- JavaScript
- Python
- AWS Lambda
- API Gateway
- DynamoDB
- Amazon S3
- EventBridge
- IAM
- Power BI

---

## Screenshots

(Home)

(Login)

(Register)

(Dashboard)

(Power BI Dashboard)

(DynamoDB)

(AWS Lambda)

(EventBridge)

---

## Project Workflow

User

↓

Frontend (Amazon S3)

↓

API Gateway

↓

Lambda

↓

DynamoDB

↓

EventBridge (every 5 hours)

↓

Export Lambda

↓

students.csv

↓

Power BI Dashboard

---

## Folder Structure

(project tree)

---

## Future Improvements

- JWT Authentication
- Amazon RDS
- Email Notifications
- CI/CD
- Docker
- Terraform

---

## Author

Muhammed Sahal K K

Data Science Student
