# AIDoctor Pro 🩺

**AI-Powered Medical Second Opinion Platform** built with React, TypeScript, Vite, and Google Gemini AI.

![AIDoctor Pro](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)

## ✨ Features

- 🧠 **AI Symptom Analysis** - Describe symptoms and get intelligent analysis of possible conditions
- 🩺 **Second Opinion** - Enter existing diagnosis, get AI-powered review and alternatives
- 👤 **User Authentication** - Register/login to save consultation history
- 📋 **Health Profile** - Persistent patient profile (conditions, medications, allergies)
- 🚨 **Risk Assessment** - Color-coded urgency indicators (Low/Medium/High/Emergency)
- 💬 **Simple Language** - Medical concepts explained in everyday terms

## 🖼️ Screenshots

### Home Page
Premium dark-themed UI with gradient accents and glassmorphism effects.

### Consultation Flow
Multi-step symptom input with severity levels, duration, and body location.

### AI Analysis Results
Expandable condition cards with confidence scores, treatments, and warning signs.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aidoctor-pro.git
cd aidoctor-pro

# Install dependencies
npm install

# Create environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Gemini AI** | AI Analysis |
| **Recharts** | Data Visualization |
| **Lucide React** | Icons |

## 📁 Project Structure

```
├── App.tsx                    # Main app with auth integration
├── index.tsx                  # React entry point
├── index.css                  # Premium theme styles
├── types.ts                   # TypeScript definitions
├── components/
│   ├── Header.tsx             # Navigation header
│   ├── AuthForm.tsx           # Login/Register
│   ├── ConsultationHistory.tsx
│   ├── PatientProfileForm.tsx
│   ├── SymptomInput.tsx
│   ├── DiagnosisCard.tsx
│   ├── SecondOpinionPanel.tsx
│   ├── RiskIndicator.tsx
│   └── HealthChart.tsx
└── services/
    ├── geminiService.ts       # Gemini AI integration
    └── authService.ts         # Authentication
```

## ⚠️ Disclaimer

> **AIDoctor Pro is for educational and informational purposes only.**
> It does not provide medical diagnoses or replace professional healthcare.
> Always consult qualified healthcare providers for medical decisions.
> If experiencing a medical emergency, call your local emergency services.

## 📄 License

MIT License - feel free to use for learning and personal projects.

---

Built with ❤️ using [Gemini AI](https://ai.google.dev/)
