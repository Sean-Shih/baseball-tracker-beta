
# Baseball Analytics Dashboard

A full-stack web application for tracking and managing MLB players
and their statistics.

Built with React, TypeScript, Spring Boot, and PostgreSQL.

## Features

- View a list of MLB players.
- Search and filter players.
- Sort players by name, team, position, and statistics.
- View individual player details.
- Add new players.
- Edit existing player information.
- Delete players.
- Track batting statistics including AVG, OBP, SLG, and OPS.
- Track pitching statistics including ERA.
- Handle missing or unavailable statistics.
- Persist player information using PostgreSQL.

## Technologies

### Frontend
- React
- TypeScript
- Vite
- React Router
- Vitest
- React Testing Library

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Validation
- Maven

### Database
- PostgreSQL

### Testing
- JUnit
- Mockito
- MockMvc
- Vitest
- React Testing Library


## Getting Started

### Prerequisites

- Java 21
- Node.js
- PostgreSQL
- npm

### 1. Clone the repository

git clone <your-repository-url>

### 2. Set up PostgreSQL

Create a database named baseball_db.

Configure your database environment variables.

### 3. Start the backend

cd backend
./mvnw spring-boot:run

### 4. Start the frontend

cd frontend
npm install
npm run dev