import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Menu, X, Moon, Sun, User, LogOut, Home as HomeIcon, BookOpen, Gamepad2, MessageCircle, BarChart3 } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { to: '/', label: 'home', icon: HomeIcon },
    ...(userInfo ? [
      { to: '/dashboard', label: 'dashboard', icon: BarChart3 },
      { to: '/practice', label: 'practice', icon: BookOpen },
      { to: '/lessons', label: 'lessons', icon: BookOpen },
      { to: '/games', label: 'games', icon: Gamepad2 },
      { to: '/conversation', label: 'conversation', icon: MessageCircle },
    ] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg shadow-soft border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-glow flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              English Coach
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-text-secondary dark:text-text-dark hover:text-primary dark:hover:text-primary-light px-3 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10"
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{t(link.label)}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-card-dark text-text-primary dark:text-text-dark text-sm focus:outline-none focus:border-primary transition-all duration-300"
              value={i18n.language}
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="ka">ಕನ್ನಡ</option>
            </select>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </button>

            {userInfo ? (
              <>
                {/* Profile Button */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{userInfo.name}</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:shadow-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-primary hover:bg-primary/10 transition-all duration-300 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-glow transition-all duration-300 text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-text-primary dark:text-text-dark" />
            ) : (
              <Menu className="h-6 w-6 text-text-primary dark:text-text-dark" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-card-dark animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary dark:text-text-dark hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{t(link.label)}</span>
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{userInfo.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">{t('logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg text-center text-primary hover:bg-primary/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg text-center bg-gradient-to-r from-primary to-primary-dark text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
