import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "dashboard": "Dashboard",
      "practice": "Practice",
      "lessons": "Lessons",
      "games": "Games",
      "conversation": "Conversation",
      "challenges": "Challenges",
      "profile": "Profile",
      "logout": "Logout",
      
      // Dashboard
      "welcomeBack": "Welcome Back",
      "totalSessions": "Total Sessions",
      "xpEarned": "XP Earned",
      "currentLevel": "Current Level",
      "weeklyProgress": "Weekly Progress",
      "skillBreakdown": "Skill Breakdown",
      "pronunciation": "Pronunciation",
      "fluency": "Fluency",
      "grammar": "Grammar",
      "vocabulary": "Vocabulary",
      "recentSessions": "Recent Sessions",
      "improvementTrend": "Improvement Trend",
      "topMistakes": "Top Mistakes to Focus On",
      
      // Practice
      "startPracticing": "Start Practicing",
      "clickToRecord": "Click to Start Recording",
      "listening": "Listening...",
      "analyzing": "Analyzing...",
      "speak": "Speak",
      "analyzing_text": "Analyzing your speech...",
      
      // Levels
      "Beginner": "Beginner",
      "Intermediate": "Intermediate",
      "Advanced": "Advanced",
      "Expert": "Expert",
      
      // Games
      "rapidFire": "Rapid Fire",
      "wordBuilder": "Word Builder",
      "playNow": "Play Now",
      
      // Common
      "loading": "Loading...",
      "save": "Save",
      "cancel": "Cancel",
      "submit": "Submit",
      "error": "Error",
      "success": "Success",
    }
  },
  hi: {
    translation: {
      "dashboard": "डैशबोर्ड",
      "practice": "अभ्यास",
      "lessons": "पाठ",
      "games": "खेल",
      "conversation": "बातचीत",
      "challenges": "चुनौतियाँ",
      "profile": "प्रोफ़ाइल",
      "logout": "लॉग आउट",
      
      "welcomeBack": "वापसी पर स्वागत है",
      "totalSessions": "कुल सत्र",
      "xpEarned": "XP अर्जित",
      "currentLevel": "वर्तमान स्तर",
      "weeklyProgress": "साप्ताहिक प्रगति",
      "skillBreakdown": "कौशल विवरण",
      "pronunciation": "उच्चारण",
      "fluency": "प्रवाह",
      "grammar": "व्याकरण",
      "vocabulary": "शब्दावली",
      "recentSessions": "हाल के सत्र",
      "improvementTrend": "सुधार प्रवृत्ति",
      "topMistakes": "ध्यान देने योग्य गलतियाँ",
      
      "startPracticing": "अभ्यास शुरू करें",
      "clickToRecord": "रिकॉर्डिंग शुरू करने के लिए क्लिक करें",
      "listening": "सुन रहा है...",
      "analyzing": "विश्लेषण कर रहा है...",
      "speak": "बोलें",
      
      "Beginner": "शुरुआती",
      "Intermediate": "मध्यवर्ती",
      "Advanced": "उन्नत",
      "Expert": "विशेषज्ञ",
      
      "rapidFire": "रैपिड फायर",
      "wordBuilder": "शब्द निर्माता",
      "playNow": "अभी खेलें",
      
      "loading": "लोड हो रहा है...",
      "save": "सहेजें",
      "cancel": "रद्द करें",
      "submit": "जमा करें",
      "error": "त्रुटि",
      "success": "सफलता",
    }
  },
  ta: {
    translation: {
      "dashboard": "டாஷ்போர்டு",
      "practice": "பயிற்சி",
      "lessons": "பாடங்கள்",
      "games": "விளையாட்டுகள்",
      "conversation": "உரையாடல்",
      "challenges": "சவால்கள்",
      "profile": "சுயவிவரம்",
      "logout": "வெளியேறு",
      
      "welcomeBack": "மீண்டும் வரவேற்கிறோம்",
      "totalSessions": "மொத்த அமர்வுகள்",
      "xpEarned": "XP சம்பாதித்தது",
      "currentLevel": "தற்போதைய நிலை",
      "weeklyProgress": "வார முன்னேற்றம்",
      "skillBreakdown": "திறன் பகுப்பாய்வு",
      "pronunciation": "உச்சரிப்பு",
      "fluency": "சரளம்",
      "grammar": "இலக்கணம்",
      "vocabulary": "சொல்வளம்",
      "recentSessions": "சமீபத்திய அமர்வுகள்",
      "improvementTrend": "முன்னேற்ற போக்கு",
      "topMistakes": "கவனிக்க வேண்டிய தவறுகள்",
      
      "startPracticing": "பயிற்சியைத் தொடங்கு",
      "clickToRecord": "பதிவைத் தொடங்க கிளிக் செய்க",
      "listening": "கேட்கிறது...",
      "analyzing": "பகுப்பாய்வு செய்கிறது...",
      "speak": "பேசு",
      
      "Beginner": "தொடக்கநிலை",
      "Intermediate": "இடைநிலை",
      "Advanced": "மேம்பட்ட",
      "Expert": "நிபுணர்",
      
      "rapidFire": "விரைவு விளையாட்டு",
      "wordBuilder": "சொல் கட்டுபவர்",
      "playNow": "இப்போது விளையாடு",
      
      "loading": "ஏற்றுகிறது...",
      "save": "சேமி",
      "cancel": "ரத்து செய்",
      "submit": "சமர்ப்பி",
      "error": "பிழை",
      "success": "வெற்றி",
    }
  },
  ka: {
    translation: {
      "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "practice": "ಅಭ್ಯಾಸ",
      "lessons": "ಪಾಠಗಳು",
      "games": "ಆಟಗಳು",
      "conversation": "ಸಂಭಾಷಣೆ",
      "challenges": "ಸವಾಲುಗಳು",
      "profile": "ಪ್ರೊಫೈಲ್",
      "logout": "ಲಾಗ್ ಔಟ್",
      
      "welcomeBack": "ಮತ್ತೆ ಸುಸ್ವಾಗತ",
      "totalSessions": "ಒಟ್ಟು ಅಧಿವೇಶನಗಳು",
      "xpEarned": "XP ಗಳಿಸಲಾಗಿದೆ",
      "currentLevel": "ಪ್ರಸ್ತುತ ಮಟ್ಟ",
      "weeklyProgress": "ಸಾಪ್ತಾಹಿಕ ಪ್ರಗತಿ",
      "skillBreakdown": "ಕೌಶಲ್ಯ ವಿವರಣೆ",
      "pronunciation": "ಉಚ್ಚಾರಣೆ",
      "fluency": "ಪ್ರವಾಹ",
      "grammar": "ವ್ಯಾಕರಣ",
      "vocabulary": "ಶಬ್ದಕೋಶ",
      "recentSessions": "ಇತ್ತೀಚಿನ ಅಧಿವೇಶನಗಳು",
      "improvementTrend": "ಸುಧಾರಣೆ ಪ್ರವೃತ್ತಿ",
      "topMistakes": "ಗಮನಿಸಬೇಕಾದ ತಪ್ಪುಗಳು",
      
      "startPracticing": "ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ",
      "clickToRecord": "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
      "listening": "ಕೇಳುತ್ತಿದೆ...",
      "analyzing": "ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
      "speak": "ಮಾತನಾಡು",
      
      "Beginner": "ಆರಂಭಿಕ",
      "Intermediate": "ಮಧ್ಯಮ",
      "Advanced": "ಉನ್ನತ",
      "Expert": "ಪರಿಣತ",
      
      "rapidFire": "ವೇಗದ ಆಟ",
      "wordBuilder": "ಪದ ನಿರ್ಮಾಪಕ",
      "playNow": "ಈಗ ಆಡಿ",
      
      "loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      "save": "ಉಳಿಸಿ",
      "cancel": "ರದ್ದುಮಾಡಿ",
      "submit": "ಸಲ್ಲಿಸಿ",
      "error": "ದೋಷ",
      "success": "ಯಶಸ್ಸು",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
