import Groq from 'groq-sdk';
import Session from '../models/Session.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Generate AI Lesson
// @route   POST /api/lessons/generate
// @access  Private
export const generateLesson = async (req, res) => {
  try {
    const { topic } = req.body;
    console.log('📚 Generating lesson for topic:', topic);

    if (!topic) {
      return res.status(400).json({ message: 'Please provide a topic' });
    }

    console.log('🤖 Calling GROQ API...');
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an English teacher. Generate a comprehensive lesson for the topic "${topic}". Return JSON with this structure:
{
  "title": "Lesson title",
  "description": "Brief description",
  "vocabulary": [
    {"word": "word1", "definition": "meaning", "example": "example sentence"}
  ],
  "phrases": ["useful phrase 1", "useful phrase 2"],
  "examples": ["example conversation or sentence"],
  "tips": "Helpful tips for learners"
}`
        },
        {
          role: 'user',
          content: `Generate a lesson for: ${topic}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content;
    console.log('✅ GROQ Response received:', responseText?.substring(0, 100) + '...');
    let lesson;
    
    try {
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      lesson = JSON.parse(cleanedResponse);
      console.log('✅ Lesson generated successfully');
    } catch (parseError) {
      console.log('⚠️ JSON parse error, using fallback lesson');
      lesson = {
        title: topic,
        description: `Learn about ${topic}`,
        vocabulary: [],
        phrases: [],
        examples: [],
        tips: ''
      };
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error generating lesson:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Error generating lesson', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

// @desc    Rapid Fire Game - Get random question
// @route   GET /api/lessons/rapidfire
// @access  Private
export const getRapidFireQuestion = async (req, res) => {
  try {
    const { type = 'grammar', round = 1, exclude = '' } = req.query;
    const excludedQuestions = exclude ? exclude.split(',').filter(q => q.trim()) : [];
    const currentRound = parseInt(round);
    console.log(`⚡ Generating ${type} rapid fire question (Round ${currentRound}, excluding ${excludedQuestions.length} previous)...`);

    // Determine difficulty level based on game type and round progression
    const getDifficultyLevel = (gameType, round) => {
      const roundNum = parseInt(round);
      
      switch(gameType) {
        case 'grammar': // Easy - Progressive difficulty
          if (roundNum <= 2) return 'basic';
          if (roundNum <= 4) return 'intermediate';
          return 'advanced';
        
        case 'vocabulary': // Medium - Consistent medium level
          if (roundNum <= 2) return 'intermediate';
          return 'advanced';
        
        case 'idioms': // Hard - Consistent hard level
          return 'advanced';
        
        case 'pronunciation': // Medium - Progressive medium to hard
          if (roundNum <= 3) return 'intermediate';
          return 'advanced';
        
        default:
          return 'basic';
      }
    };

    const difficultyLevel = getDifficultyLevel(type, currentRound);
    console.log(`📊 Difficulty level for round ${currentRound}: ${difficultyLevel}`);

    const prompts = {
      grammar: {
        basic: `Generate a BASIC grammar question suitable for beginners. Focus on: simple present/past tense, basic subject-verb agreement, common prepositions (in/on/at), articles (a/an/the), or plural forms. Use common, everyday vocabulary. Return JSON: {"question": "...", "answer": "..."}`,
        intermediate: `Generate an INTERMEDIATE grammar question. Focus on: present perfect, past continuous, conditionals (type 1 & 2), comparative/superlative, relative clauses, or modal verbs (should/could/would). Use moderately complex sentences. Return JSON: {"question": "...", "answer": "..."}`,
        advanced: `Generate an ADVANCED grammar question. Focus on: perfect continuous tenses, conditionals (type 3), passive voice, reported speech, subjunctive mood, or advanced modals. Use sophisticated structures. Return JSON: {"question": "...", "answer": "..."}`
      },
      vocabulary: {
        basic: `Generate a BASIC vocabulary question about common everyday words. Focus on: household items, daily activities, basic emotions, colors, numbers, or family members. Return JSON: {"question": "...", "answer": "..."}`,
        intermediate: `Generate an INTERMEDIATE vocabulary question. Focus on: synonyms of common words, collocations, phrasal verbs, word formation (prefixes/suffixes), or contextual meanings. Use practical, business/academic vocabulary. Return JSON: {"question": "...", "answer": "..."}`,
        advanced: `Generate an ADVANCED vocabulary question. Focus on: nuanced synonyms, formal/academic vocabulary, idiomatic expressions, etymology, or sophisticated word usage. Use challenging vocabulary. Return JSON: {"question": "...", "answer": "..."}`
      },
      idioms: {
        basic: `Generate a BASIC idiom or common expression. Focus on: very common idioms (piece of cake, break the ice), everyday expressions, or simple phrasal verbs (give up, look for). Return JSON: {"question": "...", "answer": "..."}`,
        intermediate: `Generate an INTERMEDIATE idiom or phrasal verb. Focus on: common idioms (actions speak louder than words), business expressions, or two-word phrasal verbs. Return JSON: {"question": "...", "answer": "..."}`,
        advanced: `Generate an ADVANCED idiom, proverb, or complex phrasal verb. Focus on: sophisticated idioms, literary expressions, three-word phrasal verbs, or cultural references. Return JSON: {"question": "...", "answer": "..."}`
      },
      pronunciation: {
        basic: `Generate a BASIC pronunciation question. Focus on: simple silent letters (knife, write), basic rhymes (cat/hat), or common word stress in 2-syllable words. Use everyday vocabulary. Return JSON: {"question": "...", "answer": "..."}`,
        intermediate: `Generate an INTERMEDIATE pronunciation question. Focus on: homophones (their/there), word stress in 3-syllable words, minimal pairs (ship/sheep), or linking sounds. Return JSON: {"question": "...", "answer": "..."}`,
        advanced: `Generate an ADVANCED pronunciation question. Focus on: complex stress patterns (4+ syllables), schwa sounds, intonation patterns, American vs British pronunciation, or challenging phonemes. Return JSON: {"question": "...", "answer": "..."}`
      }
    };

    const selectedPrompt = prompts[type]?.[difficultyLevel] || prompts.grammar.basic;
    const excludePrompt = excludedQuestions.length > 0 
      ? `\n\nIMPORTANT: Do NOT repeat these questions: ${excludedQuestions.slice(-3).join('; ')}. Generate a completely different question.`
      : '';

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: selectedPrompt + excludePrompt
        },
        {
          role: 'user',
          content: `Give me a unique ${difficultyLevel}-level ${type} question for round ${currentRound}. Make it educational and progressively challenging.`
        }
      ],
      temperature: 1.2,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    let result;
    try {
      result = JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      // Difficulty-based fallback questions
      const fallbacks = {
        grammar: {
          basic: [
            { question: 'She __ to school every day. (go/goes/going)', answer: 'goes' },
            { question: 'I __ a book yesterday. (read/reads/reading)', answer: 'read' },
            { question: 'They __ playing in the park. (is/are/am)', answer: 'are' }
          ],
          intermediate: [
            { question: 'I have __ finished my homework. (just/yet/already)', answer: 'just' },
            { question: 'If it __ tomorrow, we will stay home. (rain/rains/will rain)', answer: 'rains' },
            { question: 'This book is __ than that one. (interesting/more interesting/most interesting)', answer: 'more interesting' }
          ],
          advanced: [
            { question: 'The report __ by the team before the deadline. (was completed/has been completed/had been completed)', answer: 'had been completed' },
            { question: 'If I __ you, I would have accepted the offer. (was/were/had been)', answer: 'had been' },
            { question: 'She suggested that he __ more carefully. (study/studies/studied)', answer: 'study' }
          ]
        },
        vocabulary: {
          basic: [
            { question: 'What do you call the room where you sleep?', answer: 'bedroom' },
            { question: 'What is the opposite of "hot"?', answer: 'cold' },
            { question: 'What do you call your mother\'s mother?', answer: 'grandmother' }
          ],
          intermediate: [
            { question: 'What is a synonym for "difficult"?', answer: 'challenging/hard' },
            { question: 'What does "give up" mean?', answer: 'quit/stop trying' },
            { question: 'What suffix makes "happy" into a noun?', answer: '-ness (happiness)' }
          ],
          advanced: [
            { question: 'What is a sophisticated synonym for "angry"?', answer: 'indignant/irate/furious' },
            { question: 'What does "ubiquitous" mean?', answer: 'everywhere/omnipresent' },
            { question: 'What is the opposite of "ephemeral"?', answer: 'permanent/eternal' }
          ]
        },
        idioms: {
          basic: [
            { question: 'What does "piece of cake" mean?', answer: 'very easy' },
            { question: 'What does "break the ice" mean?', answer: 'start a conversation' },
            { question: 'What does "give up" mean?', answer: 'quit/stop trying' }
          ],
          intermediate: [
            { question: 'What does "actions speak louder than words" mean?', answer: 'what you do is more important than what you say' },
            { question: 'What does "hit the nail on the head" mean?', answer: 'exactly right' },
            { question: 'What does "look forward to" mean?', answer: 'anticipate with pleasure' }
          ],
          advanced: [
            { question: 'What does "let the cat out of the bag" mean?', answer: 'reveal a secret' },
            { question: 'What does "burn the midnight oil" mean?', answer: 'work late into the night' },
            { question: 'What does "come up with" mean?', answer: 'think of/produce an idea' }
          ]
        },
        pronunciation: {
          basic: [
            { question: 'Which letter is silent in "knife"?', answer: 'k' },
            { question: 'Do "cat" and "hat" rhyme?', answer: 'yes' },
            { question: 'Which syllable is stressed in "BA-by"?', answer: 'first' }
          ],
          intermediate: [
            { question: 'Do "there" and "their" sound the same?', answer: 'yes' },
            { question: 'Which syllable is stressed in "im-POR-tant"?', answer: 'second' },
            { question: 'What is the difference between "ship" and "sheep"?', answer: 'short i vs long ee sound' }
          ],
          advanced: [
            { question: 'Which syllable is stressed in "pho-TO-gra-phy"?', answer: 'second' },
            { question: 'What is the schwa sound in "about"?', answer: 'ə (in "a")' },
            { question: 'How is "schedule" pronounced in British English?', answer: 'SHED-yool' }
          ]
        }
      };
      const pool = fallbacks[type]?.[difficultyLevel] || fallbacks.grammar.basic;
      result = pool[Math.floor(Math.random() * pool.length)];
    }
    
    console.log(`✅ ${difficultyLevel} ${type} question generated (Round ${currentRound}):`, result.question);
    res.json(result);
  } catch (error) {
    console.error('Error generating question:', error.message);
    res.status(500).json({ 
      message: 'Error generating question', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

// @desc    Word Builder - Get scrambled sentence
// @route   GET /api/lessons/wordbuilder/word
// @access  Private
export const getWordBuilderWord = async (req, res) => {
  try {
    const { type = 'basic', round = 1 } = req.query;
    const currentRound = parseInt(round);
    console.log(`🎯 Generating ${type} word builder challenge (Round ${currentRound})...`);

    // Determine difficulty level based on game type and round
    const getDifficultyLevel = (gameType, round) => {
      const roundNum = parseInt(round);
      
      switch(gameType) {
        case 'basic': // Easy - Progressive from very basic to intermediate
          if (roundNum <= 2) return 'basic';
          if (roundNum <= 4) return 'intermediate';
          return 'advanced';
        
        case 'complex': // Hard - Start intermediate, go to advanced
          if (roundNum <= 2) return 'intermediate';
          return 'advanced';
        
        case 'questions': // Medium - Progressive
          if (roundNum <= 2) return 'basic';
          if (roundNum <= 4) return 'intermediate';
          return 'advanced';
        
        case 'challenge': // Expert - Mix all, progressive
          if (roundNum <= 3) return 'intermediate';
          if (roundNum <= 7) return 'advanced';
          return 'expert';
        
        default:
          return 'basic';
      }
    };

    const difficultyLevel = getDifficultyLevel(type, currentRound);
    console.log(`📊 Sentence difficulty for round ${currentRound}: ${difficultyLevel}`);

    const prompts = {
      basic: {
        basic: 'Generate a SIMPLE sentence (4-5 words) using present simple tense about daily life: "I eat breakfast", "She reads books", "They play soccer". Use common vocabulary. Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}',
        intermediate: 'Generate a sentence (6-7 words) with simple adjectives or time expressions: "I usually drink coffee in the morning", "My brother plays guitar very well". Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}',
        advanced: 'Generate a sentence (7-8 words) with past tense or present continuous: "We were watching a movie yesterday evening", "She is studying English at university". Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}'
      },
      complex: {
        basic: 'Generate a compound sentence (7-8 words) with "and" or "but": "I like coffee but she prefers tea". Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}',
        intermediate: 'Generate a complex sentence (9-11 words) with subordinate clauses using "because", "although", "when", or "if": "Although it was raining we decided to go hiking". Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}',
        advanced: 'Generate an advanced sentence (11-13 words) with relative clauses or perfect tenses: "The project that we submitted yesterday received excellent feedback from the committee". Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}'
      },
      questions: {
        basic: 'Generate a SIMPLE question (4-6 words) with "What", "Where", or "Do": "What is your name", "Where do you live", "Do you like pizza". Return JSON: {"sentence": "correct question", "scrambled": ["word1", "word2", ...]}',
        intermediate: 'Generate a question (7-9 words) with "How", "Why", "When", or "Can": "How long have you been studying English", "Why do you like reading books". Return JSON: {"sentence": "correct question", "scrambled": ["word1", "word2", ...]}',
        advanced: 'Generate an advanced question (9-11 words) with perfect tenses or complex structures: "What would you have done if you had known earlier". Return JSON: {"sentence": "correct question", "scrambled": ["word1", "word2", ...]}'
      },
      challenge: {
        basic: 'Generate a sentence (8-9 words) with intermediate vocabulary and structure. Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}',
        intermediate: 'Generate a challenging sentence (10-12 words) with conditional, passive, or perfect tenses and formal vocabulary. Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}',
        advanced: 'Generate a complex sentence (12-14 words) with advanced structures: passive perfect, conditionals, or formal academic language. Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}',
        expert: 'Generate an expert-level sentence (14-16 words) with sophisticated vocabulary, multiple clauses, and complex grammatical structures typical of academic or professional writing. Return JSON: {"sentence": "correct sentence", "scrambled": ["word1", "word2", ...]}'
      }
    };

    const selectedPrompt = prompts[type]?.[difficultyLevel] || prompts.basic.basic;

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: selectedPrompt
        },
        {
          role: 'user',
          content: `Give me a unique ${difficultyLevel}-level sentence for round ${currentRound}. Make it educational and progressively challenging.`
        }
      ],
      temperature: 1.1, // Higher temperature for variety
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    let result;
    try {
      const parsed = JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
      result = {
        sentence: parsed.sentence,
        scrambled: parsed.scrambled.sort(() => Math.random() - 0.5)
      };
    } catch {
      // Difficulty-based fallback sentences pool
      const fallbacks = {
        basic: {
          basic: [
            'I eat breakfast every morning',
            'She reads books at night',
            'They play soccer on weekends',
            'He drinks coffee daily'
          ],
          intermediate: [
            'I usually drink coffee in the morning',
            'My brother plays guitar very well',
            'We often visit our grandparents on Sundays'
          ],
          advanced: [
            'She has been studying English for three years',
            'They were watching a movie when I called',
            'We will be traveling to Japan next summer'
          ]
        },
        complex: {
          basic: [
            'I like tea but she prefers coffee',
            'He studied hard and passed the exam',
            'She sings well but he dances better'
          ],
          intermediate: [
            'Although it was raining we decided to go hiking',
            'If you study regularly you will pass the exam',
            'When she arrived everyone was already waiting'
          ],
          advanced: [
            'The project that we submitted yesterday received excellent feedback from judges',
            'She has been working here since the company was founded in 2015',
            'The students who completed their assignments early were allowed to leave early'
          ]
        },
        questions: {
          basic: [
            'What is your favorite color',
            'Where do you live now',
            'Do you like reading books'
          ],
          intermediate: [
            'How long have you been studying English',
            'Why do you want to learn this language',
            'When did you start your new job'
          ],
          advanced: [
            'What would you have done if you had known earlier',
            'How could this situation have been avoided completely',
            'Why has this problem not been addressed properly yet'
          ]
        },
        challenge: {
          basic: [
            'The team completed the difficult project successfully last week',
            'Advanced technology is changing our daily lives rapidly'
          ],
          intermediate: [
            'If students practice regularly their language skills will improve significantly over time',
            'The research findings were presented at the international conference by leading scientists'
          ],
          advanced: [
            'Despite numerous challenges the dedicated research team successfully completed their groundbreaking study on time',
            'The sophisticated algorithm efficiently processes vast amounts of complex data within seconds using advanced methods'
          ],
          expert: [
            'The unprecedented technological advancements have fundamentally transformed modern communication methods and social interactions worldwide',
            'Environmental sustainability initiatives require collaborative efforts from governments businesses and communities to address climate challenges effectively',
            'Historical evidence suggests that ancient civilizations possessed remarkably advanced astronomical knowledge far beyond contemporary expectations'
          ]
        }
      };
      const pool = fallbacks[type]?.[difficultyLevel] || fallbacks.basic.basic;
      const selectedSentence = pool[Math.floor(Math.random() * pool.length)];
      result = {
        sentence: selectedSentence,
        scrambled: selectedSentence.split(' ').sort(() => Math.random() - 0.5)
      };
    }
    
    console.log(`✅ ${difficultyLevel} ${type} sentence generated (Round ${currentRound}):`, result.sentence);
    res.json(result);
  } catch (error) {
    console.error('Error generating word:', error.message);
    res.status(500).json({ 
      message: 'Error generating word', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};

// @desc    Word Builder - Evaluate sentence
// @route   POST /api/lessons/wordbuilder/evaluate
// @access  Private
export const evaluateWordBuilder = async (req, res) => {
  try {
    const { userSentence, correctSentence } = req.body;
    
    // Normalize sentences for comparison
    const normalizeText = (text) => {
      return text.toLowerCase().trim().replace(/[.,!?;:]/g, '');
    };
    
    const userNormalized = normalizeText(userSentence);
    const correctNormalized = normalizeText(correctSentence);
    
    console.log('Evaluating:');
    console.log('User:', userSentence, '→', userNormalized);
    console.log('Correct:', correctSentence, '→', correctNormalized);
    
    // Check exact match first
    if (userNormalized === correctNormalized) {
      console.log('✅ Exact match!');
      return res.json({
        correct: true,
        feedback: 'Perfect! That\'s the correct sentence.'
      });
    }
    
    // Check if words are in correct order
    const userWords = userNormalized.split(/\s+/);
    const correctWords = correctNormalized.split(/\s+/);
    
    if (userWords.length !== correctWords.length) {
      console.log('❌ Different word count');
      return res.json({
        correct: false,
        feedback: `Not quite. Try arranging the words differently.`
      });
    }
    
    // Check if all words match in order
    const allMatch = userWords.every((word, index) => word === correctWords[index]);
    
    if (allMatch) {
      console.log('✅ Words match in order!');
      return res.json({
        correct: true,
        feedback: 'Excellent! Perfect word order.'
      });
    }
    
    console.log('❌ Word order incorrect');
    res.json({
      correct: false,
      feedback: `Keep trying! The correct order is important.`
    });
    
  } catch (error) {
    console.error('Error evaluating sentence:', error.message);
    res.status(500).json({ 
      message: 'Error evaluating sentence', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
};
