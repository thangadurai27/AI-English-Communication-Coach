import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { MessageCircle, Send, Phone } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';

function Conversation() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState('');
  const [conversationActive, setConversationActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionScore, setSessionScore] = useState(null);
  const messagesEndRef = useRef(null);

  const scenarios = [
    'Job Interview',
    'Restaurant',
    'Travel',
    'Customer Support',
    'Meeting',
    'Casual Chat',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = async () => {
    if (!scenario) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        navigate('/login');
        return;
      }

      console.log('💬 Starting conversation:', scenario);
      const { data } = await axios.post(
        API_ENDPOINTS.START_CONVERSATION,
        { scenario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Conversation started:', data);
      setMessages([{ role: 'ai', content: data.message }]);
      setConversationActive(true);
    } catch (error) {
      console.error('❌ Error starting conversation:', error);
      console.error('Response:', error.response?.data);
      alert(`Failed to start conversation: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput('');
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('💬 Sending message...');
      const { data } = await axios.post(
        API_ENDPOINTS.SEND_MESSAGE,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Response received:', data);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.aiMessage,
        score: data.score,
        feedback: data.feedback
      }]);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Response:', error.response?.data);
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${error.response?.data?.error || error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const endConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        API_ENDPOINTS.END_CONVERSATION,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionScore(data.xpEarned);
      setConversationActive(false);
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setScenario('');
    setSessionScore(null);
    setConversationActive(false);
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
            <div className="flex items-center">
              <MessageCircle size={32} className="mr-3" />
              <h1 className="text-3xl font-bold">AI Conversation Practice</h1>
            </div>
          </div>

          <div className="p-6">
            {!conversationActive && !sessionScore ? (
              <div>
                <p className="text-gray-600 mb-6">
                  Choose a scenario and practice real-world conversations with AI!
                </p>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-3">
                    Select Scenario:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {scenarios.map((s) => (
                      <button
                        key={s}
                        onClick={() => setScenario(s)}
                        className={`p-4 rounded-lg border-2 transition ${
                          scenario === s
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <p className="font-semibold">{s}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startConversation}
                  disabled={!scenario || loading}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Starting...' : 'Start Conversation'}
                </button>
              </div>
            ) : sessionScore !== null ? (
              <div className="text-center py-12">
                <h2 className="text-3xl font-bold mb-4">🎉 Conversation Complete!</h2>
                <div className="text-6xl font-bold text-green-600 mb-4">+{sessionScore}</div>
                <p className="text-xl text-gray-600 mb-8">XP Earned</p>
                
                <button
                  onClick={resetConversation}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition"
                >
                  Start New Conversation
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-gray-100 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-300'
                        }`}
                      >
                        <p>{msg.content}</p>
                        {msg.score && (
                          <div className="mt-2 text-xs opacity-75">
                            Score: {msg.score}/100 - {msg.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="text-gray-500 italic">AI is typing...</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border-2 border-gray-300 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!userInput.trim() || loading}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>

                <button
                  onClick={endConversation}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition flex items-center justify-center"
                >
                  <Phone size={20} className="mr-2" />
                  End Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Conversation;
