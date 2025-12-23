import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info, Stethoscope, Activity } from 'lucide-react';
import type { PossibleCondition } from '../types';

interface DiagnosisCardProps {
    condition: PossibleCondition;
    index: number;
}

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ condition, index }) => {
    const [isExpanded, setIsExpanded] = useState(index === 0);

    const getLikelihoodStyles = (likelihood: string) => {
        switch (likelihood) {
            case 'High':
                return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#f87171', icon: AlertCircle };
            case 'Moderate':
                return { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fbbf24', icon: Info };
            case 'Low':
                return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399', icon: CheckCircle };
            default:
                return { bg: 'rgba(100, 116, 139, 0.15)', border: '#64748b', text: '#94a3b8', icon: Info };
        }
    };

    const styles = getLikelihoodStyles(condition.likelihood);
    const IconComponent = styles.icon;

    return (
        <div
            style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: `1px solid ${isExpanded ? styles.border : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 300ms ease',
                marginBottom: '1rem',
            }}
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: styles.bg,
                        border: `1px solid ${styles.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <IconComponent size={24} color={styles.text} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                            {condition.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <span style={{
                                padding: '0.25rem 0.625rem',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                background: styles.bg,
                                color: styles.text,
                                borderRadius: '12px',
                                textTransform: 'uppercase',
                            }}>
                                {condition.likelihood} Likelihood
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                {condition.confidenceScore}% confidence
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div style={{
                    padding: '0 1.5rem 1.5rem',
                    animation: 'slideDown 300ms ease',
                }}>
                    {/* Confidence Bar */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            marginBottom: '0.5rem',
                        }}>
                            <span>Confidence Level</span>
                            <span>{condition.confidenceScore}%</span>
                        </div>
                        <div style={{
                            height: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${condition.confidenceScore}%`,
                                height: '100%',
                                background: `linear-gradient(90deg, ${styles.border}, ${styles.text})`,
                                borderRadius: '4px',
                                transition: 'width 500ms ease',
                            }} />
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(59, 130, 246, 0.08)',
                        borderRadius: '12px',
                        marginBottom: '1rem',
                        borderLeft: '3px solid #3b82f6',
                    }}>
                        <p style={{ fontSize: '0.95rem', color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                            {condition.description}
                        </p>
                    </div>

                    {/* Common Symptoms */}
                    {condition.commonSymptoms && condition.commonSymptoms.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#cbd5e1',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <Activity size={14} /> Common Symptoms
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {condition.commonSymptoms.map((symptom, i) => (
                                    <span key={i} style={{
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '0.8rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: '#e2e8f0',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}>
                                        {symptom}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Risk Factors */}
                    {condition.riskFactors && condition.riskFactors.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#cbd5e1',
                                marginBottom: '0.5rem',
                            }}>
                                Risk Factors
                            </h4>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                {condition.riskFactors.map((factor, i) => (
                                    <li key={i} style={{ marginBottom: '0.25rem' }}>{factor}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Typical Treatments */}
                    {condition.typicalTreatments && condition.typicalTreatments.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#cbd5e1',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <Stethoscope size={14} /> Typical Treatments
                            </h4>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                {condition.typicalTreatments.map((treatment, i) => (
                                    <li key={i} style={{ marginBottom: '0.25rem' }}>{treatment}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* When to Seek Care */}
                    {condition.whenToSeek && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '12px',
                            borderLeft: '3px solid #ef4444',
                        }}>
                            <h4 style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: '#f87171',
                                marginBottom: '0.375rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <AlertCircle size={14} /> When to Seek Immediate Care
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#fecaca', margin: 0 }}>
                                {condition.whenToSeek}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DiagnosisCard;
