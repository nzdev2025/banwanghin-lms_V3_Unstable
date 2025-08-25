// src/components/analytics/KeyMetricCard.jsx (The "Luxe" Version)
import React from 'react';
import Icon from '../../icons/Icon';

const KeyMetricCard = ({ icon, title, value, isLoading, theme }) => {
    return (
        <div className={`relative p-6 rounded-2xl backdrop-blur-lg shadow-lg flex items-center gap-6 overflow-hidden ${theme.bg} ${theme.border}`}>
            {/* Decorative background element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-15">
                <Icon name={icon} className={`w-full h-full ${theme.text}`} />
            </div>

            <div className={`p-4 rounded-lg bg-white/10 z-10`}>
                <Icon name={icon} size={32} className={theme.text} />
            </div>
            <div className="z-10">
                <p className="text-sm text-gray-400">{title}</p>
                {isLoading ? (
                     <div className="h-8 w-24 bg-gray-700/50 rounded-md animate-pulse mt-1"></div>
                ) : (
                    <p className="text-3xl font-bold text-white">{value}</p>
                )}
            </div>
        </div>
    );
};

export default KeyMetricCard;