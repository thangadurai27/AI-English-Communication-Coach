import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button';
import ScoreBadge from './ui/ScoreBadge';
import Loader from './ui/Loader';
import { Mic, MicOff, RotateCcw, Sparkles, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

const Recorder = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [micPermission, setMicPermission] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Check microphone permission on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then((result) => {
        setMicPermission(result.state);
        result.onchange = () => {
          setMicPermission(result.state);
        };
      }).catch(() => {
        setMicPermission('prompt');
      });
    }
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-500" />
          <p className="text-red-600 dark:text-red-400 font-medium">
            Browser doesn't support speech recognition. Please use Chrome or Edge.
          </p>
        </div>
      </Card>
    );
  }

  const startListening = () => {
    setError('');
    setAnalysis(null);
    try {
      SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US'
      });
    } catch (err) {
      console.error('Speech recognition error:', err);
      setError('Failed to start speech recognition. Please check microphone permissions.');
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please speak something first!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/ai/analyze',
        { text: transcript },
        config
      );

      setAnalysis(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze text');
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetTranscript();
    setAnalysis(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How to use:</h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Click the microphone button below to start recording</li>
              <li>Allow microphone access when prompted by your browser</li>
              <li>Speak clearly in English (the text will appear automatically)</li>
              <li>Click the microphone again to stop recording</li>
              <li>Click "Analyze My Speech" to get AI feedback</li>
            </ol>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
              ✅ Works best in Chrome, Edge, or Safari • 🎤 Requires microphone access
            </p>
          </div>
        </div>
      </Card>

      {/* Recording Controls */}
      <Card gradient className="text-center">
        {/* Microphone Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={listening ? stopListening : startListening}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              listening
                ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-glow animate-pulse-slow'
                : 'bg-gradient-to-br from-primary to-primary-dark shadow-lg hover:shadow-glow'
            }`}
          >
            {listening ? (
              <MicOff className="h-16 w-16 text-white" />
            ) : (
              <Mic className="h-16 w-16 text-white" />
            )}
            
            {/* Pulse rings when recording */}
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></span>
              </>
            )}
          </button>
        </div>

        {listening && (
          <div className="mb-6 animate-bounce-slow">
            <span className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              Listening... Speak now!
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Button
            onClick={handleReset}
            variant="ghost"
            icon={RotateCcw}
          >
            Reset
          </Button>
        </div>

        {/* Transcript Display */}
        <Card className="mb-6 min-h-[120px] bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-text-primary dark:text-text-dark mb-3 flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Your Speech:
            {listening && (
              <span className="ml-2 text-xs text-red-500 animate-pulse font-normal">
                ● Recording...
              </span>
            )}
          </h3>
          <p className="text-text-primary dark:text-text-dark leading-relaxed text-lg">
            {transcript || (
              <span className="text-text-secondary dark:text-text-dark/50 italic text-base">
                Click the microphone and start speaking...
              </span>
            )}
          </p>
          {transcript && (
            <div className="mt-3 text-sm text-text-secondary dark:text-text-dark/50">
              {transcript.split(' ').length} words
            </div>
          )}
        </Card>

        <Button
          onClick={handleAnalyze}
          disabled={loading || !transcript.trim()}
          className="w-full"
          size="lg"
          icon={Sparkles}
        >
          {loading ? 'Analyzing...' : 'Analyze My Speech'}
        </Button>

        {error && (
          <Card className="mt-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Card>
        )}
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-12">
          <Loader size="lg" text="Analyzing your speech with AI..." />
        </Card>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="space-y-6 animate-slide-up">
          <Card gradient>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-heading font-bold text-text-primary dark:text-text-dark mb-2">
                AI Analysis Results
              </h2>
              <p className="text-text-secondary dark:text-text-dark/70">
                Here's what we found about your speech
              </p>
            </div>

            {/* Score Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <ScoreBadge score={analysis.grammar || 0} label="Grammar" />
              </div>
              <div className="text-center">
                <ScoreBadge score={analysis.vocabulary || 0} label="Vocab" />
              </div>
              <div className="text-center">
                <ScoreBadge score={analysis.fluency || 0} label="Fluency" />
              </div>
              <div className="text-center">
                <ScoreBadge score={analysis.pronunciation || 0} label="Pronunciation" />
              </div>
            </div>
          </Card>

          {/* Detailed Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grammar Analysis */}
            <Card hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark">Grammar</h3>
              </div>
              <p className="text-text-secondary dark:text-text-dark/70 mb-3">
                {typeof analysis.grammar === 'string' ? analysis.grammar : 'Analysis completed'}
              </p>
              {analysis.mistake_explanation && (
                <div className="text-sm text-text-secondary dark:text-text-dark/60 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <strong>Mistakes Found:</strong> {analysis.mistake_explanation}
                </div>
              )}
              {analysis.improved_version && analysis.improved_version !== transcript && (
                <div className="text-sm text-accent dark:text-accent-light mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <strong>Improved Version:</strong> {analysis.improved_version}
                </div>
              )}
            </Card>

            {/* Vocabulary Analysis */}
            <Card hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark">Vocabulary</h3>
              </div>
              <p className="text-text-secondary dark:text-text-dark/70 mb-3">
                {typeof analysis.vocabulary === 'string' ? analysis.vocabulary : 'Good word choices!'}
              </p>
            </Card>

            {/* Fluency Analysis */}
            <Card hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark">Fluency</h3>
              </div>
              <p className="text-text-secondary dark:text-text-dark/70 mb-3">
                Score: {analysis.fluency}%
              </p>
              <div className="text-sm space-y-2">
                {analysis.pace && (
                  <p className="text-text-secondary dark:text-text-dark/60">
                    <strong>Pace:</strong> {analysis.pace}%
                  </p>
                )}
                {analysis.clarity && (
                  <p className="text-text-secondary dark:text-text-dark/60">
                    <strong>Clarity:</strong> {analysis.clarity}%
                  </p>
                )}
                {analysis.fillerWords !== undefined && (
                  <p className="text-text-secondary dark:text-text-dark/60">
                    <strong>Filler Words:</strong> {analysis.fillerWords}
                  </p>
                )}
                {analysis.emotionTone && (
                  <p className="text-text-secondary dark:text-text-dark/60">
                    <strong>Tone:</strong> {analysis.emotionTone}
                  </p>
                )}
              </div>
            </Card>

            {/* Pronunciation Analysis */}
            <Card hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark">Pronunciation</h3>
              </div>
              <p className="text-text-secondary dark:text-text-dark/70 mb-3">
                Score: {analysis.pronunciation}%
              </p>
              {analysis.pronunciation_details && (
                <div className="text-sm space-y-2">
                  {analysis.pronunciation_details.difficult_sounds && analysis.pronunciation_details.difficult_sounds.length > 0 && (
                    <p className="text-text-secondary dark:text-text-dark/60">
                      <strong>Difficult Sounds:</strong> {analysis.pronunciation_details.difficult_sounds.join(', ')}
                    </p>
                  )}
                  {analysis.pronunciation_details.stress_pattern && (
                    <p className="text-text-secondary dark:text-text-dark/60">
                      <strong>Stress Pattern:</strong> {analysis.pronunciation_details.stress_pattern}
                    </p>
                  )}
                  {analysis.pronunciation_details.phonetic_output && (
                    <p className="text-text-secondary dark:text-text-dark/60 font-mono">
                      {analysis.pronunciation_details.phonetic_output}
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Motivation Message */}
          {analysis.motivation && (
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-medium text-text-primary dark:text-text-dark">
                {analysis.motivation}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Recorder;
