import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { User, Award, Trophy, Globe } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PageLayout from '../components/ui/PageLayout';

function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'ka', name: 'ಕನ್ನಡ (Kannada)' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [userRes, progressRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ME, config),
        axios.get(API_ENDPOINTS.DASHBOARD, config),
      ]);

      setUser(userRes.data);
      setProgress(progressRes.data.progress);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const changeLanguage = async (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.UPDATE,
        { language: langCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, language: langCode });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('English Learning Progress Report', 20, 20);
    
    // User Info
    doc.setFontSize(12);
    doc.text(`Name: ${user.name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);
    doc.text(`Level: ${progress.level}`, 20, 60);
    doc.text(`Total XP: ${progress.totalXP}`, 20, 70);
    doc.text(`Total Sessions: ${progress.totalSessions}`, 20, 80);
    
    // Skills Table
    doc.autoTable({
      startY: 90,
      head: [['Skill', 'Average Score']],
      body: [
        ['Pronunciation', `${progress.averagePronunciation || 0}%`],
        ['Fluency', `${progress.averageFluency || 0}%`],
        ['Grammar', `${progress.averageGrammar || 0}%`],
        ['Vocabulary', `${progress.averageVocabulary || 0}%`],
      ],
    });
    
    // Save PDF
    doc.save(`Progress_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  const getLevelProgress = () => {
    const xp = progress?.totalXP || 0;
    if (xp >= 1000) return { current: 1000, next: 1000, percent: 100, nextLevel: 'Expert' };
    if (xp >= 500) return { current: xp - 500, next: 500, percent: ((xp - 500) / 500) * 100, nextLevel: 'Expert' };
    if (xp >= 200) return { current: xp - 200, next: 300, percent: ((xp - 200) / 300) * 100, nextLevel: 'Advanced' };
    return { current: xp, next: 200, percent: (xp / 200) * 100, nextLevel: 'Intermediate' };
  };

  const levelProgress = getLevelProgress();

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random&size=128`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white mr-4"
                />
                <div>
                  <h1 className="text-3xl font-bold">{user?.name}</h1>
                  <p className="text-purple-100">{user?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <Trophy className="mr-2" size={32} />
                  <span className="text-4xl font-bold">{progress?.totalXP || 0}</span>
                </div>
                <p className="text-sm">Total XP</p>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">{t(progress?.level || 'Beginner')}</span>
              <span className="text-gray-600">Next: {t(levelProgress.nextLevel)}</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                style={{ width: `${levelProgress.percent}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {levelProgress.current} / {levelProgress.next} XP
            </p>
          </div>

          {/* Stats Grid */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{progress?.totalSessions || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(progress?.averagePronunciation || 0)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('pronunciation')}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {Math.round(progress?.averageFluency || 0)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('fluency')}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(progress?.averageGrammar || 0)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('grammar')}</p>
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <Globe className="mr-2" size={24} />
                Language / भाषा / மொழி / ಭಾಷೆ
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`p-3 rounded-lg border-2 transition ${
                      i18n.language === lang.code
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <p className="font-semibold">{lang.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={downloadReport}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
            >
              📄 Download Progress Report (PDF)
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Profile;
