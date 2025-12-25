import React, { useState } from 'react';
import {
    Pill, Search, Shield, Leaf, AlertTriangle, ChevronDown, ChevronUp,
    Sparkles, Loader2, DollarSign, CheckCircle, XCircle, Info, Apple
} from 'lucide-react';
import { compareDrugs } from '../services/geminiService';
import type { DrugComparisonResult, DrugAlternative, NaturalAlternative } from '../types';

const DrugComparisonForm: React.FC = () => {
    const [drugName, setDrugName] = useState('');
    const [currentMeds, setCurrentMeds] = useState<string[]>([]);
    const [conditions, setConditions] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [newMed, setNewMed] = useState('');
    const [newCondition, setNewCondition] = useState('');
    const [newAllergy, setNewAllergy] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DrugComparisonResult | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'alternatives' | 'natural'>('info');

    const handleCompare = async () => {
        if (!drugName.trim()) {
            setError('Please enter a drug name');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const comparison = await compareDrugs(drugName, currentMeds, conditions, allergies);
            setResult(comparison);
            setActiveTab('info');
        } catch (e: any) {
            setError(e.message || 'Failed to analyze drug. Please check your API key.');
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = (
        value: string,
        list: string[],
        setList: (v: string[]) => void,
        setInput: (v: string) => void
    ) => {
        if (value.trim() && !list.includes(value.trim())) {
            setList([...list, value.trim()]);
        }
        setInput('');
    };

    const removeItem = (item: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.filter(i => i !== item));
    };

    const cardStyle: React.CSSProperties = {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    const tagStyle = (color: string): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.375rem 0.75rem',
        fontSize: '0.8rem',
        background: `${color}15`,
        color: color,
        borderRadius: '100px',
        marginRight: '0.5rem',
        marginBottom: '0.5rem',
    });

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="section-header">
                    <h2>
                        <Pill size={32} style={{ display: 'inline', marginRight: '0.75rem', color: '#8b5cf6' }} />
                        Drug Comparison & Natural Alternatives
                    </h2>
                    <p style={{ color: '#94a3b8' }}>
                        Find safer drug alternatives and natural food-based replacements for your medications.
                    </p>
                </div>

                {!result && (
                    <>
                        {/* Drug Name Input */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
                                <Search size={20} style={{ display: 'inline', marginRight: '0.5rem', color: '#60a5fa' }} />
                                Enter Drug Name
                            </h3>
                            <input
                                type="text"
                                value={drugName}
                                onChange={(e) => setDrugName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                                placeholder="e.g., Ibuprofen, Metformin, Lisinopril..."
                                className="input"
                                style={{ fontSize: '1.1rem' }}
                            />
                        </div>

                        {/* Current Medications */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
                                Current Medications (Optional)
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                                List any medications you're currently taking to check for interactions.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                {currentMeds.map((med, i) => (
                                    <span key={i} style={tagStyle('#3b82f6')}>
                                        {med}
                                        <button
                                            onClick={() => removeItem(med, currentMeds, setCurrentMeds)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '0.25rem' }}
                                        >
                                            <XCircle size={14} color="#3b82f6" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={newMed}
                                    onChange={(e) => setNewMed(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem(newMed, currentMeds, setCurrentMeds, setNewMed)}
                                    placeholder="Add medication..."
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    onClick={() => addItem(newMed, currentMeds, setCurrentMeds, setNewMed)}
                                    className="btn btn-secondary"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Health Conditions */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
                                Health Conditions (Optional)
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                {conditions.map((cond, i) => (
                                    <span key={i} style={tagStyle('#10b981')}>
                                        {cond}
                                        <button
                                            onClick={() => removeItem(cond, conditions, setConditions)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '0.25rem' }}
                                        >
                                            <XCircle size={14} color="#10b981" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={newCondition}
                                    onChange={(e) => setNewCondition(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem(newCondition, conditions, setConditions, setNewCondition)}
                                    placeholder="Add condition..."
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    onClick={() => addItem(newCondition, conditions, setConditions, setNewCondition)}
                                    className="btn btn-secondary"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Allergies */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
                                Known Allergies (Optional)
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                {allergies.map((allergy, i) => (
                                    <span key={i} style={tagStyle('#f59e0b')}>
                                        {allergy}
                                        <button
                                            onClick={() => removeItem(allergy, allergies, setAllergies)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '0.25rem' }}
                                        >
                                            <XCircle size={14} color="#f59e0b" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={newAllergy}
                                    onChange={(e) => setNewAllergy(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem(newAllergy, allergies, setAllergies, setNewAllergy)}
                                    placeholder="Add allergy..."
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    onClick={() => addItem(newAllergy, allergies, setAllergies, setNewAllergy)}
                                    className="btn btn-secondary"
                                >
                                    Add
                                </button>
                            </div>
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

                        {/* Compare Button */}
                        <button
                            onClick={handleCompare}
                            disabled={isLoading || !drugName.trim()}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginBottom: '2rem' }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Analyzing Drug...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Find Safe Alternatives
                                </>
                            )}
                        </button>
                    </>
                )}

                {/* Results */}
                {result && (
                    <div className="animate-slide-up">
                        <button
                            onClick={() => { setResult(null); setDrugName(''); }}
                            className="btn btn-secondary"
                            style={{ marginBottom: '1.5rem' }}
                        >
                            ← Search Another Drug
                        </button>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingBottom: '0.5rem',
                        }}>
                            {[
                                { id: 'info' as const, label: 'Drug Info', icon: Info, color: '#3b82f6' },
                                { id: 'alternatives' as const, label: 'Safer Alternatives', icon: Shield, color: '#10b981' },
                                { id: 'natural' as const, label: 'Natural Foods', icon: Apple, color: '#f59e0b' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.25rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: activeTab === tab.id ? tab.color : '#94a3b8',
                                        background: activeTab === tab.id ? `${tab.color}15` : 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 150ms ease',
                                    }}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'info' && <DrugInfoTab drug={result.originalDrug} warnings={result.interactionWarnings} advice={result.generalAdvice} />}
                        {activeTab === 'alternatives' && <AlternativesTab alternatives={result.saferAlternatives} />}
                        {activeTab === 'natural' && <NaturalTab alternatives={result.naturalAlternatives} />}

                        {/* Disclaimer */}
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(100, 116, 139, 0.1)',
                            borderRadius: '12px',
                            borderLeft: '3px solid #64748b',
                            marginTop: '1.5rem',
                        }}>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                                ⚠️ {result.disclaimer}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// Drug Info Tab
const DrugInfoTab: React.FC<{
    drug: DrugComparisonResult['originalDrug'];
    warnings: string[];
    advice: string[];
}> = ({ drug, warnings, advice }) => {
    const cardStyle: React.CSSProperties = {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1rem',
    };

    return (
        <>
            {/* Drug Overview */}
            <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Pill size={28} color="#60a5fa" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                            {drug.name}
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                            Generic: {drug.genericName} • {drug.drugClass}
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <span style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: drug.prescription ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: drug.prescription ? '#f87171' : '#34d399',
                            borderRadius: '100px',
                        }}>
                            {drug.prescription ? '℞ Prescription' : 'OTC'}
                        </span>
                    </div>
                </div>

                {drug.averageCost && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <DollarSign size={16} />
                        Average Cost: {drug.averageCost}
                    </div>
                )}
            </div>

            {/* Common Uses */}
            <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#60a5fa', marginBottom: '0.75rem' }}>
                    Common Uses
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#e2e8f0' }}>
                    {drug.commonUses.map((use, i) => (
                        <li key={i} style={{ marginBottom: '0.375rem' }}>{use}</li>
                    ))}
                </ul>
            </div>

            {/* Side Effects */}
            <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f59e0b', marginBottom: '0.75rem' }}>
                    ⚠️ Side Effects
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {drug.sideEffects.map((effect, i) => (
                        <span key={i} style={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.8rem',
                            background: 'rgba(245, 158, 11, 0.1)',
                            color: '#fcd34d',
                            borderRadius: '100px',
                        }}>
                            {effect}
                        </span>
                    ))}
                </div>
            </div>

            {/* Warnings */}
            {drug.warnings.length > 0 && (
                <div style={{
                    ...cardStyle,
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f87171', marginBottom: '0.75rem' }}>
                        🚨 Warnings
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#fecaca' }}>
                        {drug.warnings.map((warning, i) => (
                            <li key={i} style={{ marginBottom: '0.375rem' }}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Interaction Warnings */}
            {warnings.length > 0 && (
                <div style={{
                    ...cardStyle,
                    background: 'rgba(139, 92, 246, 0.08)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#a78bfa', marginBottom: '0.75rem' }}>
                        💊 Drug Interactions
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#c4b5fd' }}>
                        {warnings.map((warning, i) => (
                            <li key={i} style={{ marginBottom: '0.375rem' }}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* General Advice */}
            {advice.length > 0 && (
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2dd4bf', marginBottom: '0.75rem' }}>
                        💡 General Advice
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#e2e8f0' }}>
                        {advice.map((tip, i) => (
                            <li key={i} style={{ marginBottom: '0.375rem' }}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

// Alternatives Tab
const AlternativesTab: React.FC<{ alternatives: DrugAlternative[] }> = ({ alternatives }) => {
    const [expanded, setExpanded] = useState<number | null>(null);

    const getSafetyColor = (rating: string) => {
        switch (rating) {
            case 'Safer': return '#10b981';
            case 'Similar': return '#f59e0b';
            case 'Use Caution': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getCostIcon = (cost: string) => {
        switch (cost) {
            case 'Cheaper': return <span style={{ color: '#10b981' }}>↓ Cheaper</span>;
            case 'More Expensive': return <span style={{ color: '#f87171' }}>↑ More Expensive</span>;
            default: return <span style={{ color: '#94a3b8' }}>~ Similar Cost</span>;
        }
    };

    if (alternatives.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '16px',
            }}>
                <Shield size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#94a3b8' }}>No Safer Alternatives Found</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    This drug may already be the safest option for its use case.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Found {alternatives.length} potential alternative(s). Always consult your doctor before switching medications.
            </p>

            {alternatives.map((alt, i) => {
                const safetyColor = getSafetyColor(alt.safetyRating);
                const isExpanded = expanded === i;

                return (
                    <div
                        key={i}
                        style={{
                            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                            border: `1px solid ${isExpanded ? safetyColor + '40' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: '16px',
                            marginBottom: '0.75rem',
                            overflow: 'hidden',
                        }}
                    >
                        <button
                            onClick={() => setExpanded(isExpanded ? null : i)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '1.25rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: `${safetyColor}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Shield size={22} color={safetyColor} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                                        {alt.name}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                                        {alt.genericName}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{
                                    padding: '0.375rem 0.875rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: `${safetyColor}15`,
                                    color: safetyColor,
                                    borderRadius: '100px',
                                }}>
                                    {alt.safetyRating}
                                </span>
                                {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                            </div>
                        </button>

                        {isExpanded && (
                            <div style={{
                                padding: '0 1.25rem 1.25rem',
                                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '1rem',
                                    marginTop: '1rem',
                                }}>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Why Recommended</p>
                                        <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>{alt.reason}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Effectiveness</p>
                                        <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>{alt.effectiveness}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Side Effect Comparison</p>
                                        <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0 }}>{alt.sideEffectComparison}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Cost</p>
                                        <p style={{ fontSize: '0.9rem', margin: 0 }}>{getCostIcon(alt.costComparison)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Natural Alternatives Tab
const NaturalTab: React.FC<{ alternatives: NaturalAlternative[] }> = ({ alternatives }) => {
    const [expanded, setExpanded] = useState<number | null>(null);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Food': return <Apple size={20} color="#10b981" />;
            case 'Herb': return <Leaf size={20} color="#22c55e" />;
            case 'Supplement': return <Pill size={20} color="#8b5cf6" />;
            case 'Lifestyle': return <CheckCircle size={20} color="#3b82f6" />;
            default: return <Leaf size={20} color="#10b981" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Food': return '#10b981';
            case 'Herb': return '#22c55e';
            case 'Supplement': return '#8b5cf6';
            case 'Lifestyle': return '#3b82f6';
            default: return '#10b981';
        }
    };

    const getEvidenceColor = (level: string) => {
        switch (level) {
            case 'Strong': return '#10b981';
            case 'Moderate': return '#f59e0b';
            case 'Limited': return '#94a3b8';
            default: return '#94a3b8';
        }
    };

    // Group by type
    const grouped = alternatives.reduce((acc, alt) => {
        if (!acc[alt.type]) acc[alt.type] = [];
        acc[alt.type].push(alt);
        return acc;
    }, {} as Record<string, NaturalAlternative[]>);

    if (alternatives.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '16px',
            }}>
                <Leaf size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#94a3b8' }}>No Natural Alternatives Found</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    This medication may not have proven natural alternatives.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Natural alternatives can complement your treatment. Never stop prescribed medications without consulting your doctor.
            </p>

            {Object.entries(grouped).map(([type, items]) => (
                <div key={type} style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: getTypeColor(type),
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        {getTypeIcon(type)} {type} Options
                    </h3>

                    {items.map((alt, i) => {
                        const globalIndex = alternatives.indexOf(alt);
                        const isExpanded = expanded === globalIndex;
                        const evidenceColor = getEvidenceColor(alt.evidenceLevel);

                        return (
                            <div
                                key={i}
                                style={{
                                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '12px',
                                    marginBottom: '0.5rem',
                                    overflow: 'hidden',
                                }}
                            >
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : globalIndex)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {getTypeIcon(type)}
                                        <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f8fafc' }}>
                                            {alt.name}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.625rem',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            background: `${evidenceColor}15`,
                                            color: evidenceColor,
                                            borderRadius: '100px',
                                        }}>
                                            {alt.evidenceLevel} Evidence
                                        </span>
                                        {isExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div style={{
                                        padding: '0 1rem 1rem',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}>
                                        {/* Benefits */}
                                        <div style={{ marginTop: '0.75rem' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Benefits</p>
                                            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#e2e8f0', fontSize: '0.85rem' }}>
                                                {alt.benefits.map((b, bi) => (
                                                    <li key={bi}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* How to Use */}
                                        <div style={{ marginTop: '0.75rem' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.375rem' }}>How to Use</p>
                                            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0 }}>{alt.howToUse}</p>
                                        </div>

                                        {/* Food Sources */}
                                        {alt.foodSources && alt.foodSources.length > 0 && (
                                            <div style={{ marginTop: '0.75rem' }}>
                                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.375rem' }}>Food Sources</p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                                    {alt.foodSources.map((food, fi) => (
                                                        <span key={fi} style={{
                                                            padding: '0.25rem 0.625rem',
                                                            fontSize: '0.75rem',
                                                            background: 'rgba(16, 185, 129, 0.1)',
                                                            color: '#34d399',
                                                            borderRadius: '100px',
                                                        }}>
                                                            {food}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Warnings */}
                                        {alt.warnings.length > 0 && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                padding: '0.625rem',
                                                background: 'rgba(245, 158, 11, 0.1)',
                                                borderRadius: '8px',
                                            }}>
                                                <p style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.25rem', fontWeight: 600 }}>
                                                    ⚠️ Warnings
                                                </p>
                                                <ul style={{ margin: 0, paddingLeft: '1rem', color: '#fcd34d', fontSize: '0.8rem' }}>
                                                    {alt.warnings.map((w, wi) => (
                                                        <li key={wi}>{w}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default DrugComparisonForm;
