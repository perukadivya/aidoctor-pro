import React, { useState } from 'react';
import {
    Scale, Target, ChevronDown, ChevronUp, Clock, Flame,
    Apple, Droplets, ShoppingCart, Lightbulb, AlertTriangle,
    TrendingDown, TrendingUp, Minus, Check
} from 'lucide-react';
import type { DietPlanResult, DailyMealPlan, Meal, WeightGoal } from '../types';

interface DietPlanViewProps {
    result: DietPlanResult;
}

const DietPlanView: React.FC<DietPlanViewProps> = ({ result }) => {
    const [selectedDay, setSelectedDay] = useState(0);
    const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
    const [showGroceryList, setShowGroceryList] = useState(false);

    const getGoalIcon = (goal: WeightGoal) => {
        switch (goal) {
            case 'lose': return <TrendingDown size={20} color="#10b981" />;
            case 'gain': return <TrendingUp size={20} color="#3b82f6" />;
            case 'maintain': return <Minus size={20} color="#f59e0b" />;
        }
    };

    const getGoalColor = (goal: WeightGoal) => {
        switch (goal) {
            case 'lose': return '#10b981';
            case 'gain': return '#3b82f6';
            case 'maintain': return '#f59e0b';
        }
    };

    const cardStyle: React.CSSProperties = {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    const goalColor = getGoalColor(result.goal);
    const currentDay = result.weeklyPlan[selectedDay];

    return (
        <div className="animate-fade-in">
            {/* Summary Card */}
            <div style={{
                ...cardStyle,
                background: `linear-gradient(135deg, ${goalColor}15 0%, rgba(15, 23, 42, 0.9) 100%)`,
                borderColor: `${goalColor}40`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: `${goalColor}20`,
                        border: `1px solid ${goalColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Scale size={28} color={goalColor} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                            Your Personalized Diet Plan
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                            {getGoalIcon(result.goal)}
                            <span style={{ fontSize: '0.9rem', color: goalColor, fontWeight: 500 }}>
                                {result.goal === 'lose' ? 'Weight Loss' : result.goal === 'gain' ? 'Weight Gain' : 'Weight Maintenance'} Plan
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Current Weight</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                            {result.currentWeight} <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>kg</span>
                        </p>
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Target Weight</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: goalColor, margin: 0 }}>
                            {result.targetWeight} <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>kg</span>
                        </p>
                    </div>
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Daily Calories</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                            {result.dailyCalorieTarget} <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>kcal</span>
                        </p>
                    </div>
                </div>

                {/* Macro Breakdown */}
                <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Macro Breakdown</p>
                    <div style={{ display: 'flex', gap: '0.5rem', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${result.macroBreakdown.protein}%`, background: '#3b82f6' }} />
                        <div style={{ width: `${result.macroBreakdown.carbs}%`, background: '#10b981' }} />
                        <div style={{ width: `${result.macroBreakdown.fats}%`, background: '#f59e0b' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Protein {result.macroBreakdown.protein}%</span>
                        <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Carbs {result.macroBreakdown.carbs}%</span>
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Fats {result.macroBreakdown.fats}%</span>
                    </div>
                </div>
            </div>

            {/* Day Selector */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
            }}>
                {result.weeklyPlan.map((day, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        style={{
                            padding: '0.75rem 1.25rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: selectedDay === i ? 'white' : '#94a3b8',
                            background: selectedDay === i ? goalColor : 'rgba(30, 41, 59, 0.8)',
                            border: `1px solid ${selectedDay === i ? goalColor : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '100px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 150ms ease',
                        }}
                    >
                        {day.day}
                    </button>
                ))}
            </div>

            {/* Daily Meal Plan */}
            {currentDay && (
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                            {currentDay.day}'s Meals
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                <Flame size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                {currentDay.totalCalories} kcal
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>
                                <Droplets size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                {currentDay.waterIntake}
                            </span>
                        </div>
                    </div>

                    {/* Meals */}
                    {currentDay.meals.map((meal, i) => (
                        <MealCard
                            key={i}
                            meal={meal}
                            isExpanded={expandedMeal === `${selectedDay}-${i}`}
                            onToggle={() => setExpandedMeal(expandedMeal === `${selectedDay}-${i}` ? null : `${selectedDay}-${i}`)}
                        />
                    ))}

                    {/* Snacks */}
                    {currentDay.snacks.length > 0 && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                        }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                                🍎 Snack Options
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {currentDay.snacks.map((snack, i) => (
                                    <span key={i} style={{
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '0.8rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: '#34d399',
                                        borderRadius: '16px',
                                    }}>
                                        {snack}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Grocery List */}
            <div style={cardStyle}>
                <button
                    onClick={() => setShowGroceryList(!showGroceryList)}
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
                        <ShoppingCart size={20} color="#f59e0b" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                            Weekly Grocery List
                        </h3>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#fbbf24',
                            borderRadius: '8px',
                        }}>
                            {result.groceryList.length} items
                        </span>
                    </div>
                    {showGroceryList ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>

                {showGroceryList && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '0.5rem',
                        marginTop: '1rem',
                    }}>
                        {result.groceryList.map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                color: '#e2e8f0',
                            }}>
                                <Check size={14} color="#10b981" />
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tips */}
            {result.tips.length > 0 && (
                <div style={cardStyle}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#60a5fa',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <Lightbulb size={18} /> Success Tips
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#e2e8f0' }}>
                        {result.tips.map((tip, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
                <div style={{
                    ...cardStyle,
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                }}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#f87171',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <AlertTriangle size={18} /> Important Warnings
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#fecaca' }}>
                        {result.warnings.map((warning, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Progress Milestones */}
            {result.progressMilestones && result.progressMilestones.length > 0 && (
                <div style={cardStyle}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#2dd4bf',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <Target size={18} /> Progress Milestones
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {result.progressMilestones.map((milestone, i) => (
                            <div key={i} style={{
                                padding: '0.75rem 1rem',
                                background: 'rgba(45, 212, 191, 0.1)',
                                border: '1px solid rgba(45, 212, 191, 0.3)',
                                borderRadius: '12px',
                                textAlign: 'center',
                            }}>
                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>Week {milestone.week}</p>
                                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2dd4bf', margin: '0.25rem 0 0' }}>
                                    {milestone.expectedWeight} kg
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div style={{
                padding: '1rem',
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

// Meal Card Component
const MealCard: React.FC<{
    meal: Meal;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ meal, isExpanded, onToggle }) => {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            marginBottom: '0.75rem',
            overflow: 'hidden',
        }}>
            <button
                onClick={onToggle}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Apple size={20} color="#60a5fa" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                            {meal.name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {meal.time}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                            {meal.calories} kcal
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
                            P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                        </p>
                    </div>
                    {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                </div>
            </button>

            {isExpanded && (
                <div style={{
                    padding: '0 1rem 1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                    <div style={{ marginTop: '1rem' }}>
                        <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                            Ingredients
                        </h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                            {meal.ingredients.map((ing, i) => (
                                <span key={i} style={{
                                    padding: '0.25rem 0.625rem',
                                    fontSize: '0.75rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#93c5fd',
                                    borderRadius: '12px',
                                }}>
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                            Instructions
                        </h5>
                        <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                            {meal.instructions}
                        </p>
                    </div>

                    {meal.alternatives && meal.alternatives.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                                Alternatives
                            </h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                {meal.alternatives.map((alt, i) => (
                                    <span key={i} style={{
                                        padding: '0.25rem 0.625rem',
                                        fontSize: '0.75rem',
                                        background: 'rgba(245, 158, 11, 0.1)',
                                        color: '#fcd34d',
                                        borderRadius: '12px',
                                    }}>
                                        {alt}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DietPlanView;
