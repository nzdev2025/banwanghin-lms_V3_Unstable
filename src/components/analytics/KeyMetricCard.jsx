import React from 'react';
import Icon from '../../icons/Icon';

const KeyMetricCard = ({ icon, title, value, isLoading, theme }) => {
    return (
        <div className={`p-6 rounded-2xl backdrop-blur-lg shadow-lg flex items-center gap-6 ${theme.bg} ${theme.border}`}>
            <div className={`p-4 rounded-lg bg-white/10`}>
                <Icon name={icon} size={32} className={theme.text} />
            </div>
            <div>
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
