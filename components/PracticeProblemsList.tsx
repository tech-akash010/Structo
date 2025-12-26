import React, { useMemo } from 'react';
import type { PracticeProblem } from '../types';
import { CheckCircleIcon } from './Icons';
import { motion } from 'framer-motion';

interface PracticeProblemsListProps {
  topicTitle: string;
  problems: PracticeProblem[];
  solvedProblems: Set<string>;
  onSelectProblem: (problem: PracticeProblem) => void;
}

const PracticeProblemsList: React.FC<PracticeProblemsListProps> = ({ topicTitle, problems, solvedProblems, onSelectProblem }) => {

  const sortedProblems = useMemo(() => {
    const difficultyOrder: { [key in PracticeProblem['difficulty']]: number } = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return [...problems].sort((a, b) => {
      return (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
    });
  }, [problems]);

  const solvedCount = useMemo(() => {
      return sortedProblems.filter(p => solvedProblems.has(p.id)).length;
  }, [sortedProblems, solvedProblems]);

  const progress = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  return (
    <div className="h-full flex flex-col animate-fade-in">
        <header className="flex-shrink-0 mb-6">
            <h2 className="text-3xl font-bold text-[#E0E0E0] mb-2">{topicTitle}</h2>
            <p className="text-[#A0A0B0]">Select a problem to start practicing.</p>
        </header>

        <div className="flex-shrink-0 mb-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-[#A0A0B0]">Topic Progress</h3>
                <span className="text-sm font-bold text-[#00FFE1]">{solvedCount} / {problems.length} Solved</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-[#00FFE1] to-[#00FFCD] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      
        <div className="flex-grow overflow-y-auto pr-4">
            <ul className="space-y-3">
                {sortedProblems.map((problem, index) => {
                    const isSolved = solvedProblems.has(problem.id);
                    const difficultyColor = 
                        problem.difficulty === 'Easy' ? 'text-green-400 bg-green-500/10' :
                        problem.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-500/10' :
                        'text-red-400 bg-red-500/10';
                        
                    return (
                        <motion.li
                            key={problem.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <div className="bg-[#202639] hover:bg-[#2a314e] transition-colors p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {isSolved ? (
                                        <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <div className="w-6 h-6 border-2 border-[#A0A0B0]/50 rounded-full flex-shrink-0" />
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-lg text-[#E0E0E0]">{problem.title}</h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${difficultyColor}`}>{problem.difficulty}</span>
                                    <button 
                                        onClick={() => onSelectProblem(problem)}
                                        className="px-6 py-2 bg-[#00FFE1]/20 backdrop-blur-md border border-[#00FFE1]/30 text-[#00FFE1] hover:bg-[#00FFE1]/30 transition-all duration-300 transform hover:-translate-y-px rounded-lg font-semibold text-sm"
                                    >
                                        Solve
                                    </button>
                                </div>
                            </div>
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    </div>
  );
};

export default PracticeProblemsList;