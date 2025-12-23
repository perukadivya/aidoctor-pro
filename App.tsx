import React, { useState, useEffect } from 'react';
import {
    Stethoscope, Brain, Shield, Heart, Activity,
    ArrowRight, Search, FileText, Sparkles, Loader2,
    AlertTriangle, CheckCircle, MessageCircle, LogOut, User, Clock, History
} from 'lucide-react';

import Header from './components/Header';
import PatientProfileForm from './components/PatientProfileForm';
import SymptomInput from './components/SymptomInput';
import DiagnosisCard from './components/DiagnosisCard';
import SecondOpinionPanel from './components/SecondOpinionPanel';
import RiskIndicator from './components/RiskIndicator';
import HealthChart from './components/HealthChart';
import AuthForm from './components/AuthForm';
import ConsultationHistory from './components/ConsultationHistory';

import { analyzeSymptoms, getSecondOpinion } from './services/geminiService';
import * as authService from './services/authService';

import type {
    ViewState, PatientProfile, Symptom, DiagnosisResult, SecondOpinionResult, ConsultationSession
} from './types';

// ==========================================
// Main App Component
// ==========================================

const App: React.FC = () => {
    // Auth state
    const [user, setUser] = useState<authService.User | null>(null);
    const [showAuth, setShowAuth] = useState(false);

    // Navigation
    const [currentView, setCurrentView] = useState<ViewState>('home');

    // Patient Profile (persisted per user)
    const [profile, setProfile] = useState<PatientProfile | null>(null);

    // Consultation history
    const [consultations, setConsultations] = useState<ConsultationSession[]>([]);

    // Symptoms for consultation
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [additionalNotes, setAdditionalNotes] = useState('');

    // Analysis results
    const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
    const [secondOpinionResult, setSecondOpinionResult] = useState<SecondOpinionResult | null>(null);

    // Second opinion form
    const [existingDiagnosis, setExistingDiagnosis] = useState('');
    const [prescribedTreatment, setPrescribedTreatment] = useState('');
    const [patientConcerns, setPatientConcerns] = useState('');

    // Loading states
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGettingSecondOpinion, setIsGettingSecondOpinion] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load auth state on mount
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            loadUserData(currentUser.id);
        }
    }, []);

    // Load user data
    const loadUserData = (userId: string) => {
        const userData = authService.getUserData(userId);
        setProfile(userData.profile);
        setConsultations(userData.consultations);
    };

    // Handle login
    const handleLogin = (email: string, password: string) => {
        const result = authService.login(email, password);
        if (result.success && result.user) {
            setUser(result.user);
            loadUserData(result.user.id);
            setShowAuth(false);
        }
        return result;
    };

    // Handle register
    const handleRegister = (email: string, password: string, name: string) => {
        const result = authService.register(email, password, name);
        if (result.success && result.user) {
            setUser(result.user);
            loadUserData(result.user.id);
            setShowAuth(false);
        }
        return result;
    };

    // Handle logout
    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setProfile(null);
        setConsultations([]);
        setCurrentView('home');
    };

    // Save profile (with user association)
    const handleSaveProfile = (newProfile: PatientProfile) => {
        setProfile(newProfile);
        if (user) {
            authService.saveUserProfile(user.id, newProfile);
        } else {
            localStorage.setItem('aidoctor_profile', JSON.stringify(newProfile));
        }
    };

    // Save consultation to history
    const saveConsultationToHistory = (session: ConsultationSession) => {
        if (user) {
            authService.saveConsultation(user.id, session);
            setConsultations(prev => [session, ...prev]);
        }
    };

    // Delete consultation
    const handleDeleteConsultation = (id: string) => {
        if (user) {
            authService.deleteConsultation(user.id, id);
            setConsultations(prev => prev.filter(c => c.id !== id));
        }
    };

    // View consultation details
    const handleViewConsultation = (consultation: ConsultationSession) => {
        setSymptoms(consultation.symptoms);
        setDiagnosisResult(consultation.diagnosis || null);
        setCurrentView('consultation');
    };

    // Analyze symptoms
    const handleAnalyzeSymptoms = async () => {
        if (symptoms.length === 0) {
            setError('Please add at least one symptom');
            return;
        }

        setError(null);
        setIsAnalyzing(true);
        setDiagnosisResult(null);

        try {
            const result = await analyzeSymptoms(symptoms, profile, additionalNotes);
            setDiagnosisResult(result);

            // Save to history if logged in
            if (user) {
                const session: ConsultationSession = {
                    id: crypto.randomUUID(),
                    startTime: new Date().toISOString(),
                    symptoms: [...symptoms],
                    messages: [],
                    diagnosis: result,
                    patientProfile: profile || undefined,
                };
                saveConsultationToHistory(session);
            }
        } catch (e: any) {
            setError(e.message || 'Failed to analyze symptoms. Please check your API key and try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Get second opinion
    const handleGetSecondOpinion = async () => {
        if (!existingDiagnosis.trim()) {
            setError('Please enter your existing diagnosis');
            return;
        }

        setError(null);
        setIsGettingSecondOpinion(true);
        setSecondOpinionResult(null);

        try {
            const result = await getSecondOpinion(
                existingDiagnosis,
                symptoms,
                prescribedTreatment,
                patientConcerns,
                profile
            );
            setSecondOpinionResult(result);

            // Save to history if logged in
            if (user) {
                const session: ConsultationSession = {
                    id: crypto.randomUUID(),
                    startTime: new Date().toISOString(),
                    symptoms: [...symptoms],
                    messages: [],
                    secondOpinion: result,
                    patientProfile: profile || undefined,
                };
                saveConsultationToHistory(session);
            }
        } catch (e: any) {
            setError(e.message || 'Failed to get second opinion. Please check your API key and try again.');
        } finally {
            setIsGettingSecondOpinion(false);
        }
    };

    // Show auth form
    if (showAuth) {
        return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
    }

    // Render content based on view
    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return <HomeView onNavigate={setCurrentView} user={user} onShowAuth={() => setShowAuth(true)} />;
            case 'consultation':
                return (
                    <ConsultationView
                        profile={profile}
                        onSaveProfile={handleSaveProfile}
                        symptoms={symptoms}
                        onSymptomsChange={setSymptoms}
                        additionalNotes={additionalNotes}
                        onNotesChange={setAdditionalNotes}
                        onAnalyze={handleAnalyzeSymptoms}
                        isAnalyzing={isAnalyzing}
                        result={diagnosisResult}
                        error={error}
                        user={user}
                        consultations={consultations}
                        onDeleteConsultation={handleDeleteConsultation}
                        onViewConsultation={handleViewConsultation}
                    />
                );
            case 'second-opinion':
                return (
                    <SecondOpinionView
                        profile={profile}
                        onSaveProfile={handleSaveProfile}
                        symptoms={symptoms}
                        onSymptomsChange={setSymptoms}
                        existingDiagnosis={existingDiagnosis}
                        onDiagnosisChange={setExistingDiagnosis}
                        prescribedTreatment={prescribedTreatment}
                        onTreatmentChange={setPrescribedTreatment}
                        patientConcerns={patientConcerns}
                        onConcernsChange={setPatientConcerns}
                        onSubmit={handleGetSecondOpinion}
                        isLoading={isGettingSecondOpinion}
                        result={secondOpinionResult}
                        error={error}
                    />
                );
            case 'profile':
                return (
                    <ProfileView
                        profile={profile}
                        onSaveProfile={handleSaveProfile}
                        user={user}
                        consultations={consultations}
                        onDeleteConsultation={handleDeleteConsultation}
                        onViewConsultation={handleViewConsultation}
                    />
                );
            case 'history':
                return (
                    <HistoryView
                        consultations={consultations}
                        onDeleteConsultation={handleDeleteConsultation}
                        onViewConsultation={handleViewConsultation}
                    />
                );
            default:
                return <HomeView onNavigate={setCurrentView} user={user} onShowAuth={() => setShowAuth(true)} />;
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '72px' }}>
            <HeaderWithAuth
                currentView={currentView}
                onNavigate={setCurrentView}
                user={user}
                onShowAuth={() => setShowAuth(true)}
                onLogout={handleLogout}
            />
            <main>
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

// ==========================================
// Header with Auth
// ==========================================

interface HeaderWithAuthProps {
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
    user: authService.User | null;
    onShowAuth: () => void;
    onLogout: () => void;
}

const HeaderWithAuth: React.FC<HeaderWithAuthProps> = ({
    currentView, onNavigate, user, onShowAuth, onLogout
}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '72px',
            }}>
                {/* Logo */}
                <div
                    onClick={() => onNavigate('home')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                    }}
                >
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                    }}>
                        <Stethoscope size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #60a5fa 0%, #2dd4bf 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: 0,
                        }}>
                            AIDoctor Pro
                        </h1>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                            AI Medical Advisor
                        </p>
                    </div>
                </div>

                {/* Nav + Auth */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Navigation */}
                    <nav style={{ display: 'flex', gap: '0.5rem' }}>
                        {[
                            { view: 'consultation' as ViewState, label: 'Consultation', icon: <MessageCircle size={18} /> },
                            { view: 'second-opinion' as ViewState, label: 'Second Opinion', icon: <Stethoscope size={18} /> },
                        ].map((item) => (
                            <button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: currentView === item.view ? '#3b82f6' : '#cbd5e1',
                                    background: currentView === item.view ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                }}
                            >
                                {item.icon}
                                <span className="hide-mobile">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* User Menu or Sign In */}
                    {user ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.875rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '100px',
                                    cursor: 'pointer',
                                    color: '#60a5fa',
                                }}
                            >
                                <User size={18} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }} className="hide-mobile">
                                    {user.name.split(' ')[0]}
                                </span>
                            </button>

                            {showUserMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    right: 0,
                                    width: '200px',
                                    background: 'rgba(15, 23, 42, 0.98)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                                }}>
                                    <div style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                                            {user.name}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#cbd5e1',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        <User size={16} />
                                        My Profile
                                    </button>
                                    <button
                                        onClick={() => { onNavigate('history'); setShowUserMenu(false); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#cbd5e1',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        <History size={16} />
                                        My Records
                                    </button>
                                    <button
                                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#f87171',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={onShowAuth}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.625rem 1.25rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'white',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                border: 'none',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                            }}
                        >
                            <User size={16} />
                            Sign In
                        </button>
                    )}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
        </header>
    );
};

// ==========================================
// Home View
// ==========================================

interface HomeViewProps {
    onNavigate: (view: ViewState) => void;
    user: authService.User | null;
    onShowAuth: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, user, onShowAuth }) => {
    const features = [
        {
            icon: Brain,
            title: 'AI Symptom Analysis',
            description: 'Describe your symptoms and get an intelligent analysis of possible conditions.',
            color: '#3b82f6',
        },
        {
            icon: Stethoscope,
            title: 'Second Opinion',
            description: 'Have an existing diagnosis? Get an AI-powered review and additional insights.',
            color: '#14b8a6',
        },
        {
            icon: Shield,
            title: 'Personalized Care',
            description: 'Your health profile ensures all insights consider your unique medical history.',
            color: '#8b5cf6',
        },
        {
            icon: Clock,
            title: 'Save Records',
            description: 'Create an account to save your consultation history and access it anytime.',
            color: '#f43f5e',
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                padding: '5rem 0 6rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                }} />

                <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '100px',
                        marginBottom: '1.5rem',
                    }}>
                        <Sparkles size={16} color="#60a5fa" />
                        <span style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 500 }}>
                            Powered by Gemini AI
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Your AI Medical Advisor<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            For Informed Decisions
                        </span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: '#94a3b8',
                        maxWidth: '640px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.7,
                    }}>
                        Get intelligent symptom analysis and second opinions to help you
                        prepare for conversations with your healthcare provider.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => onNavigate('consultation')}
                            className="btn btn-primary btn-lg"
                            style={{ minWidth: '200px' }}
                        >
                            <MessageCircle size={20} />
                            Start Consultation
                        </button>
                        {!user && (
                            <button
                                onClick={onShowAuth}
                                className="btn btn-secondary btn-lg"
                                style={{ minWidth: '200px' }}
                            >
                                <User size={20} />
                                Sign In to Save Records
                            </button>
                        )}
                    </div>

                    {/* Trust Indicators */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '3rem',
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { icon: CheckCircle, text: 'Private & Secure' },
                            { icon: Activity, text: 'Evidence-Based' },
                            { icon: Shield, text: 'Personalized' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <item.icon size={18} color="#10b981" />
                                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>How AIDoctor Pro Helps You</h2>
                        <p style={{ color: '#94a3b8' }}>
                            Empowering you with AI-driven health insights in simple, understandable language.
                        </p>
                    </div>

                    <div className="grid grid-cols-4">
                        {features.map((feature, i) => (
                            <div key={i} className="card" style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '16px',
                                    background: `${feature.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.25rem',
                                }}>
                                    <feature.icon size={28} color={feature.color} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: '#f8fafc' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section style={{ padding: '2rem 0', background: '#0f172a' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1.25rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '12px',
                    }}>
                        <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h4 style={{ fontSize: '0.95rem', color: '#fbbf24', marginBottom: '0.5rem' }}>
                                Medical Disclaimer
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: '#fcd34d', margin: 0, lineHeight: 1.6 }}>
                                AIDoctor Pro is designed for <strong>educational and informational purposes only</strong>.
                                It does not provide medical diagnoses or replace professional healthcare.
                                Always consult qualified healthcare providers for medical decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

// ==========================================
// Consultation View
// ==========================================

interface ConsultationViewProps {
    profile: PatientProfile | null;
    onSaveProfile: (profile: PatientProfile) => void;
    symptoms: Symptom[];
    onSymptomsChange: (symptoms: Symptom[]) => void;
    additionalNotes: string;
    onNotesChange: (notes: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
    result: DiagnosisResult | null;
    error: string | null;
    user: authService.User | null;
    consultations: ConsultationSession[];
    onDeleteConsultation: (id: string) => void;
    onViewConsultation: (consultation: ConsultationSession) => void;
}

const ConsultationView: React.FC<ConsultationViewProps> = ({
    profile, onSaveProfile, symptoms, onSymptomsChange,
    additionalNotes, onNotesChange, onAnalyze, isAnalyzing, result, error,
    user, consultations, onDeleteConsultation, onViewConsultation
}) => {
    return (
        <section className="section">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="section-header">
                    <h2>
                        <Brain size={32} style={{ display: 'inline', marginRight: '0.75rem', color: '#3b82f6' }} />
                        AI Consultation
                    </h2>
                    <p style={{ color: '#94a3b8' }}>
                        Describe your symptoms and receive an intelligent analysis of possible conditions.
                    </p>
                </div>

                {/* Profile */}
                <PatientProfileForm profile={profile} onSave={onSaveProfile} collapsed={!!profile} />

                {/* Symptoms */}
                <div style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
                        <Search size={20} style={{ display: 'inline', marginRight: '0.5rem', color: '#60a5fa' }} />
                        Describe Your Symptoms
                    </h3>
                    <SymptomInput symptoms={symptoms} onChange={onSymptomsChange} />
                </div>

                {/* Additional Notes */}
                <div style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.5rem', display: 'block' }}>
                        <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Additional Notes (optional)
                    </label>
                    <textarea
                        value={additionalNotes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="Any other information you think might be relevant..."
                        className="input textarea"
                        style={{ minHeight: '100px' }}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        color: '#f87171',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Analyze Button */}
                <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing || symptoms.length === 0}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginBottom: '2rem' }}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Analyzing Your Symptoms...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Analyze Symptoms with AI
                        </>
                    )}
                </button>

                {/* Save notice */}
                {!user && (
                    <div style={{
                        padding: '0.875rem 1rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.85rem',
                        color: '#93c5fd',
                    }}>
                        💡 Sign in to save your consultation history and access it later.
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="animate-slide-up">
                        <div className="divider" />

                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Activity size={28} color="#10b981" />
                            Analysis Results
                            {user && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    color: '#34d399',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                }}>
                                    ✓ Saved
                                </span>
                            )}
                        </h2>

                        <RiskIndicator
                            urgency={result.urgencyLevel}
                            recommendations={result.recommendedActions}
                        />

                        {result.possibleConditions.length > 0 && (
                            <HealthChart conditions={result.possibleConditions} />
                        )}

                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '1rem' }}>
                            Possible Conditions
                        </h3>
                        {result.possibleConditions.map((condition, i) => (
                            <DiagnosisCard key={i} condition={condition} index={i} />
                        ))}

                        {result.warningSignsToWatch && result.warningSignsToWatch.length > 0 && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem',
                            }}>
                                <h4 style={{ color: '#f87171', marginBottom: '0.75rem' }}>
                                    ⚠️ Warning Signs to Watch
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#fecaca' }}>
                                    {result.warningSignsToWatch.map((sign, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{sign}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
                            <div style={{
                                background: 'rgba(139, 92, 246, 0.08)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem',
                            }}>
                                <h4 style={{ color: '#a78bfa', marginBottom: '0.75rem' }}>
                                    💬 Questions to Ask Your Doctor
                                </h4>
                                <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#c4b5fd' }}>
                                    {result.questionsForDoctor.map((q, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{q}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        <div style={{
                            padding: '1rem',
                            background: 'rgba(100, 116, 139, 0.1)',
                            borderRadius: '12px',
                            borderLeft: '3px solid #64748b',
                        }}>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                                ⚠️ {result.disclaimer}
                            </p>
                        </div>
                    </div>
                )}

                {/* Recent Consultations (if logged in) */}
                {user && consultations.length > 0 && !result && (
                    <div style={{ marginTop: '2rem' }}>
                        <div className="divider" />
                        <ConsultationHistory
                            consultations={consultations.slice(0, 3)}
                            onDelete={onDeleteConsultation}
                            onView={onViewConsultation}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

// ==========================================
// Second Opinion View
// ==========================================

interface SecondOpinionViewProps {
    profile: PatientProfile | null;
    onSaveProfile: (profile: PatientProfile) => void;
    symptoms: Symptom[];
    onSymptomsChange: (symptoms: Symptom[]) => void;
    existingDiagnosis: string;
    onDiagnosisChange: (diagnosis: string) => void;
    prescribedTreatment: string;
    onTreatmentChange: (treatment: string) => void;
    patientConcerns: string;
    onConcernsChange: (concerns: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    result: SecondOpinionResult | null;
    error: string | null;
}

const SecondOpinionView: React.FC<SecondOpinionViewProps> = ({
    profile, onSaveProfile, symptoms, onSymptomsChange,
    existingDiagnosis, onDiagnosisChange,
    prescribedTreatment, onTreatmentChange,
    patientConcerns, onConcernsChange,
    onSubmit, isLoading, result, error
}) => {
    const cardStyle: React.CSSProperties = {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="section-header">
                    <h2>
                        <Stethoscope size={32} style={{ display: 'inline', marginRight: '0.75rem', color: '#14b8a6' }} />
                        Get a Second Opinion
                    </h2>
                    <p style={{ color: '#94a3b8' }}>
                        Already have a diagnosis? Get an AI-powered analysis to help you understand it better.
                    </p>
                </div>

                <PatientProfileForm profile={profile} onSave={onSaveProfile} collapsed={!!profile} />

                <div style={cardStyle}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
                        📋 Your Current Diagnosis
                    </h3>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">What were you diagnosed with?</label>
                        <input
                            type="text"
                            value={existingDiagnosis}
                            onChange={(e) => onDiagnosisChange(e.target.value)}
                            placeholder="e.g., Type 2 Diabetes, Migraine, Hypertension..."
                            className="input"
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Treatment Prescribed (optional)</label>
                        <textarea
                            value={prescribedTreatment}
                            onChange={(e) => onTreatmentChange(e.target.value)}
                            placeholder="What medications or treatments were recommended?"
                            className="input textarea"
                            style={{ minHeight: '80px' }}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Your Concerns (optional)</label>
                        <textarea
                            value={patientConcerns}
                            onChange={(e) => onConcernsChange(e.target.value)}
                            placeholder="What questions or concerns do you have about this diagnosis?"
                            className="input textarea"
                            style={{ minHeight: '80px' }}
                        />
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
                        🩺 Current Symptoms (Optional)
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Adding your current symptoms helps us provide a more accurate analysis.
                    </p>
                    <SymptomInput symptoms={symptoms} onChange={onSymptomsChange} />
                </div>

                {error && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        color: '#f87171',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <button
                    onClick={onSubmit}
                    disabled={isLoading || !existingDiagnosis.trim()}
                    className="btn btn-accent btn-lg"
                    style={{ width: '100%', marginBottom: '2rem' }}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Analyzing Diagnosis...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Get AI Second Opinion
                        </>
                    )}
                </button>

                {result && (
                    <div className="animate-slide-up">
                        <div className="divider" />
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Stethoscope size={28} color="#14b8a6" />
                            Second Opinion Analysis
                        </h2>
                        <SecondOpinionPanel result={result} />
                    </div>
                )}
            </div>
        </section>
    );
};

// ==========================================
// Profile View
// ==========================================

interface ProfileViewProps {
    profile: PatientProfile | null;
    onSaveProfile: (profile: PatientProfile) => void;
    user: authService.User | null;
    consultations: ConsultationSession[];
    onDeleteConsultation: (id: string) => void;
    onViewConsultation: (consultation: ConsultationSession) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
    profile, onSaveProfile, user, consultations, onDeleteConsultation, onViewConsultation
}) => {
    return (
        <section className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="section-header">
                    <h2>Your Health Profile</h2>
                    <p style={{ color: '#94a3b8' }}>
                        Keep your health information up to date for more personalized insights.
                    </p>
                </div>

                {user && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <User size={24} color="white" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                                {user.name}
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                                {user.email} • {consultations.length} consultations saved
                            </p>
                        </div>
                    </div>
                )}

                <PatientProfileForm profile={profile} onSave={onSaveProfile} collapsed={false} />

                {user && consultations.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <ConsultationHistory
                            consultations={consultations}
                            onDelete={onDeleteConsultation}
                            onView={onViewConsultation}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

// ==========================================
// History View
// ==========================================

interface HistoryViewProps {
    consultations: ConsultationSession[];
    onDeleteConsultation: (id: string) => void;
    onViewConsultation: (consultation: ConsultationSession) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({
    consultations, onDeleteConsultation, onViewConsultation
}) => {
    return (
        <section className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="section-header">
                    <h2>
                        <History size={32} style={{ display: 'inline', marginRight: '0.75rem', color: '#60a5fa' }} />
                        Consultation History
                    </h2>
                    <p style={{ color: '#94a3b8' }}>
                        View and manage your saved consultations.
                    </p>
                </div>

                <ConsultationHistory
                    consultations={consultations}
                    onDelete={onDeleteConsultation}
                    onView={onViewConsultation}
                />
            </div>
        </section>
    );
};

// ==========================================
// Footer
// ==========================================

const Footer: React.FC = () => {
    return (
        <footer style={{
            padding: '2rem 0',
            background: '#020617',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Stethoscope size={20} color="#3b82f6" />
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>AIDoctor Pro</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    © {new Date().getFullYear()} AIDoctor Pro. For educational purposes only. Not a substitute for professional medical advice.
                </p>
            </div>
        </footer>
    );
};

export default App;
