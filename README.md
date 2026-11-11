
# Baseball Analytics Dashboard

A full-stack web application for tracking and managing MLB players and their statistics.

Built with **React**, **TypeScript**, **Spring Boot**, and **PostgreSQL**. The application provides an interactive dashboard for browsing individual player information, managing player statistics, and viewing batting and pitching statistics

## Features

- Player Management
  - View a list of MLB players.
  - Add new players.
  - Edit existing player information.
  - Delete players.
  - View individual statistics.
- Search, Filter, amd Sort.
  - Sort players by name, team, position, and statistics.
- View individual player details.
  - Track batting statistics including AVG, OBP, SLG, and OPS.
  - Track pitching statistics including ERA.
  - Displays statistical summaries and comparison charts.
  - Handle missing or unavailable statistics.
- Data Persistance
  - Store player information using PostgreSQL.
  - Perform CRUD operations through Spring Boot REST API.
- Testing and Error Handling
  - Frontend component and integration tests.
  - Backend API and validation tests.
  - Centralized API error handling.

## Technologies

### Frontend
- React
- TypeScript
- Vite
- React Router
- Vitest
- React Testing Library

### Backend
- Java (Java 21)
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

Install the following if you haven't:

- Java 21
- Node.js
- PostgreSQL
- npm

### 1. Clone the repository

git clone https://github.com/Sean-Shih/baseball-tracker-beta.git

### 2. Set up Database

Create a database named baseball_db.

```sql
  CREATE DATABASE baseball_db;
```

Configure your database environment variables:

| Variable | Description |
|----------|-------------|
| DB_URL   | PostgreSQL connection URL|
|DB_USERNAME|PostgreSQL username|
|DB_PASSWORD|PostgreSQL password|

For local developemnt, the database URL should be:
```bash
jdbc:postgresql://localhost:5432/baseball_db
```

### 3. Configure the backend

Set database environment variables in terminal.

```bash
export DB_URL=jdbc:postgresql://localhost:5432/baseball_db
export DB_USERNAME=postgres
export DB_PASSWORD=your_actual_password
```

Navigate to backend directory and start the Spring Boot application:

```bash
cd backend
./mvnw spring-boot:run
```

The backend will run at:
```bash
http://localhost:8080
```

### 4. Configure the frontend

Open another terminal and navigate to frontend directory:

``` bash
cd frontend
```

Create an .env file containing:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Install dependencies and start development server:


```bash
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description
|----------|-------------| -----|
| GET   | /api/players | Retrieve all players|
| GET   | /api/players{id} | Retrieve a player by ID|
| POST   | /api/players | Create a new player|
| PUT   | /api/players{id} | Update an existing player|
| DELETE   | /api/players{id} | Delete a player|

## Running Tests

### Frontend

Navigate to frontend directory:

``` bash
cd frontend
```

Test with:

``` bash
npm test
```

Run production build with:

``` bash
npm run build
```

### Backend

Navigate to backend directory:

``` bash
cd backend
```

Test with:

``` bash
./mvnw test
```

Build the backend with:

``` bash
./mvnw clean package
```

## Screenshots

## Future Improvements

- Docker containerization.
- Automated CI/CD pipeline.
- Cloud deployment.
- Integration with a live MLB statistics API.