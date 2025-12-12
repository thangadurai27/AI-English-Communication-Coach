import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Trophy, Calendar } from 'lucide-react';

function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(API_ENDPOINTS.DAILY_CHALLENGE, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChallenge(data.challenge);
      setCompleted(data.completed);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      setLoading(false);
    }
  };

  const completeChallenge = async () => {
    if (!response.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        API_ENDPOINTS.COMPLETE_CHALLENGE,
        { challengeId: challenge._id, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`${data.message} +${data.xpEarned} XP!`);
      setCompleted(true);
    } catch (error) {
      console.error('Error completing challenge:', error);
      alert(error.response?.data?.message || 'Failed to complete challenge');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !challenge) {
    return null;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center mb-4">
        <Calendar className="mr-2" size={28} />
        <h2 className="text-2xl font-bold">Daily Challenge</h2>
      </div>

      {completed ? (
        <div className="text-center py-6">
          <Trophy size={64} className="mx-auto mb-4" />
          <p className="text-xl font-semibold">Challenge Completed! ✨</p>
          <p className="text-sm opacity-90 mt-2">Come back tomorrow for a new challenge</p>
        </div>
      ) : (
        <div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
            <p className="text-lg font-semibold mb-2">📝 Pronunciation Challenge:</p>
            <p className="text-xl italic">"{challenge.sentence}"</p>
          </div>

          {challenge.vocabularyWord && (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold mb-2">📚 Word of the Day:</p>
              <p className="text-2xl font-bold">{challenge.vocabularyWord.word}</p>
              <p className="text-sm mt-1">{challenge.vocabularyWord.definition}</p>
              <p className="text-sm italic mt-2">"{challenge.vocabularyWord.example}"</p>
            </div>
          )}

          {challenge.motivationalQuote && (
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
              <p className="text-center italic">"{challenge.motivationalQuote}"</p>
            </div>
          )}

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your practice response or notes..."
            className="w-full p-3 rounded-lg text-gray-800 mb-3 h-24 resize-none"
          />

          <button
            onClick={completeChallenge}
            disabled={!response.trim() || submitting}
            className="w-full bg-white text-orange-600 font-bold py-3 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Complete Challenge (+5 XP)'}
          </button>
        </div>
      )}
    </div>
  );
}

export default DailyChallenge;
