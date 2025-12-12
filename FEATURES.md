# 🎓 AI English Communication Coach - Advanced Features

A comprehensive MERN stack application enhanced with AI-powered English learning features using GROQ API (llama-3.3-70b-versatile model).

## 🚀 New Advanced Features

### ✅ Completed Features

#### 1. **📊 Progress Dashboard**
- Real-time progress tracking with visual charts (Recharts)
- Weekly activity statistics with bar charts
- Skill breakdown radar chart (Pronunciation, Fluency, Grammar, Vocabulary)
- Improvement trend line chart over 30 days
- Recent sessions history
- Top mistakes to focus on
- XP and Level display

#### 2. **🎮 Interactive Learning Games**

**Rapid Fire Game:**
- Timed question-answer game (10 seconds per question)
- 5 rounds per game session
- Score calculation based on speed and accuracy
- AI-generated questions from GROQ
- XP rewards based on performance

**Word Builder Game:**
- Sentence construction from scrambled words
- Drag-and-drop word arrangement
- 5 rounds with increasing difficulty
- Real-time validation with AI
- Shuffle feature for word arrangement
- Score tracking and XP rewards

#### 3. **📚 AI Lesson Generator**
- Generate custom lessons on any topic
- AI-powered content creation using GROQ
- Structured lessons with:
  - Key vocabulary with definitions and examples
  - Useful phrases for practical use
  - Example conversations
  - Learning tips and best practices
- Popular topic suggestions
- Interactive lesson display

#### 4. **💬 AI Conversation Mode**
- Real-world scenario practice:
  - Job Interview
  - Restaurant
  - Travel
  - Customer Support
  - Meeting
  - Casual Chat
- Real-time AI responses maintaining conversation context
- Per-message scoring (0-100)
- Instant feedback on each response
- Conversation history tracking
- Session XP rewards (15 XP per conversation)

#### 5. **🏆 Daily Challenges**
- New challenge generated every day
- Multiple challenge types:
  - Pronunciation sentences
  - Vocabulary word of the day
  - Conversation scenarios
  - Motivational quotes
- Completion tracking
- 5 XP reward per challenge
- Leaderboard system
- Completion count display

#### 6. **👤 Enhanced User Profile**
- Avatar support (UI Avatars integration)
- XP and Level system:
  - Beginner (0-199 XP)
  - Intermediate (200-499 XP)
  - Advanced (500-999 XP)
  - Expert (1000+ XP)
- Progress bar to next level
- Comprehensive statistics display
- Language preference settings

#### 7. **🌍 Multi-Language Support (i18n)**
- 4 languages supported:
  - English (en)
  - Hindi (हिंदी) (hi)
  - Tamil (தமிழ்) (ta)
  - Kannada (ಕನ್ನಡ) (ka)
- Language switcher in profile
- Persistent language preference
- Translated UI elements throughout the app

#### 8. **📱 PWA (Progressive Web App) Support**
- Installable on mobile and desktop
- Offline capability preparation
- App manifest with icons
- Mobile-optimized interface
- Apple mobile web app support
- Theme color customization
- Shortcuts for quick access

#### 9. **📄 Export & Reporting**
- PDF progress report generation (jsPDF)
- Includes:
  - User information
  - Level and XP statistics
  - Total sessions count
  - Skill breakdown table
  - Downloadable from profile page

#### 10. **📈 Advanced Analytics**
- Session tracking with detailed metadata
- Mistake logging and categorization:
  - Grammar
  - Vocabulary
  - Pronunciation
  - Fluency
- Frequency tracking for repeated mistakes
- Progress improvement percentage calculation
- Weekly practice metrics

#### 11. **🎯 XP and Gamification System**
- XP rewards for all activities:
  - 10 XP per practice session
  - 5 XP per daily challenge
  - 15 XP per conversation
  - Variable XP for games
- Automatic level progression
- Visual level progress bars
- Achievement-style tracking

#### 12. **🔍 Enhanced AI Analysis**
Using GROQ's llama-3.3-70b-versatile model:
- Grammar scoring (0-100)
- Vocabulary assessment
- Pronunciation analysis with:
  - Difficult sounds identification
  - Stress pattern analysis
  - Phonetic output
- Fluency evaluation
- Pace analysis (words per minute)
- Clarity scoring
- Filler words detection
- Emotion/Tone analysis
- Personalized improvement suggestions

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **React Router v6** for navigation
- **React i18next** for internationalization
- **jsPDF** & **jspdf-autotable** for PDF generation
- **Lucide React** for icons
- **Axios** for API calls
- **react-speech-recognition** for voice input

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **GROQ SDK** for AI analysis (llama-3.3-70b-versatile)
- **CORS** enabled

### Database Models
1. **User** - Authentication and profile
2. **Session** - Practice session tracking
3. **Progress** - User progress metrics
4. **Mistake** - Error logging and tracking
5. **Challenge** - Daily challenges

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- GROQ API Key

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-coach
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
```

Start backend:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🎮 Usage Guide

### For Students
1. **Register/Login** - Create your account
2. **Dashboard** - View your progress and statistics
3. **Practice** - Start voice-based English practice
4. **Games** - Play Rapid Fire or Word Builder
5. **Lessons** - Generate AI lessons on any topic
6. **Conversation** - Practice real-world scenarios
7. **Daily Challenge** - Complete daily challenges for XP
8. **Profile** - Change language, view stats, download reports

### XP System
- Complete practice sessions: **10 XP**
- Daily challenges: **5 XP**
- Conversation mode: **15 XP**
- Games: **Variable based on performance**

### Level System
- **Beginner**: 0-199 XP
- **Intermediate**: 200-499 XP
- **Advanced**: 500-999 XP
- **Expert**: 1000+ XP

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user profile (Protected)
- `PUT /api/auth/update` - Update user profile (Protected)

### AI Analysis
- `POST /api/ai/analyze` - Analyze text with GROQ AI (Protected)

### Lessons & Games
- `POST /api/lessons/generate` - Generate AI lesson (Protected)
- `GET /api/lessons/rapidfire` - Get rapid fire question (Protected)
- `GET /api/lessons/wordbuilder/word` - Get word builder word (Protected)
- `POST /api/lessons/wordbuilder/evaluate` - Evaluate sentence (Protected)

### Conversation
- `POST /api/conversation/start` - Start conversation (Protected)
- `POST /api/conversation/message` - Send message (Protected)
- `POST /api/conversation/end` - End conversation (Protected)

### Progress
- `GET /api/progress/dashboard` - Get dashboard data (Protected)
- `GET /api/progress/weekly` - Get weekly stats (Protected)
- `GET /api/progress/skills` - Get skill breakdown (Protected)
- `POST /api/progress/update` - Update progress (Protected)

### Challenges
- `GET /api/challenge/daily` - Get daily challenge (Protected)
- `POST /api/challenge/complete` - Complete challenge (Protected)
- `GET /api/challenge/leaderboard` - Get leaderboard (Protected)

## 📱 PWA Installation

### Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"

### iOS
1. Open the app in Safari
2. Tap the share button
3. Select "Add to Home Screen"

### Desktop
1. Click the install icon in the address bar
2. Click "Install"

## 🎨 Features Highlights

### Dashboard Charts
- **Bar Chart**: Weekly sessions and XP
- **Radar Chart**: Skill breakdown across 4 areas
- **Line Chart**: 30-day improvement trend

### Games
- **Rapid Fire**: Speed-based Q&A with countdown timer
- **Word Builder**: Sentence construction with shuffle feature

### Conversation Mode
- Context-aware AI responses
- Real-time message scoring
- Multiple scenario types
- Conversation history display

### Multi-Language UI
- Seamless language switching
- Persistent preferences
- Native script support for all 4 languages

## 🔐 Security Features
- JWT token authentication
- Password hashing with bcryptjs
- Protected API routes
- Secure token storage

## 📊 Data Tracking
- Session metadata (type, duration, XP earned)
- Detailed analysis results
- Mistake categorization and frequency
- Weekly practice patterns
- Improvement trends over time

## 🎯 Future Enhancements
- Voice recording with audio analysis
- Peer practice matching
- Certification system
- More game types
- Extended language support
- Offline mode with service workers
- Push notifications for daily challenges
- Social features and sharing

## 🐛 Known Issues & Solutions

### Issue: regeneratorRuntime not defined
**Solution**: Install `regenerator-runtime` and import in main.jsx

### Issue: GROQ model error
**Solution**: Use `llama-3.3-70b-versatile` instead of OpenAI model names

### Issue: 401 Unauthorized
**Solution**: Ensure token is stored in localStorage and sent in headers

## 📄 License
MIT License

## 👨‍💻 Developer
Built with ❤️ using MERN Stack + GROQ AI

## 🙏 Acknowledgments
- GROQ for AI capabilities
- MongoDB for database
- Recharts for beautiful charts
- React team for amazing framework
- TailwindCSS for styling

---

**Happy Learning! 🎓✨**
