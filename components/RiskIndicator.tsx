import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Phone } from 'lucide-react';
import type { Urgency } from '../types';

interface RiskIndicatorProps {
    urgency: Urgency;
    recommendations?: string[];
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ urgency, recommendations = [] }) => {
    const getUrgencyConfig = (level: Urgency) => {
        switch (level) {
            case 'Emergency':
                return {
                    icon: Phone,
                    color: '#ef4444',
                    bgColor: 'rgba(239, 68, 68, 0.15)',
                    borderColor: '#ef4444',
                    title: 'Emergency - Seek Care Now',
                    description: 'These symptoms may require immediate medical attention. Please call emergency services or go to the nearest emergency room.',
                    pulseAnimation: true,
                };
            case 'High':
                return {
                    icon: AlertTriangle,
                    color: '#f97316',
                    bgColor: 'rgba(249, 115, 22, 0.15)',
                    borderColor: '#f97316',
                    title: 'High Priority',
                    description: 'Consider seeing a doctor within 24 hours. These symptoms warrant prompt medical evaluation.',
                    pulseAnimation: false,
                };
            case 'Medium':
                return {
                    icon: AlertCircle,
                    color: '#f59e0b',
                    bgColor: 'rgba(245, 158, 11, 0.15)',
                    borderColor: '#f59e0b',
                    title: 'Moderate Priority',
                    description: 'Schedule an appointment with your doctor in the next few days if symptoms persist or worsen.',
                    pulseAnimation: false,
                };
            case 'Low':
                return {
                    icon: CheckCircle,
                    color: '#10b981',
                    bgColor: 'rgba(16, 185, 129, 0.15)',
                    borderColor: '#10b981',
                    title: 'Low Priority',
                    description: 'Monitor your symptoms. See a doctor if they persist for more than a week or get worse.',
                    pulseAnimation: false,
                };
            default:
                return {
                    icon: Info,
                    color: '#64748b',
                    bgColor: 'rgba(100, 116, 139, 0.15)',
                    borderColor: '#64748b',
                    title: 'Information',
                    description: 'Please consult with a healthcare provider for personalized advice.',
                    pulseAnimation: false,
                };
        }
    };

    const config = getUrgencyConfig(urgency);
    const IconComponent = config.icon;

    return (
        <div style={{
            background: config.bgColor,
            border: `2px solid ${config.borderColor}`,
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            animation: config.pulseAnimation ? 'pulse 2s infinite' : 'none',
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: config.bgColor,
                    border: `1px solid ${config.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <IconComponent size={28} color={config.color} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: config.color,
                        margin: '0 0 0.5rem 0',
                    }}>
                        {config.title}
                    </h3>
                    <p style={{
                        fontSize: '0.95rem',
                        color: '#e2e8f0',
                        margin: 0,
                        lineHeight: 1.6,
                    }}>
                        {config.description}
                    </p>
                </div>
            </div>

            {/* Emergency Call Button */}
            {urgency === 'Emergency' && (
                <a
                    href="tel:911"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '1rem',
                        marginTop: '1rem',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: 'white',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                    }}
                >
                    <Phone size={22} />
                    Call Emergency Services (911)
                </a>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                    <h4 style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}>
                        Recommended Actions
                    </h4>
                    <ul style={{
                        margin: 0,
                        paddingLeft: 0,
                        listStyle: 'none',
                    }}>
                        {recommendations.map((rec, i) => (
                            <li key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                padding: '0.625rem 0',
                                borderBottom: i < recommendations.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                            }}>
                                <span style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    background: config.bgColor,
                                    color: config.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}>
                                    {i + 1}
                                </span>
                                <span style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                                    {rec}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RiskIndicator;
