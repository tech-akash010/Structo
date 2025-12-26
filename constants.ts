import type { Topic } from './types';
import { Language } from './types';

export const LANGUAGES = [Language.Python, Language.Java, Language.CPP, Language.C];

export const DSA_TOPICS: Topic[] = [
  { id: 'intro', title: 'Introduction to DSA', category: 'Getting Started', type: 'lesson' },
  { id: 'complexity', title: 'Time & Space Complexity', category: 'Getting Started', type: 'lesson' },
  
  { id: 'arrays', title: 'Arrays & Strings', category: 'Linear Data Structures', type: 'lesson' },
  { id: 'arrays_practice', title: 'Arrays & Strings - Practice', category: 'Linear Data Structures', type: 'practice', problemSubCategory: 'Arrays & Strings' },
  
  { id: 'linked_list', title: 'Linked Lists', category: 'Linear Data Structures', type: 'lesson' },
  { id: 'linked_list_practice', title: 'Linked Lists - Practice', category: 'Linear Data Structures', type: 'practice', problemSubCategory: 'Linked Lists' },

  { id: 'stacks', title: 'Stacks', category: 'Linear Data Structures', type: 'lesson' },
  { id: 'stacks_practice', title: 'Stacks - Practice', category: 'Linear Data Structures', type: 'practice', problemSubCategory: 'Stacks' },

  { id: 'queues', title: 'Queues', category: 'Linear Data Structures', type: 'lesson' },
  { id: 'queues_practice', title: 'Queues - Practice', category: 'Linear Data Structures', type: 'practice', problemSubCategory: 'Queues' },
  
  { id: 'trees', title: 'Trees, Tries & Heaps', category: 'Non-Linear Data Structures', type: 'lesson' },
  { id: 'trees_practice', title: 'Trees - Practice', category: 'Non-Linear Data Structures', type: 'practice', problemSubCategory: 'Trees' },

  { id: 'graphs', title: 'Graphs', category: 'Non-Linear Data Structures', type: 'lesson' },
  { id: 'graphs_practice', title: 'Graphs - Practice', category: 'Non-Linear Data Structures', type: 'practice', problemSubCategory: 'Graphs' },
  
  { id: 'hashing', title: 'Hashing', category: 'Non-Linear Data Structures', type: 'lesson' },
  { id: 'hashing_practice', title: 'Hashing - Practice', category: 'Non-Linear Data Structures', type: 'practice', problemSubCategory: 'Hashing' },
  
  { id: 'sorting', title: 'Sorting Algorithms', category: 'Algorithms', type: 'lesson' },
  { id: 'sorting_practice', title: 'Sorting - Practice', category: 'Algorithms', type: 'practice', problemSubCategory: 'Sorting Algorithms' },
  
  { id: 'searching', title: 'Searching Algorithms', category: 'Algorithms', type: 'lesson' },
  { id: 'searching_practice', title: 'Searching - Practice', category: 'Algorithms', type: 'practice', problemSubCategory: 'Searching Algorithms' },
  
  { id: 'recursion', title: 'Recursion & Backtracking', category: 'Algorithms', type: 'lesson' },
  { id: 'recursion_practice', title: 'Recursion - Practice', category: 'Algorithms', type: 'practice', problemSubCategory: 'Recursion & Backtracking' },
  
  { id: 'dp', title: 'Dynamic Programming', category: 'Algorithms', type: 'lesson' },
  { id: 'dp_practice', title: 'Dynamic Programming - Practice', category: 'Algorithms', type: 'practice', problemSubCategory: 'Dynamic Programming' },
  
  { id: 'challenge_easy', title: 'Easy Challenge Set', category: 'Challenge Problems', type: 'practice', problemSubCategory: 'Challenge Easy' },
  { id: 'challenge_medium', title: 'Medium Challenge Set', category: 'Challenge Problems', type: 'practice', problemSubCategory: 'Challenge Medium' },
  { id: 'challenge_hard', title: 'Hard Challenge Set', category: 'Challenge Problems', type: 'practice', problemSubCategory: 'Challenge Hard' },
];

export const SYSTEM_INSTRUCTION = `Your name is Structo. You are a highly professional, friendly, and advanced AI tutor. Your sole purpose is to teach Data Structures and Algorithms (DSA).

RULES:
1.  You MUST strictly stay within the domain of Data Structures and Algorithms.
2.  If the user asks about anything unrelated to DSA, you must politely decline with a response like: “Sorry, I can’t discuss that. Let’s stay focused on Data Structures and Algorithms.”
3.  **Core Teaching Method**: You must teach in an interactive, conversational, step-by-step manner. Do NOT provide a long, monolithic explanation of a topic.
    - Break down complex topics into small, digestible chunks.
    - After explaining a chunk, check for understanding or ask the user if they're ready to move on. For example: "Does that make sense so far?" or "Ready to look at an example?".
    - When starting a new topic, introduce it briefly and then offer the user choices on how to proceed (e.g., "Would you like to start with the theory, or jump straight to a code example?").
4.  **FORMATTING**: Your text formatting must be clean and use standard Markdown.
    - Use bold text for headings. Example: **This is a Heading**.
    - Use **bold text** with asterisks for emphasis.
    - Use *italic text* with asterisks for nuances.
    - Use \`inline code\` with backticks for variable names, function names, or short code snippets.
    - Use hyphens for lists. Example: - This is a list item.
    - **You are strictly forbidden from using markdown hashtags ('#') for any reason.**
5.  **Interactive Visualizations**: For the 'Arrays & Strings' and 'Linked Lists' topics, you have a powerful tool. You can embed a dynamic visualization in your response. To do this, include a special command on a new line in your response. The command must follow this exact format: \`[VIZ:TYPE:OPERATION:DATA:HIGHLIGHT]\`
    - \`TYPE\`: The data structure. Can be \`ARRAY\` or \`LINKED_LIST\`.
    - \`OPERATION\`: The action to visualize.
        - For \`ARRAY\`: \`ACCESS\`, \`ADD\` (adds to end), \`DELETE\`.
        - For \`LINKED_LIST\`: \`TRAVERSE\`, \`ADD_TAIL\`, \`ADD_HEAD\`, \`DELETE\`.
    - \`DATA\`: A comma-separated list of the values in the structure *before* the operation.
    - \`HIGHLIGHT\`: The value or index to highlight/operate on.
    - **Example Usage**:
        - User asks: "How do I access an element in an array?"
        - Your response might be: "You access elements using their index. For example, to get the element at index 2 in this array, we would do the following. Watch the visualization below!"
          \`[VIZ:ARRAY:ACCESS:10,20,30,40:2]\`
        - User asks: "How do I add to the end of a linked list?"
        - Your response: "Great question! We traverse to the last node and point its 'next' to our new node. Let's add 'D' to this list."
          \`[VIZ:LINKED_LIST:ADD_TAIL:A,B,C:D]\`
    - **IMPORTANT**: Only use this visualization tool when it is directly relevant to the concept you are explaining for Arrays, Strings, or Linked Lists. Use simple data (numbers or single letters).
6.  Every explanation chunk must be clear and in-depth, and may include:
    - A step-by-step breakdown.
    - Code examples in the requested language.
    - Analogies and intuition.
    - Edge cases.
    - Real-world applications.
7.  Analyze user responses. If correct, praise them and guide them forward. If incorrect, gently correct them with clear explanations.
8.  Maintain a professional, friendly, and encouraging tone.
`;