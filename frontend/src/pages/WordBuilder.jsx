import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Shuffle, Award, ArrowLeft } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';

function WordBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameType = searchParams.get('type') || 'basic';
  const [wordData, setWordData] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gameTypeNames = {
    basic: '🎯 Sentence Builder',
    complex: '🚀 Advanced Constructor',
    questions: '❓ Question Former',
    challenge: '🏆 Ultimate Challenge'
  };

  const maxRounds = gameType === 'challenge' ? 10 : 5;

  const fetchWord = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/lessons/wordbuilder/word?type=${gameType}&round=${round}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWordData(data);
      setSelectedWords([]);
      setSelectedIndices([]);
      setFeedback('');
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    fetchWord();
  };

  const selectWord = (word, index) => {
    setSelectedWords([...selectedWords, word]);
    setSelectedIndices([...selectedIndices, index]);
  };

  const removeWord = (index) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
    setSelectedIndices(selectedIndices.filter((_, i) => i !== index));
  };

  const shuffleWords = () => {
    if (!wordData) return;
    const shuffled = [...wordData.scrambled].sort(() => Math.random() - 0.5);
    setWordData({ ...wordData, scrambled: shuffled });
  };

  const submitSentence = async () => {
    if (selectedWords.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const sentence = selectedWords.join(' ');

      const { data } = await axios.post(
        'http://localhost:5000/api/lessons/wordbuilder/evaluate',
        { userSentence: sentence, correctSentence: wordData.sentence },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.correct) {
        const points = 50 + (10 - round) * 10;
        setScore(score + points);
        setFeedback(`✅ Excellent! +${points} points`);
      } else {
        setFeedback(`❌ Not quite right. Correct: "${wordData.sentence}"`);
      }

      setTimeout(() => {
        if (round < maxRounds) {
          setRound(round + 1);
          fetchWord();
        } else {
          endGame();
        }
      }, 3000);
    } catch (error) {
      console.error('Error submitting sentence:', error);
    }
  };

  const endGame = async () => {
    setGameActive(false);
    setGameOver(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/ai/analyze',
        { text: `Word Builder Game - Score: ${score}` },
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-text-dark">{gameTypeNames[gameType] || '🎯 Word Builder'}</h1>
            {gameActive && (
              <div className="flex items-center">
                <Award className="mr-2 text-green-500" size={24} />
                <span className="text-2xl font-bold text-green-500">{score}</span>
              </div>
            )}
          </div>

          {!gameActive && !gameOver && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Build Sentences!</h2>
              <p className="text-gray-600 mb-8">
                Arrange the scrambled words to form correct sentences. Complete 5 rounds!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:opacity-90 transition"
              >
                Start Game
              </button>
            </div>
          )}

          {gameActive && wordData && (
            <div className="py-8">
              <div className="mb-6 flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Round {round}/5
                </span>
                <button
                  onClick={shuffleWords}
                  className="flex items-center text-purple-600 hover:text-purple-800"
                >
                  <Shuffle size={20} className="mr-1" />
                  Shuffle
                </button>
              </div>

              {/* Selected sentence area */}
              <div className="bg-gray-100 rounded-lg p-6 mb-6 min-h-[80px]">
                {selectedWords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedWords.map((word, index) => (
                      <button
                        key={index}
                        onClick={() => removeWord(index)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">Click words below to build your sentence</p>
                )}
              </div>

              {/* Available words */}
              <div className="flex flex-wrap gap-3 mb-6">
                {wordData.scrambled.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => selectWord(word, index)}
                    disabled={selectedIndices.includes(index)}
                    className="bg-white border-2 border-purple-500 text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className={`p-4 rounded-lg mb-4 ${feedback.includes('Excellent') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback}
                </div>
              )}

              <button
                onClick={submitSentence}
                disabled={selectedWords.length === 0}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Sentence
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">🎉 Game Complete!</h2>
              <div className="text-6xl font-bold text-purple-600 mb-4">{score}</div>
              <p className="text-xl text-gray-600 mb-8">Final Score</p>
              
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition"
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

export default WordBuilder;
