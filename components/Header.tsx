import React from 'react';
import { Stethoscope, Menu, X, User, MessageCircle, Home } from 'lucide-react';
import type { ViewState } from '../types';

interface HeaderProps {
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const navItems: { view: ViewState; label: string; icon: React.ReactNode }[] = [
        { view: 'home', label: 'Home', icon: <Home size={18} /> },
        { view: 'consultation', label: 'Consultation', icon: <MessageCircle size={18} /> },
        { view: 'second-opinion', label: 'Second Opinion', icon: <Stethoscope size={18} /> },
        { view: 'profile', label: 'Profile', icon: <User size={18} /> },
    ];

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

                {/* Desktop Navigation */}
                <nav style={{
                    display: 'flex',
                    gap: '0.5rem',
                }} className="hide-mobile">
                    {navItems.map((item) => (
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
                                transition: 'all 150ms ease',
                            }}
                            onMouseOver={(e) => {
                                if (currentView !== item.view) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (currentView !== item.view) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="show-mobile"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#cbd5e1',
                        cursor: 'pointer',
                        display: 'none',
                    }}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="show-mobile"
                    style={{
                        position: 'absolute',
                        top: '72px',
                        left: 0,
                        right: 0,
                        background: 'rgba(15, 23, 42, 0.98)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '1rem',
                        display: 'none',
                    }}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => {
                                onNavigate(item.view);
                                setMobileMenuOpen(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.875rem 1rem',
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: currentView === item.view ? '#3b82f6' : '#cbd5e1',
                                background: currentView === item.view ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginBottom: '0.5rem',
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
        </header>
    );
};

export default Header;
