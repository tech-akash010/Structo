<div align="center">

# 🚀 Structo

### *AI-Powered DSA Learning Platform*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

**Master Data Structures & Algorithms through conversational AI, interactive visualizations, and real-time code evaluation**

[Features](#-features) • [Installation](#-installation) • [Tech Stack](#️-tech-stack) 
</div>

---

## 📖 About

Structo transforms DSA education through AI-powered tutoring with:

- 💬 **Conversational AI Tutor** - Instant explanations and code examples
- 🎨 **Live Visualizations** - Algorithm animations in real-time  
- 💻 **70+ Practice Problems** - AI code evaluation across 4 languages
- 🎯 **Progress Tracking** - Bookmarks and solution history
- 🧪 **Dynamic Quizzes** - Auto-generated MCQs with explanations

---

## ✨ Features

- **AI-Powered Learning**: Natural conversations, voice mode, thinking mode for complex topics
- **Multi-Language Support**: Python, Java, C++, C
- **Real-Time Feedback**: Instant code evaluation and smart hints
- **Interactive Visualizations**: Arrays, Linked Lists with 60fps animations
- **Practice Environment**: 70+ problems across Easy/Medium/Hard difficulties

---

## 🛠️ Tech Stack

**Frontend**: React 19 + TypeScript + Vite + Framer Motion  
**AI**: Google Gemini (Flash, Pro, TTS models)  
**Styling**: Vanilla CSS with glassmorphism & dark theme

---

## 📦 Installation

```bash
# Clone and install
git clone https://github.com/tech-akash010/Structo.git
cd Structo
npm install

# Setup environment
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

**Prerequisites**: Node.js v18+, [Gemini API Key](https://makersuite.google.com/app/apikey)

---

## 🎮 Usage

1. Select a topic from the sidebar
2. Chat with AI for explanations
3. Practice problems with real-time feedback
4. Track progress and bookmark topics

---

## 🚀 Deployment

**Vercel**
```bash
npm i -g vercel
vercel
```

**Netlify**: Connect repo, build with `npm run build` (dist), add `GEMINI_API_KEY`

**GitHub Pages**
```bash
npm i -g gh-pages
npm run build
gh-pages -d dist
```

---

## 📁 Project Structure

```
structo/
├── App.tsx                      # Main application
├── components/
│   ├── ProblemSolver.tsx        # Code editor + AI hints
│   ├── ArrayVisualizer.tsx      # Visualizations
│   └── ...
├── services/
│   └── geminiService.ts         # AI integration
└── data/
    └── practiceProblems.ts      # 70+ problems
```

---

## 🎯 Roadmap

**v1.5**: Tree/Graph visualizations, execution timer  
**v2.0**: Spaced repetition, study groups, achievements  
**v3.0**: Voice conversations, mobile apps, interview simulator

---

##  License

MIT License - Free to use, modify, and distribute.

---

<div align="center">

### 📚 Master DSA • 💡 Ace Interviews • 🚀 Build Confidence

[![Star on GitHub](https://img.shields.io/github/stars/tech-akash010/Structo?style=social)](https://github.com/tech-akash010/Structo)

**Built with ❤️ by [Akash Kundu](https://github.com/tech-akash010)**

*Powered by [Google Gemini AI](https://deepmind.google/technologies/gemini/), [React](https://reactjs.org/), and [Vite](https://vitejs.dev/)*

</div>
