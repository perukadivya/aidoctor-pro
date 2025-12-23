import React, { useState } from 'react';
import {
    Scale, Target, TrendingDown, TrendingUp, Minus, Sparkles, Loader2,
    Plus, X, Apple, Clock
} from 'lucide-react';
import PatientProfileForm from './PatientProfileForm';
import DietPlanView from './DietPlanView';
import { generateDietPlan } from '../services/geminiService';
import type { PatientProfile, WeightGoal, DietPlanRequest, DietPlanResult } from '../types';

interface DietPlanFormProps {
    profile: PatientProfile | null;
    onSaveProfile: (profile: PatientProfile) => void;
}

const DietPlanForm: React.FC<DietPlanFormProps> = ({ profile, onSaveProfile }) => {
    const [goal, setGoal] = useState<WeightGoal>('lose');
    const [targetWeight, setTargetWeight] = useState<number>(profile?.weight || 70);
    const [timeframe, setTimeframe] = useState<string>('3 months');
    const [mealsPerDay, setMealsPerDay] = useState<number>(3);
    const [restrictions, setRestrictions] = useState<string[]>([]);
    const [preferences, setPreferences] = useState<string[]>([]);
    const [newRestriction, setNewRestriction] = useState('');
    const [newPreference, setNewPreference] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DietPlanResult | null>(null);

    const commonRestrictions = [
        'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
        'Nut-Free', 'Low-Sodium', 'Halal', 'Kosher'
    ];

    const commonPreferences = [
        'Indian', 'Mediterranean', 'Asian', 'Mexican',
        'High Protein', 'Low Carb', 'Home Cooking', 'Quick Meals'
    ];

    const handleGenerate = async () => {
        if (!profile) {
            setError('Please complete your health profile first');
            return;
        }

        setError(null);
        setIsGenerating(true);

        const request: DietPlanRequest = {
            goal,
            targetWeight,
            timeframe,
            dietaryRestrictions: restrictions,
            foodPreferences: preferences,
            mealsPerDay,
        };

        try {
            const dietPlan = await generateDietPlan(profile, request);
            setResult(dietPlan);
        } catch (e: any) {
            setError(e.message || 'Failed to generate diet plan. Please check your API key.');
        } finally {
            setIsGenerating(false);
        }
    };

    const addRestriction = (r: string) => {
        if (r && !restrictions.includes(r)) {
            setRestrictions([...restrictions, r]);
        }
        setNewRestriction('');
    };

    const addPreference = (p: string) => {
        if (p && !preferences.includes(p)) {
            setPreferences([...preferences, p]);
        }
        setNewPreference('');
    };

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
                        <Apple size={32} style={{ display: 'inline', marginRight: '0.75rem', color: '#10b981' }} />
                        AI Diet Plan Generator
                    </h2>
                    <p style={{ color: '#94a3b8' }}>
                        Get a personalized weekly meal plan based on your weight goals and preferences.
                    </p>
                </div>

                {/* Profile */}
                <PatientProfileForm profile={profile} onSave={onSaveProfile} collapsed={!!profile} />

                {!result && (
                    <>
                        {/* Goal Selection */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
                                <Target size={20} style={{ display: 'inline', marginRight: '0.5rem', color: '#60a5fa' }} />
                                Your Goal
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {[
                                    { value: 'lose' as WeightGoal, label: 'Lose Weight', icon: TrendingDown, color: '#10b981' },
                                    { value: 'maintain' as WeightGoal, label: 'Maintain', icon: Minus, color: '#f59e0b' },
                                    { value: 'gain' as WeightGoal, label: 'Gain Weight', icon: TrendingUp, color: '#3b82f6' },
                                ].map((g) => (
                                    <button
                                        key={g.value}
                                        onClick={() => setGoal(g.value)}
                                        style={{
                                            padding: '1.25rem 1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: goal === g.value ? `${g.color}20` : 'rgba(255, 255, 255, 0.03)',
                                            border: `2px solid ${goal === g.value ? g.color : 'rgba(255, 255, 255, 0.1)'}`,
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 150ms ease',
                                        }}
                                    >
                                        <g.icon size={24} color={goal === g.value ? g.color : '#94a3b8'} />
                                        <span style={{
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            color: goal === g.value ? g.color : '#94a3b8',
                                        }}>
                                            {g.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Target Weight & Timeframe */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <div>
                                    <label className="input-label">Target Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={targetWeight}
                                        onChange={(e) => setTargetWeight(Number(e.target.value))}
                                        className="input"
                                        min="30"
                                        max="200"
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Timeframe</label>
                                    <select
                                        value={timeframe}
                                        onChange={(e) => setTimeframe(e.target.value)}
                                        className="input"
                                    >
                                        <option value="1 month">1 Month</option>
                                        <option value="2 months">2 Months</option>
                                        <option value="3 months">3 Months</option>
                                        <option value="6 months">6 Months</option>
                                        <option value="1 year">1 Year</option>
                                    </select>
                                </div>
                            </div>

                            {/* Meals per day */}
                            <div style={{ marginTop: '1rem' }}>
                                <label className="input-label">Meals per Day</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {[2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setMealsPerDay(n)}
                                            style={{
                                                padding: '0.75rem 1.25rem',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                color: mealsPerDay === n ? '#3b82f6' : '#94a3b8',
                                                background: mealsPerDay === n ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                                border: `1px solid ${mealsPerDay === n ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {n} meals
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Dietary Restrictions */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
                                Dietary Restrictions
                            </h3>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                {commonRestrictions.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => restrictions.includes(r)
                                            ? setRestrictions(restrictions.filter(x => x !== r))
                                            : addRestriction(r)
                                        }
                                        style={{
                                            padding: '0.5rem 0.875rem',
                                            fontSize: '0.85rem',
                                            color: restrictions.includes(r) ? '#f87171' : '#94a3b8',
                                            background: restrictions.includes(r) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                            border: `1px solid ${restrictions.includes(r) ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            borderRadius: '100px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={newRestriction}
                                    onChange={(e) => setNewRestriction(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addRestriction(newRestriction)}
                                    placeholder="Add custom restriction..."
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    onClick={() => addRestriction(newRestriction)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.75rem' }}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Food Preferences */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
                                Food Preferences
                            </h3>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                {commonPreferences.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => preferences.includes(p)
                                            ? setPreferences(preferences.filter(x => x !== p))
                                            : addPreference(p)
                                        }
                                        style={{
                                            padding: '0.5rem 0.875rem',
                                            fontSize: '0.85rem',
                                            color: preferences.includes(p) ? '#10b981' : '#94a3b8',
                                            background: preferences.includes(p) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                            border: `1px solid ${preferences.includes(p) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            borderRadius: '100px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={newPreference}
                                    onChange={(e) => setNewPreference(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPreference(newPreference)}
                                    placeholder="Add custom preference..."
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    onClick={() => addPreference(newPreference)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.75rem' }}
                                >
                                    <Plus size={20} />
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

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !profile}
                            className="btn btn-accent btn-lg"
                            style={{ width: '100%', marginBottom: '2rem' }}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Generating Your Diet Plan...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate AI Diet Plan
                                </>
                            )}
                        </button>
                    </>
                )}

                {/* Results */}
                {result && (
                    <div className="animate-slide-up">
                        <button
                            onClick={() => setResult(null)}
                            className="btn btn-secondary"
                            style={{ marginBottom: '1.5rem' }}
                        >
                            ← Create New Plan
                        </button>
                        <DietPlanView result={result} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default DietPlanForm;
