import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Target, Brain, Rocket, Star, Trophy, BookOpen, MessageSquare, Volume2, Award } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function Games() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rapidFireGames = [
    {
      id: 'rapidfire-grammar',
      title: '⚡ Grammar Lightning',
      description: 'Test your grammar skills with rapid-fire questions! 30 seconds per question.',
      difficulty: 'Easy',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-600',
      questions: 'Grammar & Tenses',
      route: '/games/rapidfire?type=grammar'
    },
    {
      id: 'rapidfire-vocabulary',
      title: '📚 Vocabulary Sprint',
      description: 'How many words can you define? 30 seconds each!',
      difficulty: 'Medium',
      icon: Brain,
      color: 'from-blue-500 to-cyan-600',
      questions: 'Word Meanings',
      route: '/games/rapidfire?type=vocabulary'
    },
    {
      id: 'rapidfire-idioms',
      title: '🎯 Idiom Master',
      description: 'Challenge yourself with English idioms! 30 seconds to answer.',
      difficulty: 'Hard',
      icon: Star,
      color: 'from-purple-500 to-pink-600',
      questions: 'Idioms & Phrases',
      route: '/games/rapidfire?type=idioms'
    },
    {
      id: 'rapidfire-pronunciation',
      title: '🗣️ Pronunciation Rush',
      description: 'Identify correct pronunciations! 30 seconds each question.',
      difficulty: 'Medium',
      icon: Volume2,
      color: 'from-orange-500 to-red-600',
      questions: 'Phonetics & Sounds',
      route: '/games/rapidfire?type=pronunciation'
    }
  ];

  const wordBuilderGames = [
    {
      id: 'wordbuilder-basic',
      title: '🎯 Sentence Builder',
      description: 'Arrange scrambled words to form correct sentences!',
      difficulty: 'Easy',
      icon: Target,
      color: 'from-teal-500 to-green-600',
      questions: 'Simple Sentences',
      rounds: 5,
      route: '/games/wordbuilder?type=basic'
    },
    {
      id: 'wordbuilder-complex',
      title: '🚀 Advanced Constructor',
      description: 'Build complex sentences with multiple clauses!',
      difficulty: 'Hard',
      icon: Rocket,
      color: 'from-indigo-500 to-purple-600',
      questions: 'Complex Sentences',
      rounds: 5,
      route: '/games/wordbuilder?type=complex'
    },
    {
      id: 'wordbuilder-questions',
      title: '❓ Question Former',
      description: 'Create proper questions from scrambled words!',
      difficulty: 'Medium',
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-600',
      questions: 'Question Formation',
      rounds: 5,
      route: '/games/wordbuilder?type=questions'
    },
    {
      id: 'wordbuilder-challenge',
      title: '🏆 Ultimate Challenge',
      description: 'Mix of all sentence types - are you ready?',
      difficulty: 'Expert',
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
      questions: 'Mixed Difficulty',
      rounds: 10,
      route: '/games/wordbuilder?type=challenge'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-blue-600 bg-blue-100';
      case 'Hard': return 'text-purple-600 bg-purple-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const GameCard = ({ game }) => {
    const Icon = game.icon;
    return (
      <Card hover className="group cursor-pointer" onClick={() => navigate(game.route)}>
        <div className={`h-24 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
          <Icon size={48} className="text-white" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-text-primary dark:text-text-dark">
              {game.title}
            </h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(game.difficulty)}`}>
              {game.difficulty}
            </span>
          </div>
          
          <p className="text-text-secondary dark:text-text-dark/70 text-sm">
            {game.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-text-dark/60">
            <span className="font-medium">📋 {game.questions}</span>
            {game.rounds && <span>• {game.rounds} rounds</span>}
          </div>
          
          <Button 
            variant="primary" 
            className="w-full mt-4"
            icon={Zap}
          >
            Play Now
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <PageLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary dark:text-text-dark mb-4">
            🎮 Learning Games
          </h1>
          <p className="text-lg text-text-secondary dark:text-text-dark/70 max-w-2xl mx-auto">
            Challenge yourself with fun, interactive games designed to improve your English skills
          </p>
        </div>

        {/* Rapid Fire Games Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark">
                ⚡ Rapid Fire Challenges
              </h2>
              <p className="text-sm text-text-secondary dark:text-text-dark/70">
                Answer unique questions in 30 seconds - no repeats, beat the clock!
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rapidFireGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* Word Builder Games Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark">
                🎯 Word Builder Games
              </h2>
              <p className="text-sm text-text-secondary dark:text-text-dark/70">
                Build sentences from scrambled words - test your grammar!
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wordBuilderGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/20">
          <div className="text-center py-8">
            <Award className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-2">
              Ready to Level Up?
            </h3>
            <p className="text-text-secondary dark:text-text-dark/70 mb-4">
              Play games daily to earn XP and unlock achievements!
            </p>
            <div className="flex gap-6 justify-center text-sm">
              <div>
                <p className="text-2xl font-bold text-primary">8</p>
                <p className="text-text-secondary dark:text-text-dark/70">Game Types</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">∞</p>
                <p className="text-text-secondary dark:text-text-dark/70">Questions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">4</p>
                <p className="text-text-secondary dark:text-text-dark/70">Difficulty Levels</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

export default Games;
