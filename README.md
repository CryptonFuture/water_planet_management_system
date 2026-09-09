# Water Plant Management System

A full-stack application for managing water treatment plants, reservoirs, water quality, chemical inventory, maintenance schedules, and alerts.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + React Router + Axios + Lucide Icons |
| Backend | Node.js + Express.js + MongoDB (Mongoose) + JWT Auth |
| Analytics | Python FastAPI microservice for water quality analysis |

## Features

- **Authentication** – JWT based login with roles (admin, manager, operator, viewer)
- **Dashboard** – Overview stats, recent quality records
- **Water Plants** – CRUD for treatment / desalination / distribution plants
- **Reservoirs** – Monitor tank levels with visual progress bars & auto alerts
- **Water Quality** – Record parameters (pH, turbidity, chlorine, TDS…) + AI analysis via Python
- **Chemicals** – Inventory tracking with low-stock alerts
- **Maintenance** – Schedule and track preventive/corrective work
- **Alerts** – Real-time notifications for quality, levels, inventory

## Project Structure

```
water-plant-management-system/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
├── python-service/          # FastAPI analytics
│   ├── main.py
│   └── requirements.txt
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.9+ (for analytics service)
- npm / pip

## Setup & Run

### 1. MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017`

### 2. Backend
```bash
cd backend
cp .env.example .env   # edit if needed
npm install
npm run seed           # load demo data
npm run dev            # http://localhost:5000
```

### 3. Python Analytics Service
```bash
cd python-service
pip install -r requirements.txt
python main.py         # http://localhost:8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Demo Credentials

| Role     | Email                      | Password    |
|----------|----------------------------|-------------|
| Admin    | admin@waterplant.com       | admin123    |
| Manager  | manager@waterplant.com     | manager123  |
| Operator | operator@waterplant.com    | operator123 |

## API Endpoints (Backend)

- `POST /api/auth/login` / `register`
- `GET  /api/dashboard`
- `CRUD /api/plants`
- `CRUD /api/quality`
- `CRUD /api/reservoirs` + `PUT /:id/level`
- `CRUD /api/chemicals`
- `GET  /api/alerts` + resolve/read
- `CRUD /api/maintenance`

## Python Service

- `POST /analyze` – single water quality analysis & recommendations
- `POST /batch-analyze`
- `GET  /standards` – WHO/BIS guideline values

## Environment Variables (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/water_plant_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PYTHON_SERVICE_URL=http://localhost:8000
```

## License

MIT
# water_planet_management_system
