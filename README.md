# AI English Communication Coach - MERN Stack Application

A full-stack MERN application that helps users improve their English speaking skills using AI-powered feedback from GROQ API.

## 🚀 Features

- **User Authentication**: Register and login with JWT token-based authentication
- **Speech Recognition**: Real-time speech-to-text using Web Speech API
- **AI Analysis**: Powered by GROQ API (llama-3.3-70b-versatile model)
- **Comprehensive Feedback**:
  - Grammar analysis
  - Vocabulary suggestions
  - Pronunciation scoring (0-100)
  - Fluency scoring (0-100)
  - Mistake explanations
  - Improved sentence versions
  - Motivational messages

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- GROQ SDK for AI integration

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- react-speech-recognition for voice input

## 📁 Project Structure

```
Ai Communication Application/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── aiController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Recorder.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Practice.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally, or MongoDB Atlas account
- Modern browser (Chrome or Edge for speech recognition)

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/ai-communication-coach
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📝 Usage

1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Practice**:
   - Click "Start Speaking" to begin recording
   - Speak naturally in English
   - Click "Stop" when finished
   - Click "Analyze My Speech" to get AI feedback
4. **Review Feedback**: View your grammar, vocabulary, pronunciation, fluency scores, and improvement suggestions

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### AI Analysis
- `POST /api/ai/analyze` - Analyze spoken text (Protected route)

## 🤖 AI Analysis Response Format

```json
{
  "grammar": "Brief grammar feedback",
  "vocabulary": "Vocabulary suggestions",
  "pronunciation": 85,
  "fluency": 80,
  "mistake_explanation": "Detailed explanation of mistakes",
  "improved_version": "Corrected version of your text",
  "motivation": "Motivational message"
}
```

## 🌐 Browser Compatibility

The speech recognition feature works best on:
- Google Chrome (Desktop & Mobile)
- Microsoft Edge
- Safari (limited support)

**Note**: Firefox does not support Web Speech API.

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- CORS enabled for cross-origin requests

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer Notes

- Make sure MongoDB is running before starting the backend
- The GROQ API key is already configured in the `.env` file
- For production deployment, change the `JWT_SECRET` and configure MongoDB Atlas
- Speech recognition requires HTTPS in production environments

## 🎯 Future Enhancements

- Save practice sessions history
- Track progress over time
- Add more language support
- Implement difficulty levels
- Add conversation practice mode

---

Built with ❤️ using MERN Stack and GROQ AI
