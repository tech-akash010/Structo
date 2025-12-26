
// Always use import {GoogleGenAI} from "@google/genai";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION, LANGUAGES } from '../constants';
import type { Language, Quiz, Topic, CodingProblem, CodeExecutionResult, PracticeProblem, MCQQuestion } from '../types';

// Use this process.env.API_KEY string directly when initializing the @google/genai client instance.
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Extracts a JSON object from a string, which might be wrapped in markdown fences.
 * @param text The raw string response from the AI.
 * @returns A clean JSON string.
 */
const extractJson = (text: string): string => {
    const trimmedText = text.trim();
    // First, try to find JSON within ```json ... ```
    const match = trimmedText.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        return match[1];
    }
    
    // If not found, find the first '{' and the last '}'
    const firstBrace = trimmedText.indexOf('{');
    const lastBrace = trimmedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        return trimmedText.substring(firstBrace, lastBrace + 1);
    }

    // Return the original text if no JSON object is found
    return text;
};


export const startLesson = async (topic: Topic, language: Language): Promise<string> => {
    const ai = getAI();
    const prompt = `Start a lesson on the DSA topic: "${topic.title}" in ${language}.
    Your first message should be a friendly welcome to the topic. Then, ask the user how they'd like to begin by offering these three choices:
    1. Start with the fundamentals.
    2. See a code example right away.
    3. Focus on a specific aspect.
    
    Keep this initial message concise and engaging. Do not start teaching yet, just provide the welcome and the options.`;

    try {
        // Basic text tasks: use gemini-3-flash-preview
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error starting lesson:", error);
        return "Hello! I'm having a little trouble starting our lesson. Please try selecting the topic again in a moment.";
    }
};

export const getQuizForTopic = async (topic: Topic, isThinkingMode?: boolean): Promise<Quiz | null> => {
    const ai = getAI();
    const prompt = `Generate a quiz for the DSA topic: "${topic.title}". The quiz should contain exactly:
- 3 Multiple Choice Questions (MCQs) with 4 options each, one of which is correct.
- 2 Conceptual Questions.
- 1 short Problem-Solving Task.

Provide the response as a single, valid JSON object. IMPORTANT: Ensure that all string values within the JSON are properly escaped.`;

    const quizSchema = {
      type: Type.OBJECT,
      properties: {
        mcqs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN },
                  },
                  required: ["text", "isCorrect"],
                },
              },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "explanation"],
          },
        },
        conceptualQuestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
            },
             required: ["question", "answer"],
          },
        },
        problemSolvingTasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              problem: { type: Type.STRING },
              solution: { type: Type.STRING },
            },
            required: ["problem", "solution"],
          },
        },
      },
      required: ["mcqs", "conceptualQuestions", "problemSolvingTasks"],
    };
    
    // Select model and budget based on mode and task complexity
    const modelName = isThinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: quizSchema,
    };

    if (isThinkingMode) {
        // Thinking budget for gemini-3-pro-preview is 32768, and for gemini-3-flash-preview is 24576.
        config.thinkingConfig = { thinkingBudget: modelName === 'gemini-3-pro-preview' ? 32768 : 24576 };
    }

    let rawResponseText = '';
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config,
        });
        rawResponseText = response.text;
        const jsonText = extractJson(rawResponseText);
        const quiz = JSON.parse(jsonText) as Quiz;

        // Robust validation to ensure the quiz structure is correct
        if (
            !quiz ||
            !Array.isArray(quiz.mcqs) ||
            quiz.mcqs.some(mcq => 
                !mcq || 
                typeof mcq.question !== 'string' || 
                !Array.isArray(mcq.options) || 
                mcq.options.length === 0 || 
                mcq.options.some(opt => !opt || typeof opt.text !== 'string' || typeof opt.isCorrect !== 'boolean')
            )
        ) {
            console.error("Invalid quiz structure received from API:", quiz);
            return null;
        }

        return quiz;

    } catch (error) {
        console.error("Error generating quiz:", error);
        console.error("Failed to parse JSON for quiz:", rawResponseText);
        return null;
    }
};


export const getChatResponse = async (
  messages: { role: string; parts: { text: string }[] }[],
  topic: Topic,
  language: Language,
  isThinkingMode?: boolean
): Promise<string> => {
  const ai = getAI();
  const enhancedSystemInstruction = `${SYSTEM_INSTRUCTION} The user is currently in a conversational lesson about "${topic.title}" and prefers code examples in ${language}. Continue the lesson based on the last message.`;
  
  // Complex tutoring tasks: use gemini-3-pro-preview
  const config: any = {
      systemInstruction: enhancedSystemInstruction,
  };

  if (isThinkingMode) {
      config.thinkingConfig = { thinkingBudget: 32768 };
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: messages,
        config: config
    });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I seem to be having trouble connecting. Please try again in a moment.";
  }
};

export const getTextToSpeech = async (text: string): Promise<string | null> => {
  const ai = getAI();
  try {
    // Text-to-speech tasks: use gemini-2.5-flash-preview-tts
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and professionally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        return base64Audio;
    }
    return null;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

const challengeSchema = {
    type: Type.OBJECT,
    properties: {
        starterCode: {
            type: Type.OBJECT,
            properties: {
                Python: { type: Type.STRING, description: "Complete, runnable starter code for Python." },
                Java: { type: Type.STRING, description: "Complete, runnable starter code for Java, inside a Solution class." },
                'C++': { type: Type.STRING, description: "Complete, runnable starter code for C++." },
                C: { type: Type.STRING, description: "Complete, runnable starter code for C." },
            },
            required: ["Python", "Java", "C++", "C"],
        },
        testCases: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    input: { type: Type.STRING, description: "A string representation of the input for the test case." },
                    output: { type: Type.STRING, description: "A string representation of the expected output." },
                    isPublic: { type: Type.BOOLEAN, description: "Whether the test case is visible to the user." },
                },
                required: ["input", "output", "isPublic"],
            },
        },
    },
    required: ["starterCode", "testCases"],
};

export const prepareCodingChallengeFromProblem = async (problem: PracticeProblem, isThinkingMode?: boolean): Promise<CodingProblem | null> => {
    const ai = getAI();
    const prompt = `Based on the following problem, generate the necessary components for a coding challenge environment.
    
    Problem Title: "${problem.title}"
    Problem Description: 
    ${problem.description}
    
    Return the response as a single, valid JSON object containing only the 'starterCode' and 'testCases' keys.`;

    // Complex coding task: use gemini-3-pro-preview
    const modelName = 'gemini-3-pro-preview';
    const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: challengeSchema,
    };

    if (isThinkingMode) {
        config.thinkingConfig = { thinkingBudget: 32768 };
    }

    let rawResponseText = '';
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config,
        });
        rawResponseText = response.text;
        const jsonText = extractJson(rawResponseText);
        const partialChallenge = JSON.parse(jsonText) as Pick<CodingProblem, 'starterCode' | 'testCases'>;
        
        // A more robust validation to prevent crashes from malformed API responses.
        if (
            !partialChallenge ||
            typeof partialChallenge.starterCode !== 'object' ||
            partialChallenge.starterCode === null ||
            !Array.isArray(partialChallenge.testCases) ||
            LANGUAGES.some(lang => typeof partialChallenge.starterCode[lang] !== 'string') ||
            partialChallenge.testCases.length === 0 ||
            partialChallenge.testCases.some(tc => typeof tc.input !== 'string' || typeof tc.output !== 'string' || typeof tc.isPublic !== 'boolean')
        ) {
            console.error("Invalid coding problem structure received from API:", partialChallenge);
            return null;
        }

        // Combine with the original problem data to form a complete CodingProblem
        const codingProblem: CodingProblem = {
            id: problem.id,
            title: problem.title,
            description: problem.description,
            starterCode: partialChallenge.starterCode,
            testCases: partialChallenge.testCases,
        };
        
        return codingProblem;
    } catch (error) {
        console.error("Error preparing coding challenge:", error);
        console.error("Failed to parse JSON for coding challenge:", rawResponseText);
        return null;
    }
};

export const runCode = async (code: string, language: Language, problem: CodingProblem, isThinkingMode?: boolean): Promise<CodeExecutionResult | null> => {
    const ai = getAI();
    const prompt = `You are a code judge. Here is a solution in ${language} for the problem "${problem.title}".
Problem Description: ${problem.description}

User's Code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Evaluate the code against ALL of these test cases: ${JSON.stringify(problem.testCases)}.
Provide a response in JSON format.`;

    const executionSchema = {
        type: Type.OBJECT,
        properties: {
            results: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        input: { type: Type.STRING },
                        expectedOutput: { type: Type.STRING },
                        actualOutput: { type: Type.STRING },
                        passed: { type: Type.BOOLEAN },
                    },
                    required: ["input", "expectedOutput", "actualOutput", "passed"],
                },
            },
            consoleOutput: { type: Type.STRING },
            feedback: { type: Type.STRING },
        },
        required: ["results", "consoleOutput", "feedback"],
    };

    // Code judging task: use gemini-3-pro-preview if thinking requested, else flash.
    const modelName = isThinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: executionSchema,
    };
    if (isThinkingMode) {
        config.thinkingConfig = { thinkingBudget: modelName === 'gemini-3-pro-preview' ? 32768 : 24576 };
    }

    let rawResponseText = '';
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config,
        });
        rawResponseText = response.text;
        const jsonText = extractJson(rawResponseText);
        return JSON.parse(jsonText) as CodeExecutionResult;
    } catch (error) {
        console.error("Error running code:", error);
        console.error("Failed to parse JSON for code execution:", rawResponseText);
        return null;
    }
};

export const getHint = async (problem: CodingProblem, userCode: string, language: Language, isThinkingMode?: boolean): Promise<string> => {
    const ai = getAI();
    const prompt = `The user is solving the problem "${problem.title}" in ${language}.
Problem Description: ${problem.description}
Their current code is:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`
Provide a small, constructive hint to guide them. Do NOT give away the full solution.`;

    const modelName = isThinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
    };
    if (isThinkingMode) {
        config.thinkingConfig = { thinkingBudget: modelName === 'gemini-3-pro-preview' ? 32768 : 24576 };
    }

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting hint:", error);
        return "Sorry, I couldn't generate a hint right now.";
    }
};

export const explainCode = async (problem: CodingProblem, userCode: string, language: Language, isThinkingMode?: boolean): Promise<string> => {
    const ai = getAI();
    const prompt = `The user is solving the problem "${problem.title}" in ${language}.
Problem Description: ${problem.description}

Their current code is:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`

Provide a detailed, step-by-step explanation of the user's code. Explain the logic and approach.`;

    const modelName = isThinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
    };
    if (isThinkingMode) {
        config.thinkingConfig = { thinkingBudget: modelName === 'gemini-3-pro-preview' ? 32768 : 24576 };
    }

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config,
        });
        return response.text;
    } catch (error) {
        console.error("Error explaining code:", error);
        return "Sorry, I couldn't generate an explanation for the code right now.";
    }
};
