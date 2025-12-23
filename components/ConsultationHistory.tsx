import React, { useState } from 'react';
import { Clock, FileText, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';
import type { ConsultationSession, Urgency } from '../types';

interface ConsultationHistoryProps {
    consultations: ConsultationSession[];
    onDelete: (id: string) => void;
    onView: (consultation: ConsultationSession) => void;
}

const ConsultationHistory: React.FC<ConsultationHistoryProps> = ({ consultations, onDelete, onView }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const getUrgencyColor = (urgency: Urgency) => {
        switch (urgency) {
            case 'Emergency': return '#ef4444';
            case 'High': return '#f97316';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#64748b';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (consultations.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
                <FileText size={48} color="#475569" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    No Consultations Yet
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    Your consultation history will appear here after your first AI analysis.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#e2e8f0',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}>
                <Clock size={20} color="#60a5fa" />
                Consultation History
                <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#94a3b8',
                    background: 'rgba(100, 116, 139, 0.2)',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '12px',
                }}>
                    {consultations.length}
                </span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {consultations.map(consultation => {
                    const isExpanded = expandedId === consultation.id;
                    const urgency = consultation.diagnosis?.urgencyLevel;
                    const urgencyColor = getUrgencyColor(urgency || 'Low');

                    return (
                        <div
                            key={consultation.id}
                            style={{
                                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
                                border: `1px solid ${isExpanded ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'all 150ms ease',
                            }}
                        >
                            {/* Header */}
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : consultation.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '1rem 1.25rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: `${urgencyColor}20`,
                                        border: `1px solid ${urgencyColor}40`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {urgency === 'Low' ? (
                                            <CheckCircle size={20} color={urgencyColor} />
                                        ) : (
                                            <AlertCircle size={20} color={urgencyColor} />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f8fafc' }}>
                                            {consultation.symptoms.map(s => s.name).join(', ') || 'Consultation'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                                            {formatDate(consultation.startTime)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {urgency && (
                                        <span style={{
                                            padding: '0.25rem 0.625rem',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            color: urgencyColor,
                                            background: `${urgencyColor}15`,
                                            borderRadius: '12px',
                                            textTransform: 'uppercase',
                                        }}>
                                            {urgency}
                                        </span>
                                    )}
                                    {isExpanded ? (
                                        <ChevronUp size={18} color="#94a3b8" />
                                    ) : (
                                        <ChevronDown size={18} color="#94a3b8" />
                                    )}
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div style={{
                                    padding: '0 1.25rem 1.25rem',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                }}>
                                    {/* Symptoms */}
                                    <div style={{ marginTop: '1rem' }}>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                                            SYMPTOMS
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                            {consultation.symptoms.map((symptom, i) => (
                                                <span key={i} style={{
                                                    padding: '0.375rem 0.75rem',
                                                    fontSize: '0.8rem',
                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                    color: '#93c5fd',
                                                    borderRadius: '16px',
                                                }}>
                                                    {symptom.name} ({symptom.severity})
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Possible Conditions */}
                                    {consultation.diagnosis?.possibleConditions && consultation.diagnosis.possibleConditions.length > 0 && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                                                POSSIBLE CONDITIONS
                                            </h4>
                                            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                                                {consultation.diagnosis.possibleConditions.slice(0, 3).map((condition, i) => (
                                                    <li key={i} style={{ marginBottom: '0.25rem' }}>
                                                        {condition.name}
                                                        <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>
                                                            ({condition.confidenceScore}% confidence)
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        marginTop: '1.25rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}>
                                        <button
                                            onClick={() => onView(consultation)}
                                            style={{
                                                flex: 1,
                                                padding: '0.625rem 1rem',
                                                fontSize: '0.85rem',
                                                fontWeight: 500,
                                                color: '#60a5fa',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this consultation?')) {
                                                    onDelete(consultation.id);
                                                }
                                            }}
                                            style={{
                                                padding: '0.625rem 1rem',
                                                fontSize: '0.85rem',
                                                fontWeight: 500,
                                                color: '#f87171',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConsultationHistory;
