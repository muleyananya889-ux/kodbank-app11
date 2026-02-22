# Kodbank App

A full-stack banking application with glassmorphism design featuring user authentication, balance checking, and money transfers.

## Features

- **Glassmorphism Design**: Modern UI with glassmorphism effects
- **User Authentication**: Secure signup and login with JWT
- **Balance Management**: View account balance
- **Money Transfers**: Transfer money between users
- **Responsive Design**: Works on all devices

## Tech Stack

### Backend
- Node.js & Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- React Router
- Axios for API calls
- TailwindCSS
- Vite

## Setup Instructions

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
```

4. Run database migration:
```bash
npx prisma migrate dev --name init
```

5. Start the server:
```bash
npm start
```

Server runs on port 5000

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on port 5173

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user
- `POST /api/login` - Login user and get JWT

### Protected Routes (requires JWT)
- `GET /api/balance` - Get user balance
- `POST /api/transfer` - Transfer money to another user

## Usage

1. Start both backend and frontend servers
2. Open browser to `http://localhost:5173`
3. Create an account or login
4. View your balance and transfer money

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  balance   Float    @default(10000)
  createdAt DateTime @default(now())
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation
- SQL injection prevention with Prisma
