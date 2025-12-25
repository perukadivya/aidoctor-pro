import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

interface AuthFormProps {
    onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    onRegister: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    onGoogleSignIn: () => Promise<{ success: boolean; error?: string }>;
    onContinueAsGuest?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, onGoogleSignIn, onContinueAsGuest }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = isLogin
                ? await onLogin(email, password)
                : await onRegister(email, password, name);

            if (!result.success) {
                setError(result.error || 'An error occurred');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            const result = await onGoogleSignIn();
            if (!result.success) {
                setError(result.error || 'Google sign-in failed');
            }
        } catch (err) {
            setError('Google sign-in failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.875rem 1rem 0.875rem 3rem',
        fontSize: '1rem',
        color: '#f8fafc',
        background: '#1e293b',
        border: '1px solid #475569',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 150ms ease',
    };

    const iconStyle: React.CSSProperties = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b',
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                    }}>
                        {isLogin ? <LogIn size={28} color="white" /> : <UserPlus size={28} color="white" />}
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        marginBottom: '0.5rem',
                    }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
                        {isLogin
                            ? 'Sign in to access your health records'
                            : 'Join AI Health Pro to save your consultations'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '0.875rem 1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        color: '#f87171',
                        fontSize: '0.9rem',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Google Sign-In Button */}
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isLoading}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: '#f8fafc',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        transition: 'all 150ms ease',
                        marginBottom: '1.5rem',
                        opacity: isGoogleLoading ? 0.7 : 1,
                    }}
                >
                    {isGoogleLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    )}
                    {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>or continue with email</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name Field (Register only) */}
                    {!isLogin && (
                        <div style={{ marginBottom: '1rem', position: 'relative' }}>
                            <User size={20} style={iconStyle} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                style={inputStyle}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    {/* Email Field */}
                    <div style={{ marginBottom: '1rem', position: 'relative' }}>
                        <Mail size={20} style={iconStyle} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <Lock size={20} style={iconStyle} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            style={{ ...inputStyle, paddingRight: '3rem' }}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                                padding: '0.25rem',
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'white',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 150ms ease',
                            opacity: isLoading ? 0.7 : 1,
                            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle Login/Register */}
                <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#60a5fa',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                            }}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Guest Option */}
                {onContinueAsGuest && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={onContinueAsGuest}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                textDecoration: 'underline',
                            }}
                        >
                            Continue as guest (records won't be saved)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
