import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Recorder from '../components/Recorder';
import PageLayout from '../components/ui/PageLayout';
import SectionTitle from '../components/ui/SectionTitle';
import { Mic } from 'lucide-react';

const Practice = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <PageLayout maxWidth="5xl">
      <SectionTitle
        title="Practice Your English"
        subtitle="Speak naturally and get instant AI-powered feedback"
        icon={Mic}
        align="center"
      />

      <Recorder />
    </PageLayout>
  );
};

export default Practice;
