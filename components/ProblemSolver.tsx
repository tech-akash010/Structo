import React, { useState, useEffect, useRef } from 'react';
import type { PracticeProblem, CodingProblem, Language, CodeExecutionResult, Snippet } from '../types';
import { Language as LanguageEnum } from '../types';
import { LANGUAGES } from '../constants';
import { prepareCodingChallengeFromProblem, runCode, getHint, explainCode } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import LoadingSpinner from './LoadingSpinner';
import { PlayIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, BookmarkIcon, CloseIcon, BookOpenIcon, ArrowLeftIcon } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to manage snippets in localStorage
const snippetStorage = {
    getSnippets: (): Snippet[] => {
        const snippets = localStorage.getItem('structo-snippets');
        return snippets ? JSON.parse(snippets) : [];
    },
    saveSnippets: (snippets: Snippet[]) => {
        localStorage.setItem('structo-snippets', JSON.stringify(snippets));
    }
};

const SnippetModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    language: Language;
    onInsert: (code: string) => void;
}> = ({ isOpen, onClose, language, onInsert }) => {
    const [allSnippets, setAllSnippets] = useState<Snippet[]>(snippetStorage.getSnippets());
    const languageSnippets = allSnippets.filter(s => s.language === language);

    const handleDelete = (id: string) => {
        const updatedSnippets = allSnippets.filter(s => s.id !== id);
        snippetStorage.saveSnippets(updatedSnippets);
        setAllSnippets(updatedSnippets);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-[#202639] w-1/2 max-w-2xl rounded-lg shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#E0E0E0]">Your Snippets for {language}</h3>
                    <button onClick={onClose} className="text-[#A0A0B0] hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                {languageSnippets.length > 0 ? (
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {languageSnippets.map(snippet => (
                            <li key={snippet.id} className="bg-[#0F172A]/50 p-3 rounded-lg flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-[#E0E0E0]">{snippet.name}</p>
                                    <pre className="text-xs text-[#A0A0B0] mt-1 bg-black/20 p-2 rounded overflow-x-auto"><code>{snippet.code}</code></pre>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 ml-4">
                                    <button onClick={() => { onInsert(snippet.code); onClose(); }} className="text-sm text-[#00FFE1] hover:underline">Insert</button>
                                    <button onClick={() => handleDelete(snippet.id)} className="text-sm text-red-400 hover:underline">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-[#A0A0B0]">You have no saved snippets for this language.</p>
                )}
            </div>
        </div>
    );
};

interface ProblemSolverProps {
  problem: PracticeProblem;
  onBack: () => void;
  onSolved: (problemId: string) => void;
  preferredLanguage: Language;
  onLanguageChange: (language: Language) => void;
  isThinkingMode: boolean;
}

const ProblemSolver: React.FC<ProblemSolverProps> = ({ problem, onBack, onSolved, preferredLanguage, onLanguageChange, isThinkingMode }) => {
    const [codingProblem, setCodingProblem] = useState<CodingProblem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const selectedLanguage = preferredLanguage;
    const [code, setCode] = useState('');
    const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'tests' | 'console'>('tests');
    const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState<'hint' | 'explain' | null>(null);
    const [actionResponse, setActionResponse] = useState<string | null>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        const fetchChallenge = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const challenge = await prepareCodingChallengeFromProblem(problem, isThinkingMode);
                if (challenge) {
                    setCodingProblem(challenge);
                    setCode(challenge.starterCode[selectedLanguage] || '');
                } else {
                    setError("Failed to load the coding challenge. The AI couldn't generate the necessary data. Please try again.");
                }
            } catch (e) {
                setError("An unexpected error occurred while loading the challenge.");
                console.error(e);
            }
            setIsLoading(false);
        };
        fetchChallenge();
    }, [problem, isThinkingMode]);

    useEffect(() => {
        if (codingProblem) {
            setCode(codingProblem.starterCode[selectedLanguage] || '');
        }
    }, [selectedLanguage, codingProblem]);

    const handleRunCode = async () => {
        if (!codingProblem) return;
        setIsRunning(true);
        setExecutionResult(null);
        setActionResponse(null);
        try {
            const result = await runCode(code, selectedLanguage, codingProblem, isThinkingMode);
            setExecutionResult(result);
            if (result && result.results.every(r => r.passed)) {
                onSolved(problem.id);
            }
        } catch (e) {
            console.error(e);
            // In a real app, you might set an error state here.
        }
        setIsRunning(false);
    };

    const handleGetHint = async () => {
        if (!codingProblem) return;
        setIsActionLoading('hint');
        setActionResponse(null);
        const hint = await getHint(codingProblem, code, selectedLanguage, isThinkingMode);
        setActionResponse(hint);
        setIsActionLoading(null);
    };
    
    const handleExplainCode = async () => {
        if (!codingProblem || !code.trim()) return;
        setIsActionLoading('explain');
        setActionResponse(null);
        const explanation = await explainCode(codingProblem, code, selectedLanguage, isThinkingMode);
        setActionResponse(explanation);
        setIsActionLoading(null);
    };

    const handleSaveSnippet = () => {
        const snippetName = prompt("Enter a name for your snippet:");
        if (snippetName && code.trim()) {
            const newSnippet: Snippet = {
                id: `snip-${Date.now()}`,
                name: snippetName,
                code: code,
                language: selectedLanguage,
            };
            const snippets = snippetStorage.getSnippets();
            snippetStorage.saveSnippets([...snippets, newSnippet]);
            alert("Snippet saved!");
        }
    };

    const insertSnippet = (snippetCode: string) => {
        setCode(prev => prev + '\n' + snippetCode);
        editorRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd, value } = e.currentTarget;
            const newCode = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
            setCode(newCode);
    
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.selectionStart = editorRef.current.selectionEnd = selectionStart + 2;
                }
            }, 0);
        }
    };

    if (isLoading) {
        return <div className="h-full flex flex-col items-center justify-center"><LoadingSpinner /><p className="mt-4 text-[#A0A0B0]">Preparing coding environment...</p></div>;
    }

    if (error) {
        return <div className="h-full flex flex-col items-center justify-center text-center p-8"><p className="text-red-400">{error}</p><button onClick={onBack} className="mt-4 px-4 py-2 bg-white/10 rounded-lg">Go Back</button></div>;
    }

    if (!codingProblem) {
        return <div className="h-full flex items-center justify-center"><p>Could not load problem.</p></div>;
    }
    
    const publicTestCases = codingProblem.testCases.filter(tc => tc.isPublic);
    const passedAll = executionResult && executionResult.results.every(r => r.passed);


    return (
        <div className="flex h-full w-full gap-6 animate-fade-in">
            {/* Left Panel: Problem Description */}
            <div className="w-1/3 flex-shrink-0 bg-[#0F172A]/50 rounded-lg p-6 flex flex-col">
                <div className="flex items-center mb-4">
                    <button onClick={onBack} className="mr-4 text-[#A0A0B0] hover:text-white transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-[#E0E0E0]">{codingProblem.title}</h2>
                </div>
                 <div className="flex-grow overflow-y-auto pr-2">
                    <MarkdownRenderer content={codingProblem.description} />
                 </div>
            </div>

            {/* Right Panel: Code Editor and Output */}
            <div className="w-2/3 flex flex-col gap-4">
                {/* Editor Section */}
                <div className="flex-grow flex flex-col bg-[#0F172A]/50 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-3 bg-black/20 flex-shrink-0">
                        <div className="relative">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => onLanguageChange(e.target.value as Language)}
                                className="pl-4 pr-8 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFE1] text-sm"
                            >
                                {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-[#0F172A]">{lang}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button onClick={() => setIsSnippetModalOpen(true)} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors">
                                <BookmarkIcon className="w-4 h-4" />
                                <span>Snippets</span>
                             </button>
                             <button onClick={handleSaveSnippet} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors">
                                <span>Save as Snippet</span>
                             </button>
                        </div>
                    </div>
                    <div className="flex-grow relative">
                        <textarea
                            ref={editorRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck="false"
                            className="w-full h-full bg-[#020617] text-[#E0E0E0] p-4 font-mono text-sm resize-none focus:outline-none absolute inset-0"
                            placeholder="Write your code here..."
                        />
                    </div>
                </div>

                {/* Actions & Output Section */}
                <div className="flex-shrink-0 h-2/5 flex flex-col bg-[#0F172A]/50 rounded-lg p-4">
                     <div className="flex justify-between items-center mb-3 flex-shrink-0">
                         <div>
                             {/* Tabs for output */}
                             <button onClick={() => { setActiveTab('tests'); setActionResponse(null); }} className={`px-4 py-1.5 text-sm rounded-t-md ${activeTab === 'tests' ? 'bg-[#202639] text-[#E0E0E0]' : 'text-[#A0A0B0]'}`}>Test Cases</button>
                             <button onClick={() => { setActiveTab('console'); setActionResponse(null); }} className={`px-4 py-1.5 text-sm rounded-t-md ${activeTab === 'console' ? 'bg-[#202639] text-[#E0E0E0]' : 'text-[#A0A0B0]'}`}>Console</button>
                         </div>
                         <div className="flex items-center space-x-2">
                             <button onClick={handleGetHint} disabled={isRunning || isActionLoading === 'hint'} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm disabled:opacity-50">
                                <LightbulbIcon className="w-5 h-5" />
                                <span>{isActionLoading === 'hint' ? 'Getting...' : 'Hint'}</span>
                             </button>
                              <button onClick={handleExplainCode} disabled={isRunning || isActionLoading === 'explain' || !code.trim()} className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm disabled:opacity-50">
                                <BookOpenIcon className="w-5 h-5" />
                                <span>{isActionLoading === 'explain' ? 'Explaining...' : 'Explain Code'}</span>
                             </button>
                             <button onClick={handleRunCode} disabled={isRunning || isActionLoading !== null} className="flex items-center gap-2 px-4 py-2 bg-[#00FFE1]/20 text-[#00FFE1] rounded-lg hover:bg-[#00FFE1]/30 transition-colors font-bold text-sm disabled:opacity-50">
                                <PlayIcon className="w-5 h-5" />
                                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                             </button>
                         </div>
                     </div>
                     <div className="flex-grow bg-[#020617] rounded-b-lg p-4 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={actionResponse ? 'action' : activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                            {isRunning ? <LoadingSpinner /> : (
                                actionResponse ? <MarkdownRenderer content={actionResponse} /> : (
                                executionResult ? (
                                    activeTab === 'tests' ? (
                                        <div>
                                            {passedAll && (
                                                <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-4 flex items-center gap-2 font-bold">
                                                    <CheckCircleIcon className="w-6 h-6" />
                                                    <span>Congratulations! All test cases passed.</span>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                {executionResult.results.map((res, index) => {
                                                    const isPublic = publicTestCases.some(tc => tc.input === res.input && tc.output === res.expectedOutput);
                                                    return (
                                                    <div key={index} className={`p-3 rounded-lg ${res.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                        <div className="flex items-center gap-2">
                                                            {res.passed ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <XCircleIcon className="w-5 h-5 text-red-400" />}
                                                            <span className={`font-bold text-sm ${res.passed ? 'text-green-300' : 'text-red-300'}`}>Test Case #{index + 1}</span>
                                                        </div>
                                                        <p className="text-xs text-[#A0A0B0] mt-1">{isPublic ? 'Public' : 'Hidden'}</p>
                                                    </div>
                                                );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <pre className="text-sm text-[#A0A0B0] whitespace-pre-wrap font-mono"><code>{executionResult.consoleOutput || 'No console output.'}</code></pre>
                                    )
                                ) : (
                                    <p className="text-[#A0A0B0]">Click 'Run Code' to see the results.</p>
                                )
                            ))}
                           </motion.div>
                        </AnimatePresence>
                     </div>
                </div>
            </div>
            <SnippetModal isOpen={isSnippetModalOpen} onClose={() => setIsSnippetModalOpen(false)} language={selectedLanguage} onInsert={insertSnippet} />
        </div>
    );
};

export default ProblemSolver;