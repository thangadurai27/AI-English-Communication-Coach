import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Timer, Award, ArrowLeft } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';

function RapidFire() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameType = searchParams.get('type') || 'grammar';
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [askedQuestions, setAskedQuestions] = useState([]);

  const gameTypeNames = {
    grammar: '⚡ Grammar Lightning',
    vocabulary: '📚 Vocabulary Sprint',
    idioms: '🎯 Idiom Master',
    pronunciation: '🗣️ Pronunciation Rush'
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      handleTimeout();
    }
  }, [timeLeft, gameActive]);

  const fetchQuestion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        navigate('/games');
        return;
      }

      console.log(`⚡ Fetching ${gameType} question (avoiding ${askedQuestions.length} previous)...`);
      const { data } = await axios.get(`http://localhost:5000/api/lessons/rapidfire?type=${gameType}&round=${round}&exclude=${askedQuestions.join(',')}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Question received:', data);
      setQuestion(data);
      setAskedQuestions([...askedQuestions, data.question]);
      setUserAnswer('');
      setFeedback('');
      setTimeLeft(30);
    } catch (error) {
      console.error('❌ Error fetching question:', error);
      console.error('Response:', error.response?.data);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    setAskedQuestions([]);
    fetchQuestion();
  };

  const handleTimeout = () => {
    setFeedback('⏱️ Time\'s up!');
    setTimeout(() => {
      if (round < 5) {
        setRound(round + 1);
        fetchQuestion();
      } else {
        endGame();
      }
    }, 1500);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;

    const correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    
    if (correct) {
      setScore(score + (10 - round) * 10); // More points for faster rounds
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! Correct answer: ${question.answer}`);
    }

    setTimeout(() => {
      if (round < 5) {
        setRound(round + 1);
        fetchQuestion();
      } else {
        endGame();
      }
    }, 1500);
  };

  const endGame = async () => {
    setGameActive(false);
    setGameOver(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/ai/analyze',
        { text: `Rapid Fire Game - Score: ${score}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/games')}
          className="mb-4 flex items-center text-white dark:text-text-dark hover:underline"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Games
        </button>

        <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-text-dark">{gameTypeNames[gameType] || '⚡ Rapid Fire'}</h1>
            {gameActive && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Timer className="mr-2 text-red-500" size={24} />
                  <span className="text-2xl font-bold text-red-500">{timeLeft}s</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 text-green-500" size={24} />
                  <span className="text-2xl font-bold text-green-500">{score}</span>
                </div>
              </div>
            )}
          </div>

          {!gameActive && !gameOver && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
              <p className="text-gray-600 mb-8">
                Answer 5 questions as fast as you can. You have 10 seconds per question!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:opacity-90 transition"
              >
                Start Game
              </button>
            </div>
          )}

          {gameActive && question && (
            <div className="py-8">
              <div className="mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Question {round}/5
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                placeholder="Type your answer..."
                className="w-full border-2 border-gray-300 rounded-lg p-4 mb-4 text-lg focus:border-blue-500 focus:outline-none"
                autoFocus
              />

              {feedback && (
                <div className={`p-4 rounded-lg mb-4 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback}
                </div>
              )}

              <button
                onClick={submitAnswer}
                disabled={!userAnswer.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">🎉 Game Over!</h2>
              <div className="text-6xl font-bold text-green-600 mb-4">{score}</div>
              <p className="text-xl text-gray-600 mb-8">Final Score</p>
              
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="w-full bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-bold hover:bg-gray-300 transition"
                >
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default RapidFire;
