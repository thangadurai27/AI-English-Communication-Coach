import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, BookOpen, Award, Target } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [dashRes, weeklyRes, skillsRes] = await Promise.all([
          axios.get(API_ENDPOINTS.DASHBOARD, config),
          axios.get(API_ENDPOINTS.WEEKLY, config),
          axios.get(API_ENDPOINTS.SKILLS, config),
        ]);

        setDashboardData(dashRes.data);
        
        // Format weekly data for chart
        const formattedWeekly = Object.keys(weeklyRes.data).map(day => ({
          day: day.substring(0, 3),
          sessions: weeklyRes.data[day].sessions,
          xp: weeklyRes.data[day].xp,
          minutes: weeklyRes.data[day].minutes,
        }));
        setWeeklyData(formattedWeekly);

        // Format skills data for radar chart
        const formattedSkills = [
          { skill: t('pronunciation'), value: skillsRes.data.pronunciation },
          { skill: t('fluency'), value: skillsRes.data.fluency },
          { skill: t('grammar'), value: skillsRes.data.grammar },
          { skill: t('vocabulary'), value: skillsRes.data.vocabulary },
        ];
        setSkillsData(formattedSkills);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  const progress = dashboardData?.progress || {};
  const weeklyStats = dashboardData?.weeklyStats || {};

  return (
    <PageLayout>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {t('welcomeBack')}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{t('totalSessions')}</p>
                <p className="text-3xl font-bold text-blue-600">{progress.totalSessions || 0}</p>
              </div>
              <BookOpen className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{t('xpEarned')}</p>
                <p className="text-3xl font-bold text-green-600">{progress.totalXP || 0}</p>
              </div>
              <Trophy className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{t('currentLevel')}</p>
                <p className="text-2xl font-bold text-purple-600">{t(progress.level || 'Beginner')}</p>
              </div>
              <Award className="text-purple-500" size={40} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Week</p>
                <p className="text-3xl font-bold text-orange-600">{weeklyStats.sessionsThisWeek || 0}</p>
              </div>
              <Target className="text-orange-500" size={40} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="mr-2" size={24} />
              {t('weeklyProgress')}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#3b82f6" name="Sessions" />
                <Bar dataKey="xp" fill="#10b981" name="XP" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Breakdown Radar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{t('skillBreakdown')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Skills" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Improvement Trend */}
        {dashboardData?.improvementTrend && dashboardData.improvementTrend.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">{t('improvementTrend')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.improvementTrend.map(item => ({
                date: new Date(item.date).toLocaleDateString(),
                ...item
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pronunciation" stroke="#3b82f6" name={t('pronunciation')} />
                <Line type="monotone" dataKey="fluency" stroke="#10b981" name={t('fluency')} />
                <Line type="monotone" dataKey="grammar" stroke="#f59e0b" name={t('grammar')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Sessions and Mistakes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{t('recentSessions')}</h2>
            {dashboardData?.recentSessions && dashboardData.recentSessions.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentSessions.map((session, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-semibold capitalize">{session.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.createdAt).toLocaleDateString()} - XP: {session.xpEarned}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No sessions yet. Start practicing!</p>
            )}
          </div>

          {/* Top Mistakes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{t('topMistakes')}</h2>
            {dashboardData?.topMistakes && dashboardData.topMistakes.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.topMistakes.map((mistake, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">{mistake.word || mistake.phrase}</p>
                      <p className="text-sm text-gray-500 capitalize">{mistake.category}</p>
                    </div>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {mistake.frequency}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No mistakes recorded yet. Great job!</p>
            )}
          </div>
        </div>
    </PageLayout>
  );
}

export default Dashboard;
