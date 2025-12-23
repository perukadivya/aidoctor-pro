import React, { useState } from 'react';
import { Plus, Trash2, ThermometerSun, Clock, MapPin } from 'lucide-react';
import type { Symptom, Severity } from '../types';

interface SymptomInputProps {
    symptoms: Symptom[];
    onChange: (symptoms: Symptom[]) => void;
}

const SEVERITY_OPTIONS: Severity[] = ['Mild', 'Moderate', 'Severe', 'Critical'];

const COMMON_SYMPTOMS = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
    'Chest Pain', 'Shortness of Breath', 'Back Pain', 'Joint Pain',
    'Stomach Ache', 'Sore Throat', 'Muscle Ache', 'Skin Rash'
];

const BODY_LOCATIONS = [
    'Head', 'Neck', 'Chest', 'Stomach', 'Back', 'Arms', 'Legs',
    'Joints', 'Throat', 'Eyes', 'Ears', 'Whole Body'
];

const SymptomInput: React.FC<SymptomInputProps> = ({ symptoms, onChange }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeInput, setActiveInput] = useState<string | null>(null);

    const addSymptom = () => {
        const newSymptom: Symptom = {
            id: crypto.randomUUID(),
            name: '',
            duration: '',
            severity: 'Moderate',
            location: '',
            description: '',
        };
        onChange([...symptoms, newSymptom]);
    };

    const updateSymptom = (id: string, field: keyof Symptom, value: string) => {
        onChange(symptoms.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeSymptom = (id: string) => {
        onChange(symptoms.filter(s => s.id !== id));
    };

    const addQuickSymptom = (name: string) => {
        const newSymptom: Symptom = {
            id: crypto.randomUUID(),
            name,
            duration: '',
            severity: 'Moderate',
            location: '',
            description: '',
        };
        onChange([...symptoms, newSymptom]);
        setShowSuggestions(false);
    };

    const cardStyle: React.CSSProperties = {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1rem',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.625rem 0.875rem',
        fontSize: '0.9rem',
        color: '#f8fafc',
        background: '#1e293b',
        border: '1px solid #475569',
        borderRadius: '8px',
        outline: 'none',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        fontWeight: 500,
        color: '#94a3b8',
        marginBottom: '0.375rem',
        display: 'block',
    };

    const getSeverityColor = (severity: Severity) => {
        switch (severity) {
            case 'Mild': return { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', text: '#34d399' };
            case 'Moderate': return { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', text: '#fbbf24' };
            case 'Severe': return { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#fb923c' };
            case 'Critical': return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#f87171' };
        }
    };

    return (
        <div>
            {/* Quick Add Suggestions */}
            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem',
                        color: '#94a3b8',
                        background: 'transparent',
                        border: '1px dashed #475569',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                    }}
                >
                    <Plus size={16} />
                    Quick add common symptom
                </button>

                {showSuggestions && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: '0.75rem',
                        padding: '1rem',
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}>
                        {COMMON_SYMPTOMS.filter(s => !symptoms.some(sym => sym.name.toLowerCase() === s.toLowerCase())).map(symptom => (
                            <button
                                key={symptom}
                                onClick={() => addQuickSymptom(symptom)}
                                style={{
                                    padding: '0.5rem 0.875rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    color: '#cbd5e1',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 150ms ease',
                                }}
                            >
                                + {symptom}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Symptoms List */}
            {symptoms.map((symptom, index) => (
                <div key={symptom.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#60a5fa' }}>
                            Symptom {index + 1}
                        </span>
                        <button
                            onClick={() => removeSymptom(symptom.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.375rem 0.75rem',
                                fontSize: '0.75rem',
                                color: '#f87171',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            <Trash2 size={14} />
                            Remove
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        {/* Symptom Name */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>
                                <ThermometerSun size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                What are you experiencing?
                            </label>
                            <input
                                type="text"
                                value={symptom.name}
                                onChange={(e) => updateSymptom(symptom.id, 'name', e.target.value)}
                                placeholder="e.g., Headache, Chest pain, Fatigue..."
                                style={inputStyle}
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label style={labelStyle}>
                                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Duration
                            </label>
                            <select
                                value={symptom.duration}
                                onChange={(e) => updateSymptom(symptom.id, 'duration', e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                                <option value="">Select duration</option>
                                <option value="Few hours">Few hours</option>
                                <option value="1 day">1 day</option>
                                <option value="2-3 days">2-3 days</option>
                                <option value="About a week">About a week</option>
                                <option value="1-2 weeks">1-2 weeks</option>
                                <option value="More than 2 weeks">More than 2 weeks</option>
                                <option value="More than a month">More than a month</option>
                            </select>
                        </div>

                        {/* Severity */}
                        <div>
                            <label style={labelStyle}>Severity</label>
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                                {SEVERITY_OPTIONS.map(sev => {
                                    const colors = getSeverityColor(sev);
                                    const isSelected = symptom.severity === sev;
                                    return (
                                        <button
                                            key={sev}
                                            onClick={() => updateSymptom(symptom.id, 'severity', sev)}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem 0.25rem',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                background: isSelected ? colors.bg : 'transparent',
                                                border: `1px solid ${isSelected ? colors.border : '#475569'}`,
                                                color: isSelected ? colors.text : '#64748b',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 150ms ease',
                                            }}
                                        >
                                            {sev}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label style={labelStyle}>
                                <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Body Location
                            </label>
                            <select
                                value={symptom.location}
                                onChange={(e) => updateSymptom(symptom.id, 'location', e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                                <option value="">Select location</option>
                                {BODY_LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Additional Details (optional)</label>
                            <textarea
                                value={symptom.description}
                                onChange={(e) => updateSymptom(symptom.id, 'description', e.target.value)}
                                placeholder="Describe when it happens, what makes it better or worse..."
                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Symptom Button */}
            <button
                onClick={addSymptom}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '1rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#60a5fa',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '2px dashed rgba(59, 130, 246, 0.4)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                }}
            >
                <Plus size={20} />
                Add Another Symptom
            </button>
        </div>
    );
};

export default SymptomInput;
