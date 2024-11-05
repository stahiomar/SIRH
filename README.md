# 🏢 SIRH Solution - Human Resource Information System

A comprehensive **SIRH (Système d'Information des Ressources Humaines)** solution designed to manage HR processes efficiently. This system leverages a microservices architecture to ensure scalability and flexibility, with a **React** frontend and **Spring Boot** backend, and is deployed on **Kubernetes** with **Docker** for containerization.

## 📋 Project Overview

This project provides an integrated HR management system covering essential HR functions, including user management, leave management, and other HR processes. It’s built with a focus on scalability, reliability, and ease of deployment.

## 🛠️ Technologies Used

- **Frontend**: [React](https://reactjs.org/) for a dynamic and responsive user interface.
- **Backend**: [Spring Boot](https://spring.io/projects/spring-boot) for developing robust and scalable REST APIs.
- **Microservices Architecture**: Each module is developed as an independent service.
- **Containerization**: [Docker](https://www.docker.com/) is used to containerize each microservice.
- **Orchestration**: [Kubernetes](https://kubernetes.io/) for deploying and managing the containerized application at scale.
- **Database**: [MariaDB](https://mariadb.org/) for data storage.
- **File Storage**: [Amazon S3](https://aws.amazon.com/s3/) for securely storing and accessing files, such as payroll documents.

## ✨ Features

- **User Management**: Handle employee data, user roles, and permissions.
- **Leave Management**: Request, approve, and track leave applications.
- **HR Processes**: Manage additional HR workflows and reporting features.
- **API Integration**: REST APIs to facilitate communication between frontend and backend, with role-based access control.
- **Scalable Deployment**: Deployed on a Kubernetes cluster for high availability and scalability.

## Prerequisites

- **Docker** and **Docker Compose** for containerization.
- **Kubernetes** (minikube or a cloud provider) for deployment.
- **Java 11+** for running Spring Boot services.
- **Node.js** and **npm** for the React frontend.

## Project architecture
![image](https://github.com/user-attachments/assets/bae0c638-7fbb-496f-8354-c56acc0ff65a)

##🛠️ Usage
- **User Management**: Manage employee data, roles, and permissions.
- **Leave Management**: Employees can submit leave requests, which managers or HR can approve.
- **HR Processes**: Access additional workflows for HR functions.
- **File Storage**: Use Amazon S3 for storing and accessing pay slips.
