
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Topic, Language, ChatMessage, Quiz, CodingProblem, VisualizationData, PracticeProblem } from './types';
import { Language as LanguageEnum } from './types';
import { DSA_TOPICS, LANGUAGES } from './constants';
import { ALL_PRACTICE_PROBLEMS } from './data/practiceProblems';
import { startLesson, getQuizForTopic, getChatResponse, getTextToSpeech } from './services/geminiService';
import { LanguageIcon, SpeakerIcon, SendIcon, CheckCircleIcon, XCircleIcon, ThinkingIcon, SearchIcon, BookmarkIcon, BookmarkFilledIcon } from './components/Icons';
import LoadingSpinner from './components/LoadingSpinner';
import MarkdownRenderer from './components/MarkdownRenderer';
import ProblemSolver from './components/ProblemSolver';
import ArrayVisualizer from './components/ArrayVisualizer';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import PracticeProblemsList from './components/PracticeProblemsList';


// Helper functions for audio decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const Sidebar = React.memo<{
  onSelectTopic: (topic: Topic) => void;
  selectedTopic: Topic | null;
  progress: number;
  bookmarkedTopics: Set<string>;
  onToggleBookmark: (topicId: string) => void;
}>(({ onSelectTopic, selectedTopic, progress, bookmarkedTopics, onToggleBookmark }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTopics = useMemo(() => 
        DSA_TOPICS.filter(topic =>
            topic.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [searchQuery]
    );

    const categories = useMemo(() => 
        [...new Set(filteredTopics.map(t => t.category))],
        [filteredTopics]
    );
    
    const bookmarkedTopicObjects = useMemo(() => 
        DSA_TOPICS.filter(topic => bookmarkedTopics.has(topic.id)), 
        [bookmarkedTopics]
    );

    return (
        <aside className="w-80 bg-[#0F172A] text-[#E0E0E0] p-6 flex-shrink-0 flex flex-col h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#00FFE1] to-[#00FFCD]">Structo</h1>
            <p className="text-[#A0A0B0] text-sm mb-6">Your Personal DSA Tutor</p>
            
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#A0A0B0] mb-2">Overall Progress</h3>
                <div className="w-full bg-black/20 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-[#00FFE1] to-[#00FFCD] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="relative mb-6">
                <SearchIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#A0A0B0]" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/20 pl-10 pr-4 py-2 rounded-lg text-sm placeholder-[#A0A0B0]/70 focus:outline-none focus:ring-1 focus:ring-[#00FFE1]"
                />
            </div>

            <nav className="flex-grow">
                {bookmarkedTopicObjects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xs uppercase font-bold text-[#A0A0B0]/60 mb-3 flex items-center gap-2">
                            <BookmarkIcon className="w-4 h-4" />
                            Bookmarked
                        </h2>
                        <ul>
                            {bookmarkedTopicObjects.map(topic => (
                                <li key={`bookmark-${topic.id}`}>
                                    <button
                                        onClick={() => onSelectTopic(topic)}
                                        className={`w-full text-left px-4 py-2.5 my-1 text-sm rounded-lg transition-all duration-200 flex justify-between items-center group ${selectedTopic?.id === topic.id ? 'bg-[#00FFE1]/10 text-[#00FFE1] font-semibold' : 'text-[#A0A0B0] hover:bg-white/5'}`}
                                    >
                                        <span className="pr-2">{topic.title}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleBookmark(topic.id);
                                            }}
                                            className="p-1 -mr-1 text-[#00FFE1] opacity-70 group-hover:opacity-100"
                                            aria-label={`Remove bookmark for ${topic.title}`}
                                        >
                                            <BookmarkFilledIcon className="w-5 h-5" />
                                        </button>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {categories.length > 0 ? categories.map(category => (
                    <div key={category} className="mb-6">
                        <h2 className="text-xs uppercase font-bold text-[#A0A0B0]/60 mb-3">{category}</h2>
                        <ul>
                            {filteredTopics.filter(t => t.category === category).map(topic => (
                                <li key={topic.id}>
                                    <button
                                        onClick={() => onSelectTopic(topic)}
                                        className={`w-full text-left px-4 py-2.5 my-1 text-sm rounded-lg transition-all duration-200 flex justify-between items-center group ${selectedTopic?.id === topic.id ? 'bg-[#00FFE1]/10 text-[#00FFE1] font-semibold' : 'text-[#A0A0B0] hover:bg-white/5'}`}
                                    >
                                        <span className="pr-2">{topic.title}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleBookmark(topic.id);
                                            }}
                                            className={`p-1 -mr-1 text-[#A0A0B0] hover:text-[#00FFE1] transition-colors ${bookmarkedTopics.has(topic.id) ? 'opacity-100 text-[#00FFE1]' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'}`}
                                            aria-label={`Bookmark ${topic.title}`}
                                        >
                                            {bookmarkedTopics.has(topic.id) ? (
                                                <BookmarkFilledIcon className="w-5 h-5" />
                                            ) : (
                                                <BookmarkIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )) : (
                     <p className="text-[#A0A0B0] text-center text-sm">No topics found.</p>
                )}
            </nav>
        </aside>
    );
});

const Header = React.memo<{
  selectedTopic: Topic | null;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onSpeak: () => void;
  isSpeaking: boolean;
  isThinkingMode: boolean;
  onToggleThinkingMode: () => void;
}>(({ selectedTopic, selectedLanguage, onLanguageChange, onSpeak, isSpeaking, isThinkingMode, onToggleThinkingMode }) => {
    return (
        <header className="flex justify-between items-center p-6 bg-[#0F172A]/80 backdrop-blur-sm text-[#E0E0E0] flex-shrink-0 border-b border-white/10">
            <h2 className="text-2xl font-bold">{selectedTopic?.title || 'Welcome to Structo!'}</h2>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={onSpeak}
                    disabled={isSpeaking || !selectedTopic || selectedTopic.type === 'practice'}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    <SpeakerIcon className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-[#00FFE1]' : ''}`} />
                    <span>{isSpeaking ? 'Speaking...' : 'Voice Explanation'}</span>
                </button>
                 <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-lg px-3 py-1.5">
                    <ThinkingIcon className="w-6 h-6 text-[#00FFE1]" />
                    <label htmlFor="thinking-toggle" className="text-sm font-medium text-white select-none cursor-pointer">
                        Thinking Mode
                    </label>
                    <button
                        id="thinking-toggle"
                        role="switch"
                        aria-checked={isThinkingMode}
                        onClick={onToggleThinkingMode}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F172A] focus:ring-[#00FFE1] ${isThinkingMode ? 'bg-[#00FFE1]' : 'bg-black/30'}`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${isThinkingMode ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>
                <div className="relative">
                    <LanguageIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#A0A0B0]" />
                    <select
                        value={selectedLanguage}
                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                        className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFE1] shadow-lg"
                    >
                        {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-[#0F172A]">{lang}</option>)}
                    </select>
                </div>
            </div>
        </header>
    );
});

const QuizView: React.FC<{ quiz: Quiz; onFinish: () => void }> = ({ quiz, onFinish }) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const mcqs = useMemo(() => quiz?.mcqs?.filter(q => q && q.question && Array.isArray(q.options)) || [], [quiz]);
    const conceptualQuestions = quiz?.conceptualQuestions || [];
    const problemSolvingTasks = quiz?.problemSolvingTasks || [];

    const handleSelect = useCallback((qIndex: number, oIndex: number) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
    }, [showResults]);

    const handleSubmit = useCallback(() => {
        // Fix: Changed reduce initial value from [answers, mcqs] to 0 to prevent type error when incrementing.
        const calculatedScore = Object.keys(answers).reduce((acc: number, qIndex: string) => {
            const question = mcqs[parseInt(qIndex)];
            if (question && Array.isArray(question.options) && question.options[answers[parseInt(qIndex)]]?.isCorrect) {
                return acc + 1;
            }
            return acc;
        }, 0);
        setScore(calculatedScore);
        setShowResults(true);
    }, [answers, mcqs]);
    
    const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});

    const toggleSolution = useCallback((type: 'conceptual' | 'problem', index: number) => {
        const key = `${type}-${index}`;
        setShowSolutions(prev => ({...prev, [key]: !prev[key]}));
    }, []);

    if (showResults) {
        return (
            <div className="p-8 bg-black/20 rounded-lg mt-8 animate-fade-in">
                <h2 className="text-3xl font-bold mb-4 text-[#E0E0E0]">Quiz Results</h2>
                {mcqs.length > 0 && <p className="text-xl text-[#A0A0B0] mb-6">You scored <span className="font-bold text-[#00FFE1]">{score}</span> out of <span className="font-bold text-[#00FFE1]">{mcqs.length}</span> on the MCQs.</p>}
                
                 {/* MCQs Review */}
                 {mcqs.length > 0 && <div className="mb-8">
                     <h3 className="text-2xl font-semibold mb-4 text-[#E0E0E0] border-b border-white/20 pb-2">MCQs Review</h3>
                     {mcqs.map((mcq, qIndex) => (
                         <div key={qIndex} className="p-4 my-2 bg-[#0F172A]/30 rounded-lg">
                             <p className="font-semibold text-[#E0E0E0]">{qIndex + 1}. {mcq.question}</p>
                             <div className="mt-2 space-y-2">
                                 {mcq.options.map((option, oIndex) => {
                                     const isSelected = answers[qIndex] === oIndex;
                                     const isCorrect = option.isCorrect;
                                     let ringColor = 'border-white/20';
                                     if (isSelected && isCorrect) ringColor = 'border-green-500';
                                     if (isSelected && !isCorrect) ringColor = 'border-red-500';
                                     if (!isSelected && isCorrect) ringColor = 'border-green-500/50';

                                     return (
                                         <div key={oIndex} className={`flex items-center p-2 rounded border-2 bg-black/20 ${ringColor}`}>
                                             {isCorrect ? <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" /> : (isSelected ? <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" /> : <div className="w-5 mr-2 flex-shrink-0"></div>)}
                                             <span className={`${isCorrect ? 'text-green-300' : isSelected ? 'text-red-300' : 'text-[#A0A0B0]'}`}>{option.text}</span>
                                         </div>
                                     );
                                 })}
                             </div>
                             {mcq.explanation && <p className="mt-3 text-sm text-[#A0A0B0] italic bg-black/20 p-2 rounded">Explanation: {mcq.explanation}</p>}
                         </div>
                     ))}
                 </div>}

                {/* Conceptual Questions Review */}
                {conceptualQuestions.length > 0 && <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-4 text-[#E0E0E0] border-b border-white/20 pb-2">Conceptual Questions</h3>
                    {conceptualQuestions.map((cq, index) => (
                        <div key={index} className="p-4 my-2 bg-[#0F172A]/30 rounded-lg">
                            <p className="font-semibold text-[#E0E0E0]">{cq.question}</p>
                            <button onClick={() => toggleSolution('conceptual', index)} className="text-sm text-[#00FFE1] hover:underline mt-2">
                                {showSolutions[`conceptual-${index}`] ? 'Hide Answer' : 'Show Answer'}
                            </button>
                            {showSolutions[`conceptual-${index}`] && <p className="mt-2 text-[#A0A0B0] text-sm animate-fade-in">{cq.answer}</p>}
                        </div>
                    ))}
                </div>}

                {/* Problem Solving Tasks Review */}
                {problemSolvingTasks.length > 0 && <div>
                    <h3 className="text-2xl font-semibold mb-4 text-[#E0E0E0] border-b border-white/20 pb-2">Problem Solving</h3>
                     {problemSolvingTasks.map((pt, index) => (
                         <div key={index} className="p-4 my-2 bg-[#0F172A]/30 rounded-lg">
                             <p className="font-semibold text-[#E0E0E0]">Problem: {pt.problem}</p>
                             <button onClick={() => toggleSolution('problem', index)} className="text-sm text-[#00FFE1] hover:underline mt-2">
                                {showSolutions[`problem-${index}`] ? 'Hide Solution' : 'Show Solution'}
                            </button>
                            {showSolutions[`problem-${index}`] && <div className="mt-2 text-[#A0A0B0] text-sm animate-fade-in"><MarkdownRenderer content={pt.solution} /></div>}
                         </div>
                     ))}
                </div>}

                <button onClick={onFinish} className="mt-8 px-6 py-2 bg-[#00FFE1]/20 backdrop-blur-md border border-[#00FFE1]/30 shadow-lg text-[#00FFE1] hover:bg-[#00FFE1]/30 transition-all duration-300 transform hover:-translate-y-px rounded-lg font-semibold">Back to Lesson</button>
            </div>
        );
    }
    
    // If there are no MCQs, the user can't take the quiz.
    if (mcqs.length === 0) {
        return (
            <div className="p-8 bg-black/20 rounded-lg mt-8 animate-fade-in text-center">
                <h2 className="text-2xl font-bold mb-4 text-[#E0E0E0]">Quiz Incomplete</h2>
                <p className="text-[#A0A0B0]">Sorry, we couldn't generate any multiple-choice questions for this topic.</p>
                {(conceptualQuestions.length > 0 || problemSolvingTasks.length > 0) &&
                    <button onClick={() => setShowResults(true)} className="mt-6 px-6 py-2 bg-[#00FFE1]/20 backdrop-blur-md border border-[#00FFE1]/30 shadow-lg text-[#00FFE1] hover:bg-[#00FFE1]/30 transition-all duration-300 transform hover:-translate-y-px rounded-lg font-semibold mr-4">View Other Questions</button>
                }
                <button onClick={onFinish} className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-px rounded-lg font-semibold">Back to Lesson</button>
            </div>
        )
    }

    return (
        <div className="p-8 bg-black/20 rounded-lg mt-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-[#E0E0E0]">Topic Quiz</h2>
            {/* MCQs */}
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#E0E0E0]">Multiple Choice</h3>
                {mcqs.map((mcq, qIndex) => (
                    <div key={qIndex} className="mb-6">
                        <p className="font-semibold text-[#A0A0B0]">{qIndex + 1}. {mcq.question}</p>
                        <div className="mt-2 space-y-2">
                            {mcq.options.map((option, oIndex) => (
                                <button
                                    key={oIndex}
                                    onClick={() => handleSelect(qIndex, oIndex)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${answers[qIndex] === oIndex ? 'bg-[#00FFE1]/30 border-[#00FFE1] text-[#E0E0E0]' : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#00FFE1]/50 text-[#A0A0B0]'}`}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="mt-6 px-8 py-3 bg-[#00FFE1]/20 backdrop-blur-md border border-[#00FFE1]/30 shadow-lg text-[#00FFE1] hover:bg-[#00FFE1]/30 transition-all duration-300 transform hover:-translate-y-px rounded-lg font-semibold"
            >
                Submit & View Results
            </button>
        </div>
    );
};

const parseVisualizationCommand = (text: string): { cleanText: string; visualization: VisualizationData | null } => {
    const vizRegex = /\[VIZ:([A-Z_]+):([A-Z_]+):([^\]:]+):?([^\]]*)\]/m;
    const match = text.match(vizRegex);

    if (!match) {
        return { cleanText: text, visualization: null };
    }

    const cleanText = text.replace(vizRegex, '').trim();
    const [, type, operation, dataStr, highlightStr] = match;
    const data = dataStr.split(',').map(item => isNaN(Number(item)) ? item.trim() : Number(item.trim()));
    const highlightValue = isNaN(Number(highlightStr)) ? highlightStr.trim() : Number(highlightStr.trim());

    if (type === 'ARRAY') {
        return {
            cleanText,
            visualization: {
                type: 'ARRAY',
                operation: operation as any,
                data: data,
                highlightIndex: operation === 'ACCESS' || operation === 'DELETE' ? highlightValue as number : undefined,
                value: operation === 'ADD' ? highlightValue : undefined,
            }
        };
    }

    if (type === 'LINKED_LIST') {
         return {
            cleanText,
            visualization: {
                type: 'LINKED_LIST',
                operation: operation as any,
                data: data,
                highlightIndex: operation === 'TRAVERSE' || operation === 'DELETE' ? highlightValue as number : undefined,
                value: operation === 'ADD_TAIL' || operation === 'ADD_HEAD' ? highlightValue : undefined,
            }
        };
    }

    return { cleanText, visualization: null };
};


export default function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Initialize language from localStorage, defaulting to Python
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('structo-language');
    if (saved && Object.values(LanguageEnum).includes(saved as LanguageEnum)) {
      return saved as LanguageEnum;
    }
    return LanguageEnum.Python;
  });

  // Persist language selection to localStorage
  useEffect(() => {
    localStorage.setItem('structo-language', selectedLanguage);
  }, [selectedLanguage]);
  
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const [quizzes, setQuizzes] = useState<Record<string, Quiz | null>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [isFetchingQuiz, setIsFetchingQuiz] = useState(false);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  const [currentView, setCurrentView] = useState<'welcome' | 'lesson' | 'practice'>('welcome');
  const [selectedPracticeProblem, setSelectedPracticeProblem] = useState<PracticeProblem | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  
  // Solved problems state, initialized from localStorage
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(() => {
      const saved = localStorage.getItem('solvedProblems');
      return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Bookmarked topics state
  const [bookmarkedTopics, setBookmarkedTopics] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bookmarkedTopics');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Effect to save solved problems to localStorage whenever it changes
  useEffect(() => {
      localStorage.setItem('solvedProblems', JSON.stringify(Array.from(solvedProblems)));
  }, [solvedProblems]);
  
  // Effect to save bookmarked topics to localStorage
  useEffect(() => {
    localStorage.setItem('bookmarkedTopics', JSON.stringify(Array.from(bookmarkedTopics)));
  }, [bookmarkedTopics]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, isAiTyping]);


  const handleSelectTopic = useCallback(async (topic: Topic) => {
    setSelectedTopic(topic);
    setShowQuiz(false);
    setError(null);
    setSelectedPracticeProblem(null);
    
    if (topic.type === 'practice') {
        setCurrentView('practice');
    } else if (topic.type === 'lesson') {
        setCurrentView('lesson');
        // Start a new conversational lesson only if one doesn't already exist
        if (!chatHistories[topic.id]) {
            setIsLoading(true);
            const initialMessageText = await startLesson(topic, selectedLanguage);
            const { cleanText, visualization } = parseVisualizationCommand(initialMessageText);
            setChatHistories(prev => ({
                ...prev,
                [topic.id]: [{ sender: 'ai', text: cleanText, visualization }]
            }));
            setIsLoading(false);
        }
    }
    const topicIndex = DSA_TOPICS.findIndex(t => t.id === topic.id);
    setProgress(Math.round(((topicIndex + 1) / DSA_TOPICS.length) * 100));
  }, [chatHistories, selectedLanguage]);

  const handleToggleBookmark = useCallback((topicId: string) => {
    setBookmarkedTopics(prev => {
        const newSet = new Set(prev);
        if (newSet.has(topicId)) {
            newSet.delete(topicId);
        } else {
            newSet.add(topicId);
        }
        return newSet;
    });
  }, []);
  
  const handleSendMessage = useCallback(async (message: string) => {
    if (!selectedTopic || !message.trim()) return;

    const topicId = selectedTopic.id;
    const currentHistory = chatHistories[topicId] || [];
    const newMessages: ChatMessage[] = [...currentHistory, { sender: 'user', text: message }];
    
    setChatHistories(prev => ({...prev, [topicId]: newMessages }));
    setIsAiTyping(true);

    const apiMessages = newMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const responseText = await getChatResponse(apiMessages, selectedTopic, selectedLanguage, isThinkingMode);
    const { cleanText, visualization } = parseVisualizationCommand(responseText);
    
    setChatHistories(prev => ({...prev, [topicId]: [...newMessages, { sender: 'ai', text: cleanText, visualization }]}));
    setIsAiTyping(false);
  }, [selectedTopic, chatHistories, selectedLanguage, isThinkingMode]);
  
  const handleSend = useCallback(() => {
    handleSendMessage(chatInput);
    setChatInput('');
  }, [chatInput, handleSendMessage]);

  const handleTakeQuiz = useCallback(async () => {
    if (!selectedTopic) return;
    
    const topicId = selectedTopic.id;

    // Always fetch a new quiz to ensure questions are fresh.
    setIsFetchingQuiz(true);
    setShowQuiz(true);
    setQuizzes(prev => ({ ...prev, [topicId]: null })); // Clear old quiz to show loading state
    
    const generatedQuiz = await getQuizForTopic(selectedTopic, isThinkingMode);
    setQuizzes(prev => ({
        ...prev,
        [topicId]: generatedQuiz
    }));
    
    setIsFetchingQuiz(false);
  }, [selectedTopic, isThinkingMode]);
  
  const handleSpeak = useCallback(async () => {
    if (isSpeaking || !selectedTopic) return;

    const history = chatHistories[selectedTopic.id] || [];
    const lastAiMessage = [...history].reverse().find(m => m.sender === 'ai');

    if (!lastAiMessage) return;
    
    setIsSpeaking(true);
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    
    const textToSpeak = lastAiMessage.text.replace(/```[\s\S]*?```/g, 'Here is a code example.');

    const base64Audio = await getTextToSpeech(textToSpeak.substring(0, 1000));

    if (base64Audio && audioContext) {
        try {
            const decodedData = decode(base64Audio);
            const audioBuffer = await decodeAudioData(decodedData, audioContext, 24000, 1);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            source.onended = () => setIsSpeaking(false);
        } catch (e) {
            console.error("Audio playback error:", e);
            setIsSpeaking(false);
        }
    } else {
        setIsSpeaking(false);
    }
  }, [isSpeaking, selectedTopic, chatHistories]);
  
  const handleProblemSolved = useCallback((problemId: string) => {
    setSolvedProblems(prev => new Set(prev).add(problemId));
  }, []);
  
  const handleLanguageChange = useCallback((language: Language) => {
      setSelectedLanguage(language);
  }, []);

  const handleToggleThinkingMode = useCallback(() => {
      setIsThinkingMode(prev => !prev);
  }, []);

  const renderLessonContent = () => {
    if (!selectedTopic) return null;
    const history = chatHistories[selectedTopic.id] || [];
    const currentQuiz = quizzes[selectedTopic.id];

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto pr-4 space-y-4 pb-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`flex flex-col max-w-3xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-5 py-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-[#00FFE1] text-[#0F172A] rounded-br-none' : 'bg-[#202639] text-[#E0E0E0] rounded-bl-none'}`}>
                                <MarkdownRenderer content={msg.text} />
                            </div>
                            {msg.visualization && (
                                <div className="mt-4 w-full">
                                    {msg.visualization.type === 'ARRAY' && <ArrayVisualizer visData={msg.visualization} />}
                                    {msg.visualization.type === 'LINKED_LIST' && <LinkedListVisualizer visData={msg.visualization} />}
                                </div>
                            )}
                         </div>
                    </div>
                ))}
                {isAiTyping && (
                     <div className="flex justify-start">
                         <div className="max-w-xs px-4 py-3 rounded-2xl bg-[#202639] text-[#E0E0E0] rounded-bl-none flex items-center space-x-1">
                            <span className="w-2 h-2 bg-[#A0A0B0] rounded-full animate-pulse delay-0"></span>
                            <span className="w-2 h-2 bg-[#A0A0B0] rounded-full animate-pulse delay-200"></span>
                            <span className="w-2 h-2 bg-[#A0A0B0] rounded-full animate-pulse delay-400"></span>
                         </div>
                      </div>
                )}
                <div ref={messagesEndRef} />
                {showQuiz && (
                    isFetchingQuiz ? <div className="mt-8"><LoadingSpinner /></div> : (
                        currentQuiz ? <QuizView quiz={currentQuiz} onFinish={() => setShowQuiz(false)} /> : <div className="p-8 bg-black/20 rounded-lg mt-8 animate-fade-in text-center"><p className="text-red-400">Could not generate a valid quiz for this topic. Please try again.</p></div>
                    )
                )}
            </div>

            <div className="mt-auto pt-4 flex-shrink-0">
                {!showQuiz && history.length > 1 && (
                    <div className="text-center mb-4">
                        <button
                            onClick={handleTakeQuiz}
                            disabled={isFetchingQuiz}
                            className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-full text-white font-bold hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isFetchingQuiz ? 'Generating Quiz...' : 'Take a Quiz on this Topic'}
                        </button>
                    </div>
                )}
                <div className="flex items-center bg-[#0F172A] rounded-full px-2 border border-white/10 shadow-inner">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={selectedTopic ? `Ask about ${selectedTopic.title}...` : 'Select a topic to start'}
                      className="flex-grow bg-transparent p-3 text-[#E0E0E0] placeholder-[#A0A0B0]/70 focus:outline-none"
                      disabled={!selectedTopic}
                    />
                    <button onClick={handleSend} className="p-2 text-[#00FFE1] hover:text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={isAiTyping || !chatInput.trim()}>
                      <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  const renderContent = () => {
    if (selectedPracticeProblem) {
        return (
            <ProblemSolver 
                problem={selectedPracticeProblem}
                onBack={() => setSelectedPracticeProblem(null)}
                onSolved={handleProblemSolved}
                preferredLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                isThinkingMode={isThinkingMode}
            />
        );
    }

    switch (currentView) {
        case 'welcome':
            return (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <h1 className="text-5xl font-bold mb-4">Welcome to Structo!</h1>
                    <p className="text-xl text-[#A0A0B0]">Select a topic from the sidebar to begin your journey into Data Structures and Algorithms.</p>
                </div>
            );
        case 'lesson':
            if (isLoading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;
            if (error) return <div className="text-red-400 text-center p-8">{error}</div>;
            return renderLessonContent();
        case 'practice':
            if (!selectedTopic || !selectedTopic.problemSubCategory) return null;
            const problems = ALL_PRACTICE_PROBLEMS.filter(p => p.subCategory === selectedTopic.problemSubCategory);
            return (
                <PracticeProblemsList 
                    topicTitle={selectedTopic.title}
                    problems={problems}
                    solvedProblems={solvedProblems}
                    onSelectProblem={setSelectedPracticeProblem}
                />
            );
        default:
            return null;
    }
  }

  return (
    <div className="h-screen w-screen bg-[#020617] flex text-[#E0E0E0] overflow-hidden" style={{backgroundImage: `radial-gradient(circle at top left, rgba(0, 255, 225, 0.1), transparent 30%), radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.1), transparent 30%)`}}>
        <Sidebar 
            onSelectTopic={handleSelectTopic} 
            selectedTopic={selectedTopic} 
            progress={progress}
            bookmarkedTopics={bookmarkedTopics}
            onToggleBookmark={handleToggleBookmark}
        />
        <main className="flex-1 flex flex-col h-full">
            <Header
              selectedTopic={selectedTopic}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              isThinkingMode={isThinkingMode}
              onToggleThinkingMode={handleToggleThinkingMode}
            />
            <div className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </main>
    </div>
  );
}
