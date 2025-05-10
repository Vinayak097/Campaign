# Campaign Management System

A full-stack application for managing outreach campaigns and generating personalized LinkedIn messages using AI.

![Campaign Management System](https://img.shields.io/badge/Campaign%20Management-System-blue)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Gemini AI](https://img.shields.io/badge/AI-Gemini-purple)

## Features

- 📋 Create, view, update, and delete outreach campaigns
- 💬 Generate personalized LinkedIn messages using AI
- 🎨 Modern, responsive UI with Apple-inspired design
- 🔄 Full CRUD operations with MongoDB
- 🤖 AI-powered message generation with Gemini API

## Table of Contents

- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        Frontend (React + TypeScript)            │
│                                                                 │
│  ┌───────────────┐      ┌───────────────┐     ┌──────────────┐  │
│  │ Campaign List │      │ Campaign Form │     │ Message      │  │
│  │ - View all    │      │ - Create      │     │ Generator    │  │
│  │ - Delete      │      │ - Edit        │     │ - AI-powered │  │
│  └───────┬───────┘      └───────┬───────┘     └──────┬───────┘  │
│          │                      │                    │          │
└──────────┼──────────────────────┼────────────────────┼──────────┘
           │                      │                    │           
           │                      │                    │           
           ▼                      ▼                    ▼           
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                API Service Layer (Frontend)                     │
│                                                                 │
│  ┌───────────────┐      ┌───────────────┐     ┌──────────────┐  │
│  │ Campaign API  │      │ Campaign API  │     │ Message API  │  │
│  │ - GET /all    │      │ - POST /new   │     │ - Generate   │  │
│  │ - DELETE /:id │      │ - PUT /:id    │     │   message    │  │
│  └───────┬───────┘      └───────┬───────┘     └──────┬───────┘  │
│          │                      │                    │          │
└──────────┼──────────────────────┼────────────────────┼──────────┘
           │                      │                    │           
           │                      │                    │           
           ▼                      ▼                    ▼           
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                Backend (Node.js + Express + TypeScript)         │
│                                                                 │
│  ┌───────────────────────────┐          ┌────────────────────┐  │
│  │ Campaign Controller       │          │ Message Controller │  │
│  │ - getCampaigns()          │          │ - createMessage()  │  │
│  │ - getCampaignById()       │          └─────────┬──────────┘  │
│  │ - createCampaign()        │                    │             │
│  │ - updateCampaign()        │                    │             │
│  │ - deleteCampaign()        │                    │             │
│  └───────────┬───────────────┘                    │             │
│              │                                    │             │
│              ▼                                    ▼             │
│  ┌───────────────────────────┐          ┌────────────────────┐  │
│  │ Campaign Model (MongoDB)  │          │ Gemini AI Service  │  │
│  │ - name                    │          │ - generateContent  │  │
│  │ - description             │          └────────────────────┘  │
│  │ - status                  │                                  │
│  │ - leads                   │                                  │
│  │ - accountIDs              │                                  │
│  └───────────────────────────┘                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Campaign Creation Flow
```
User Input → Frontend Validation → API Service → Backend Controller → 
MongoDB Validation → Database Storage → Response → UI Update
```

### Message Generation Flow
```
LinkedIn Profile Input → Frontend Validation → API Service → 
Backend Controller → Gemini AI Service → Response → 
Message Display → Copy to Clipboard
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gemini API key (for AI message generation)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/campaign-management.git
   cd campaign-management
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/campaign-management
     GEMINI_API_KEY=your_gemini_api_key
     ```

## Running the Application

### Backend

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on http://localhost:3000

### Frontend

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at http://localhost:5173

## API Endpoints

### Campaign APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/campaigns | Fetch all campaigns (excluding DELETED) |
| GET    | /api/campaigns/:id | Fetch a single campaign by ID |
| POST   | /api/campaigns | Create a new campaign |
| PUT    | /api/campaigns/:id | Update campaign details |
| DELETE | /api/campaigns/:id | Soft delete a campaign |

### LinkedIn Message API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/personalized-message | Generate a personalized message |

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| PORT | Port for the backend server (default: 3000) |
| MONGODB_URI | MongoDB connection string |
| GEMINI_API_KEY | API key for Google's Gemini AI |

## License

This project is licensed under the MIT License - see the LICENSE file for details.
