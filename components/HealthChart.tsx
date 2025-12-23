import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PossibleCondition } from '../types';

interface HealthChartProps {
    conditions: PossibleCondition[];
}

const HealthChart: React.FC<HealthChartProps> = ({ conditions }) => {
    if (!conditions || conditions.length === 0) return null;

    const data = conditions.map(c => ({
        name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
        fullName: c.name,
        confidence: c.confidenceScore,
        likelihood: c.likelihood,
    }));

    const getBarColor = (likelihood: string) => {
        switch (likelihood) {
            case 'High': return '#ef4444';
            case 'Moderate': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#64748b';
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: '0 0 0.25rem 0' }}>
                        {data.fullName}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                        Confidence: <span style={{ color: getBarColor(data.likelihood), fontWeight: 600 }}>{data.confidence}%</span>
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                        {data.likelihood} Likelihood
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
        }}>
            <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#e2e8f0',
                marginBottom: '1rem',
            }}>
                📊 Condition Likelihood Overview
            </h3>

            <div style={{ width: '100%', height: Math.max(200, conditions.length * 50) }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={{ stroke: '#334155' }}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={120}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                        <Bar dataKey="confidence" radius={[0, 6, 6, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.likelihood)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
                {['High', 'Moderate', 'Low'].map(level => (
                    <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px',
                            background: getBarColor(level),
                        }} />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{level}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HealthChart;
