import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { colorThemes } from '../../constants/theme';
import Icon from '../../icons/Icon';

const SubjectPerformanceChart = ({ data, isLoading }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/80 backdrop-blur-sm border border-white/20 p-3 rounded-lg shadow-lg">
                    <p className="font-bold text-white">{`${label}`}</p>
                    <p className="text-teal-300">{`คะแนนเฉลี่ย: ${payload[0].value.toFixed(2)}%`}</p>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
             <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px] flex items-center justify-center">
                <Icon name="Loader2" className="animate-spin text-teal-400" size={40} />
             </div>
        )
    }

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px]">
            <h3 className="text-lg font-bold text-white mb-4">ประสิทธิภาพรายวิชา (คะแนนเฉลี่ย)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 60 }}>
                    <defs>
                        {Object.keys(colorThemes).map((key) => (
                            <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorThemes[key].hex} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={colorThemes[key].hex} stopOpacity={0.2}/>
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        interval={0}
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} unit="%" />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} />
                    <Bar dataKey="average" radius={[4, 4, 0, 0]} isAnimationActive={true}>
                         {data.map((entry) => (
                            <Cell key={`cell-${entry.id}`} fill={`url(#color-${entry.colorTheme || 'teal'})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SubjectPerformanceChart;
