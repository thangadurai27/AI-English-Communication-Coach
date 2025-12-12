import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import { BookOpen, Sparkles, RotateCcw, Lightbulb, MessageSquare } from 'lucide-react';

function Lessons() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState(null);

  const popularTopics = [
    { title: 'Daily Conversations' },
    { title: 'Business English' },
    { title: 'Travel English' },
    { title: 'Job Interviews' },
    { title: 'Presentations' },
    { title: 'Small Talk' },
  ];

  const generateLesson = async (selectedTopic = topic) => {
    if (!selectedTopic.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first!');
        navigate('/login');
        return;
      }

      console.log('ðŸ“š Requesting lesson for:', selectedTopic);
      const { data } = await axios.post(
        API_ENDPOINTS.GENERATE_LESSON,
        { topic: selectedTopic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('âœ… Lesson received:', data);
      setLesson(data);
    } catch (error) {
      console.error('âŒ Error generating lesson:', error);
      console.error('Response:', error.response?.data);
      alert(`Failed to generate lesson: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLesson(null);
    setTopic('');
  };

  return (
    <PageLayout maxWidth="5xl">
      <SectionTitle
        title={t('lessons')}
        subtitle="Generate custom AI-powered English lessons on any topic"
        icon={BookOpen}
        align="center"
      />

      {loading ? (
        <Card className="text-center py-16">
          <Loader size="lg" text="Creating your personalized lesson..." />
        </Card>
      ) : !lesson ? (
        <div className="space-y-6 animate-fade-in">
          <Card gradient>
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <Input
                  label="Enter Your Topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateLesson()}
                  icon={Lightbulb}
                  placeholder="e.g., Ordering food at a restaurant"
                />
              </div>

              <Button
                onClick={() => generateLesson()}
                disabled={!topic.trim()}
                className="w-full"
                size="lg"
                icon={Sparkles}
              >
                Generate Lesson
              </Button>
            </div>
          </Card>

          <div>
            <h3 className="text-xl font-heading font-bold text-text-primary dark:text-text-dark mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Popular Topics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popularTopics.map((t, index) => (
                <Card
                  key={index}
                  hover
                  className="text-center cursor-pointer group"
                  onClick={() => {
                    setTopic(t.title);
                    generateLesson(t.title);
                  }}
                >
                  <p className="font-semibold text-lg text-text-primary dark:text-text-dark group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                    {t.title}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
          <Card gradient className="text-center">
            <h2 className="text-3xl font-heading font-bold text-text-primary dark:text-text-dark mb-2">
              {lesson.title}
            </h2>
            <p className="text-text-secondary dark:text-text-dark/70 mb-6">
              {lesson.description}
            </p>
            <Button onClick={handleReset} variant="outline" icon={RotateCcw}>
              Generate New Lesson
            </Button>
          </Card>

          {/* Vocabulary Section */}
          {lesson.vocabulary && lesson.vocabulary.length > 0 && (
            <Card>
              <h3 className="text-2xl font-heading font-bold text-text-primary dark:text-text-dark mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Key Vocabulary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.vocabulary.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors"
                  >
                    <p className="font-bold text-primary mb-1">{item.word || item.term}</p>
                    <p className="text-text-secondary dark:text-text-dark/70 text-sm">
                      {item.definition || item.meaning}
                    </p>
                    {item.example && (
                      <p className="text-text-secondary dark:text-text-dark/60 text-sm italic mt-2">
                        "{item.example}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Phrases Section */}
          {lesson.phrases && lesson.phrases.length > 0 && (
            <Card>
              <h3 className="text-2xl font-heading font-bold text-text-primary dark:text-text-dark mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-accent" />
                Common Phrases
              </h3>
              <div className="space-y-3">
                {lesson.phrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-xl border-l-4 border-accent hover:bg-accent/10 transition-colors"
                  >
                    <p className="font-medium text-text-primary dark:text-text-dark">
                      "{phrase.phrase || phrase.text || phrase}"
                    </p>
                    {phrase.usage && (
                      <p className="text-sm text-text-secondary dark:text-text-dark/70 mt-1">
                        {phrase.usage}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Examples Section */}
          {lesson.examples && lesson.examples.length > 0 && (
            <Card>
              <h3 className="text-2xl font-heading font-bold text-text-primary dark:text-text-dark mb-4 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                Examples & Dialogues
              </h3>
              <div className="space-y-4">
                {lesson.examples.map((example, index) => (
                  <div
                    key={index}
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border-2 border-yellow-200 dark:border-yellow-800"
                  >
                    <p className="text-text-primary dark:text-text-dark leading-relaxed">
                      {example.text || example.dialogue || example}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Additional Content */}
          {lesson.content && (
            <Card>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-text-secondary dark:text-text-dark/70 leading-relaxed whitespace-pre-wrap">
                  {lesson.content}
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </PageLayout>
  );
}

export default Lessons;
