# Stock Market Web Application

This is a full-stack stock market visualization and CRUD application built using React, FastAPI, MySQL, and Docker. The project includes both a standard SQL model deployment and a Dockerized deployment. Each part of the project is hosted on separate cloud services to demonstrate multi-service deployment.

---

## Live Deployment Links

SQL Model Version  
Backend (Render):  
https://stock-market-web-application.onrender.com/

Frontend (Netlify):  
https://janata-stock-market-web.netlify.app/

Docker Version  
Backend (Render - Dockerized):  
https://stock-market-web-application-1.onrender.com/

Frontend (Netlify - Docker Build):  
https://stock-market-docker.netlify.app/

---

## Important Notes

- The backend is deployed on Render Free Tier.
- Render automatically shuts down the backend after 15 minutes of inactivity.
- When a request is made, the backend wakes up automatically.
- It takes about 1–2 minutes for the first response due to cold start.
- The MySQL database is hosted on Railway and remains active.

---

## What I Learned

- Full-stack development workflow using React (frontend), FastAPI (backend), and MySQL (database)
- Deploying and managing separate services across multiple cloud platforms
- Dockerizing both backend and frontend applications for consistent builds
- Working with environment variables in cloud deployment environments
- Connecting a Railway-hosted MySQL database to services on other platforms
- Managing a multi-service architecture spread across Render (backend), Netlify (frontend), and Railway (database)
- Understanding and mitigating cold starts and limitations of free-tier deployments

## Challenges Faced

- Frontend performance was slow due to rendering large datasets → fixed by implementing pagination
- CRUD operations failed initially because the dataset did not contain a unique ID → solved by adding an auto-increment primary key to the SQL table
- Deployment difficulties caused by coordinating multiple platforms (Render, Netlify, Railway)
- The Render free-tier server suspended frequently, causing delays until understanding cold start behavior
- Docker configuration issues required several adjustments to ensure compatibility across Render and Netlify




