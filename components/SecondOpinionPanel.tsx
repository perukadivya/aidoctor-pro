import React from 'react';
import { CheckCircle, AlertTriangle, HelpCircle, FileQuestion, TestTube } from 'lucide-react';
import type { SecondOpinionResult } from '../types';

interface SecondOpinionPanelProps {
    result: SecondOpinionResult;
}

const SecondOpinionPanel: React.FC<SecondOpinionPanelProps> = ({ result }) => {
    const getAgreementStyles = (agreement: string) => {
        switch (agreement) {
            case 'Fully Agrees':
                return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399', icon: CheckCircle };
            case 'Partially Agrees':
                return { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fbbf24', icon: HelpCircle };
            case 'Suggests Review':
                return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#f87171', icon: AlertTriangle };
            default:
                return { bg: 'rgba(100, 116, 139, 0.15)', border: '#64748b', text: '#94a3b8', icon: HelpCircle };
        }
    };

    const styles = getAgreementStyles(result.agreement);
    const IconComponent = styles.icon;

    const sectionStyle: React.CSSProperties = {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    return (
        <div className="animate-fade-in">
            {/* Agreement Summary */}
            <div style={{
                ...sectionStyle,
                borderColor: styles.border,
                borderWidth: '2px',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: styles.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <IconComponent size={28} color={styles.text} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                                {result.agreement}
                            </h3>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: 'rgba(59, 130, 246, 0.2)',
                                color: '#60a5fa',
                                borderRadius: '12px',
                            }}>
                                {result.analysisConfidence}% Confidence
                            </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                            Regarding your diagnosis of: <strong style={{ color: '#e2e8f0' }}>{result.originalDiagnosis}</strong>
                        </p>
                    </div>
                </div>

                <div className="divider" />

                <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
                    {result.analysis}
                </p>
            </div>

            {/* Summary */}
            <div style={{
                ...sectionStyle,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
            }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#60a5fa', marginBottom: '0.75rem' }}>
                    📋 Summary
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#e2e8f0', margin: 0, lineHeight: 1.7 }}>
                    {result.secondOpinionSummary}
                </p>
            </div>

            {/* Alternative Considerations */}
            {result.alternativeConsiderations && result.alternativeConsiderations.length > 0 && (
                <div style={sectionStyle}>
                    <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#fbbf24',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <FileQuestion size={18} /> Alternative Considerations
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {result.alternativeConsiderations.map((alt, i) => (
                            <div key={i} style={{
                                padding: '1rem',
                                background: 'rgba(245, 158, 11, 0.08)',
                                borderRadius: '12px',
                                borderLeft: '3px solid #f59e0b',
                            }}>
                                <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fbbf24', margin: '0 0 0.5rem 0' }}>
                                    {alt.name}
                                </h5>
                                <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem 0' }}>
                                    {alt.reason}
                                </p>
                                {alt.differentiatingFactors && alt.differentiatingFactors.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                        {alt.differentiatingFactors.map((factor, j) => (
                                            <span key={j} style={{
                                                padding: '0.25rem 0.625rem',
                                                fontSize: '0.75rem',
                                                background: 'rgba(245, 158, 11, 0.15)',
                                                color: '#fcd34d',
                                                borderRadius: '12px',
                                            }}>
                                                {factor}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Tests */}
            {result.additionalTestsSuggested && result.additionalTestsSuggested.length > 0 && (
                <div style={sectionStyle}>
                    <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#2dd4bf',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <TestTube size={18} /> Additional Tests to Consider
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {result.additionalTestsSuggested.map((test, i) => (
                            <li key={i} style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
                                {test}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Questions to Ask */}
            {result.questionsToAsk && result.questionsToAsk.length > 0 && (
                <div style={sectionStyle}>
                    <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#a78bfa',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <HelpCircle size={18} /> Questions to Ask Your Doctor
                    </h4>
                    <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {result.questionsToAsk.map((question, i) => (
                            <li key={i} style={{
                                fontSize: '0.9rem',
                                color: '#e2e8f0',
                                marginBottom: '0.625rem',
                                paddingLeft: '0.5rem',
                            }}>
                                {question}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Disclaimer */}
            <div style={{
                padding: '1rem 1.25rem',
                background: 'rgba(100, 116, 139, 0.1)',
                borderRadius: '12px',
                borderLeft: '3px solid #64748b',
            }}>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                    ⚠️ {result.disclaimer}
                </p>
            </div>
        </div>
    );
};

export default SecondOpinionPanel;
