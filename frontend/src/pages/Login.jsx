import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <PageLayout maxWidth="sm">
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-glow mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-text-primary dark:text-text-dark mb-2">
              Welcome Back
            </h2>
            <p className="text-text-secondary dark:text-text-dark/70">
              Continue your English learning journey
            </p>
          </div>

          <Card className="animate-slide-up">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl animate-slide-down">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
                icon={LogIn}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary dark:text-text-dark/70">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary dark:text-text-dark/70">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
