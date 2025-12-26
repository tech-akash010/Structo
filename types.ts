export enum Language {
  Python = 'Python',
  Java = 'Java',
  CPP = 'C++',
  C = 'C',
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  type: 'lesson' | 'practice';
  problemSubCategory?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  subCategory: string;
  description: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  visualization?: VisualizationData;
}

export interface MCQOption {
  text: string;
  isCorrect: boolean;
}

export interface MCQQuestion {
  question: string;
  options: MCQOption[];
  explanation: string;
}

export interface ConceptualQuestion {
  question: string;
  answer: string;
}

export interface ProblemSolvingTask {
  problem: string;
  solution: string;
}

export interface Quiz {
  mcqs: MCQQuestion[];
  conceptualQuestions: ConceptualQuestion[];
  problemSolvingTasks: ProblemSolvingTask[];
}

// New types for the Coding Environment
export interface TestCase {
  input: string;
  output: string;
  isPublic: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  description: string;
  starterCode: {
    [Language.Python]: string;
    [Language.Java]: string;
    [Language.CPP]: string;
    [Language.C]: string;
  };
  testCases: TestCase[];
}

export interface CodeExecutionResult {
  results: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }[];
  consoleOutput: string;
  feedback: string;
}

// New type for Code Snippets
export interface Snippet {
    id: string;
    name: string;
    code: string;
    language: Language;
}

// New types for Visualizations
export type VisualizationType = 'ARRAY' | 'LINKED_LIST';

export interface ArrayVisData {
    type: 'ARRAY';
    operation: 'ADD' | 'ACCESS' | 'INSERT' | 'DELETE';
    data: (string | number)[];
    highlightIndex?: number;
    value?: string | number;
}

export interface LinkedListVisData {
    type: 'LINKED_LIST';
    operation: 'ADD_TAIL' | 'ADD_HEAD' | 'DELETE' | 'TRAVERSE';
    data: (string | number)[];
    highlightIndex?: number;
    value?: string | number;
}

export type VisualizationData = ArrayVisData | LinkedListVisData;