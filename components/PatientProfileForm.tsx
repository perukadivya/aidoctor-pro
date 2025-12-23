import React, { useState, useEffect } from 'react';
import { User, Heart, Pill, AlertTriangle, Activity, Save, ChevronDown, ChevronUp } from 'lucide-react';
import type { PatientProfile, MedicalCondition, Gender } from '../types';

interface PatientProfileFormProps {
    profile: PatientProfile | null;
    onSave: (profile: PatientProfile) => void;
    collapsed?: boolean;
}

const CONDITIONS: MedicalCondition[] = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'COPD',
    'Kidney Disease', 'Liver Disease', 'Thyroid Disorder', 'Arthritis',
    'Depression', 'Anxiety', 'Migraine', 'Epilepsy', 'Cancer', 'None'
];

const GENDERS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

const PatientProfileForm: React.FC<PatientProfileFormProps> = ({ profile, onSave, collapsed = true }) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const [formData, setFormData] = useState<Partial<PatientProfile>>({
        age: profile?.age || 30,
        gender: profile?.gender || 'Prefer not to say',
        weight: profile?.weight || 70,
        height: profile?.height || 170,
        conditions: profile?.conditions || [],
        medications: profile?.medications || [],
        allergies: profile?.allergies || [],
        familyHistory: profile?.familyHistory || [],
        lifestyle: profile?.lifestyle || { smoking: false, alcohol: false, exercise: 'Light' },
    });

    const [newMedication, setNewMedication] = useState('');
    const [newAllergy, setNewAllergy] = useState('');
    const [newFamilyHistory, setNewFamilyHistory] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                age: profile.age,
                gender: profile.gender,
                weight: profile.weight,
                height: profile.height,
                conditions: profile.conditions,
                medications: profile.medications,
                allergies: profile.allergies,
                familyHistory: profile.familyHistory,
                lifestyle: profile.lifestyle,
            });
        }
    }, [profile]);

    const handleSave = () => {
        const newProfile: PatientProfile = {
            id: profile?.id || crypto.randomUUID(),
            age: formData.age || 30,
            gender: formData.gender || 'Prefer not to say',
            weight: formData.weight || 70,
            height: formData.height || 170,
            conditions: formData.conditions || [],
            medications: formData.medications || [],
            allergies: formData.allergies || [],
            familyHistory: formData.familyHistory || [],
            lifestyle: formData.lifestyle || { smoking: false, alcohol: false, exercise: 'Light' },
            lastUpdated: new Date().toISOString(),
        };
        onSave(newProfile);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleCondition = (condition: MedicalCondition) => {
        const current = formData.conditions || [];
        if (condition === 'None') {
            setFormData({ ...formData, conditions: ['None'] });
        } else {
            const filtered = current.filter(c => c !== 'None');
            if (filtered.includes(condition)) {
                setFormData({ ...formData, conditions: filtered.filter(c => c !== condition) });
            } else {
                setFormData({ ...formData, conditions: [...filtered, condition] });
            }
        }
    };

    const addItem = (field: 'medications' | 'allergies' | 'familyHistory', value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        const current = formData[field] || [];
        setFormData({ ...formData, [field]: [...current, value.trim()] });
        setter('');
    };

    const removeItem = (field: 'medications' | 'allergies' | 'familyHistory', index: number) => {
        const current = formData[field] || [];
        setFormData({ ...formData, [field]: current.filter((_, i) => i !== index) });
    };

    const cardStyle: React.CSSProperties = {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#cbd5e1',
        marginBottom: '0.5rem',
        display: 'block',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        color: '#f8fafc',
        background: '#1e293b',
        border: '1px solid #475569',
        borderRadius: '8px',
        outline: 'none',
    };

    return (
        <div style={cardStyle}>
            {/* Header */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <User size={20} color="white" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                            Health Profile
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                            {profile ? 'Last updated: ' + new Date(profile.lastUpdated).toLocaleDateString() : 'Create your profile for personalized analysis'}
                        </p>
                    </div>
                </div>
                {isCollapsed ? <ChevronDown size={20} color="#94a3b8" /> : <ChevronUp size={20} color="#94a3b8" />}
            </button>

            {/* Form Content */}
            {!isCollapsed && (
                <div style={{ marginTop: '1.5rem' }}>
                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={labelStyle}>Age</label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                                style={inputStyle}
                                min={1}
                                max={120}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Weight (kg)</label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                                style={inputStyle}
                                min={1}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Height (cm)</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                                style={inputStyle}
                                min={1}
                            />
                        </div>
                    </div>

                    {/* Conditions */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Heart size={16} /> Existing Conditions
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {CONDITIONS.map(condition => (
                                <button
                                    key={condition}
                                    onClick={() => toggleCondition(condition)}
                                    style={{
                                        padding: '0.5rem 0.875rem',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        borderRadius: '20px',
                                        border: '1px solid',
                                        cursor: 'pointer',
                                        transition: 'all 150ms ease',
                                        background: formData.conditions?.includes(condition) ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                        borderColor: formData.conditions?.includes(condition) ? '#3b82f6' : '#475569',
                                        color: formData.conditions?.includes(condition) ? '#60a5fa' : '#94a3b8',
                                    }}
                                >
                                    {condition}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Medications */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Pill size={16} /> Current Medications
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={newMedication}
                                onChange={(e) => setNewMedication(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addItem('medications', newMedication, setNewMedication)}
                                placeholder="Add medication..."
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button
                                onClick={() => addItem('medications', newMedication, setNewMedication)}
                                className="btn btn-secondary btn-sm"
                            >
                                Add
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {formData.medications?.map((med, i) => (
                                <span key={i} style={{
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '0.8rem',
                                    background: 'rgba(20, 184, 166, 0.15)',
                                    color: '#5eead4',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}>
                                    {med}
                                    <button onClick={() => removeItem('medications', i)} style={{ background: 'none', border: 'none', color: '#5eead4', cursor: 'pointer', padding: 0 }}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertTriangle size={16} /> Known Allergies
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={newAllergy}
                                onChange={(e) => setNewAllergy(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addItem('allergies', newAllergy, setNewAllergy)}
                                placeholder="Add allergy..."
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button
                                onClick={() => addItem('allergies', newAllergy, setNewAllergy)}
                                className="btn btn-secondary btn-sm"
                            >
                                Add
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {formData.allergies?.map((allergy, i) => (
                                <span key={i} style={{
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '0.8rem',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    color: '#fca5a5',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}>
                                    {allergy}
                                    <button onClick={() => removeItem('allergies', i)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: 0 }}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Lifestyle */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={16} /> Lifestyle
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#cbd5e1' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.lifestyle?.smoking}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        lifestyle: { ...formData.lifestyle!, smoking: e.target.checked }
                                    })}
                                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                                />
                                Smoker
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#cbd5e1' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.lifestyle?.alcohol}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        lifestyle: { ...formData.lifestyle!, alcohol: e.target.checked }
                                    })}
                                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                                />
                                Drinks Alcohol
                            </label>
                            <select
                                value={formData.lifestyle?.exercise}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    lifestyle: { ...formData.lifestyle!, exercise: e.target.value as any }
                                })}
                                style={{ ...inputStyle, width: 'auto', minWidth: '150px' }}
                            >
                                <option value="Sedentary">Sedentary</option>
                                <option value="Light">Light Activity</option>
                                <option value="Moderate">Moderate Activity</option>
                                <option value="Active">Very Active</option>
                            </select>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                        <Save size={18} />
                        {saved ? 'Profile Saved!' : 'Save Profile'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PatientProfileForm;
