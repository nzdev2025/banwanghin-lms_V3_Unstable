// src/components/analytics/KeyMetricCard.jsx (The "Ultimate Alignment" Version)
import React from 'react';
import Icon from '../../icons/Icon';

const KeyMetricCard = ({ icon, title, value, isLoading, theme, valueAlign = 'right' }) => { // <-- [1] เพิ่ม prop 'valueAlign' พร้อมค่า default เป็น 'right'
    return (
        <div className={`relative p-6 rounded-2xl backdrop-blur-lg shadow-lg flex flex-col justify-between h-full overflow-hidden ${theme.bg} ${theme.border}`}>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-15">
                <Icon name={icon} className={`w-full h-full ${theme.text}`} />
            </div>

            <div className="flex items-center gap-3 z-10">
                <div className={`p-2 rounded-lg bg-white/10 flex-shrink-0`}>
                    <Icon name={icon} size={20} className={theme.text} />
                </div>
                <p className="text-sm text-gray-400 font-medium">{title}</p>
            </div>
            
            {/* --- [2] ใช้ prop เพื่อกำหนด class การจัดวางข้อความแบบไดนามิก --- */}
            <div className={`z-10 mt-4 ${valueAlign === 'center' ? 'text-center' : 'text-right'}`}>
                {isLoading ? (
                     // --- ปรับให้ Skeleton ขณะโหลดข้อมูล จัดวางได้ถูกต้องตาม prop ด้วย ---
                     <div className={`h-9 w-24 bg-gray-700/50 rounded-md animate-pulse ${valueAlign === 'center' ? 'mx-auto' : 'ml-auto'}`}></div>
                ) : (
                    <p className="text-4xl font-bold text-white">{value}</p>
                )}
            </div>
        </div>
    );
};

export default KeyMetricCard;