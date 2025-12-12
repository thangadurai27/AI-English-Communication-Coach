import { Link } from 'react-router-dom';
import DailyChallenge from '../components/DailyChallenge';
import PageLayout from '../components/ui/PageLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Sparkles, MessageCircle, BookOpen, Trophy, BarChart3, Zap, Users, Star } from 'lucide-react';

const Home = () => {
  const token = localStorage.getItem('token');

  const features = [
    {
      icon: Zap,
      title: 'Interactive Games',
      description: 'Play Rapid Fire and Word Builder to improve your skills while having fun',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: MessageCircle,
      title: 'AI Conversations',
      description: 'Practice real-world scenarios with AI in job interviews, restaurants, and more',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: BookOpen,
      title: 'Personalized Lessons',
      description: 'Get AI-generated lessons tailored to your learning needs and goals',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and insights',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Trophy,
      title: 'Daily Challenges',
      description: 'Complete challenges to earn XP and level up your skills',
      color: 'from-amber-400 to-yellow-500'
    },
    {
      icon: Users,
      title: 'Multi-Language',
      description: 'Learn in English, Hindi, Tamil, or Kannada',
      color: 'from-cyan-400 to-blue-500'
    }
  ];

  const stats = [
    { label: 'Practice Sessions', value: '10,000+', icon: Sparkles },
    { label: 'Happy Learners', value: '5,000+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: Star },
  ];

  return (
    <PageLayout maxWidth="7xl">
      {/* Hero Section */}
      <div className="text-center mb-20 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-bounce-slow">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered English Learning</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-primary-dark bg-clip-text text-transparent leading-tight">
          Master English with
          <br />
          AI-Powered Coaching
        </h1>
        
        <p className="text-xl md:text-2xl text-text-secondary dark:text-text-dark/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Improve your speaking, grammar, vocabulary, and pronunciation with instant AI feedback
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {token ? (
            <>
              <Link to="/dashboard">
                <Button size="xl" icon={BarChart3}>
                  View Dashboard
                </Button>
              </Link>
              <Link to="/practice">
                <Button size="xl" variant="outline" icon={Sparkles}>
                  Start Practicing
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button size="xl" icon={Sparkles}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="xl" variant="outline">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <Card key={index} hover className="text-center">
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-text-secondary dark:text-text-dark/70">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Challenge Section */}
      {token && (
        <div className="max-w-3xl mx-auto mb-20 animate-slide-up">
          <DailyChallenge />
        </div>
      )}

      {/* Features Grid */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary dark:text-text-dark mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-text-secondary dark:text-text-dark/70 max-w-2xl mx-auto">
            Powerful features designed to accelerate your English learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              hover 
              className="group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-text-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary dark:text-text-dark/70">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {!token && (
        <Card gradient className="text-center p-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary dark:text-text-dark mb-4">
            Ready to Transform Your English?
          </h2>
          <p className="text-lg text-text-secondary dark:text-text-dark/70 mb-8 max-w-2xl mx-auto">
            Join thousands of learners improving their communication skills with AI
          </p>
          <Link to="/register">
            <Button size="lg" icon={Sparkles}>
              Start Your Journey Today
            </Button>
          </Link>
        </Card>
      )}
    </PageLayout>
  );
};

export default Home;
