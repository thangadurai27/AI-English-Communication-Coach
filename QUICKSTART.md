# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB running locally OR MongoDB Atlas account
- ✅ Chrome or Edge browser (for speech recognition)

## Installation Steps

### Step 1: Install Backend Dependencies

Open terminal in the project root and run:

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

Open a new terminal and run:

```bash
cd frontend
npm install
```

### Step 3: Start MongoDB

**Option A - Local MongoDB:**
```bash
# Make sure MongoDB is running on your machine
# Default connection: mongodb://localhost:27017
```

**Option B - MongoDB Atlas:**
- Update the `MONGO_URI` in `backend/.env` with your Atlas connection string

### Step 4: Start Backend Server

In the backend terminal:
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 5: Start Frontend

In the frontend terminal:
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

### Step 6: Open Application

Open your browser and go to: `http://localhost:3000`

## Testing the Application

1. **Register a new account**
   - Click "Register" button
   - Fill in name, email, and password
   - Submit

2. **Login**
   - Use your credentials to login
   - You'll be redirected to Practice page

3. **Practice Speaking**
   - Click "Start Speaking"
   - Allow microphone access when prompted
   - Speak in English (e.g., "Hello, I am learning English")
   - Click "Stop"
   - Click "Analyze My Speech"
   - View AI feedback

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in backend folder
- Check if port 5000 is available

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

### Speech recognition not working
- Use Chrome or Edge browser
- Grant microphone permissions
- Ensure HTTPS (or localhost)

### AI Analysis fails
- Check if GROQ API key is valid in `.env`
- Ensure you're logged in (JWT token is present)
- Check backend console for errors

## Default Configuration

- **Backend URL**: http://localhost:5000
- **Frontend URL**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017/ai-communication-coach
- **GROQ API Key**: Already configured in `.env`

## Environment Variables

Backend `.env` file should contain:
```env
MONGO_URI=mongodb://localhost:27017/ai-communication-coach
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

## Next Steps

- ✅ Application is running
- ✅ Create an account
- ✅ Start practicing English
- ✅ Get AI feedback
- ✅ Improve your communication skills!

---

**Need Help?** Check the main README.md for more detailed information.
