import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, UserPlus, LogIn } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password } = formData;

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
        'http://localhost:5000/api/auth/register',
        { name, email, password },
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-accent-dark rounded-2xl shadow-glow-green mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-heading font-bold text-text-primary dark:text-text-dark mb-2">
              Create Account
            </h2>
            <p className="text-text-secondary dark:text-text-dark/70">
              Start your journey to English mastery
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
                label="Full Name"
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                icon={User}
                required
              />

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
                variant="secondary"
                icon={UserPlus}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary dark:text-text-dark/70">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </Card>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="p-4">
              <p className="text-2xl font-bold text-primary dark:text-primary-light">Free</p>
              <p className="text-sm text-text-secondary dark:text-text-dark/70">Forever</p>
            </div>
            <div className="p-4">
              <p className="text-2xl font-bold text-primary dark:text-primary-light">AI</p>
              <p className="text-sm text-text-secondary dark:text-text-dark/70">Powered</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;
