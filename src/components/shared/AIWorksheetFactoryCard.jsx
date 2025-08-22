// src/components/shared/AIWorksheetFactoryCard.jsx

import React from 'react';
import Icon from '../../icons/Icon';

const AIWorksheetFactoryCard = ({ onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className="flex flex-col backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg bg-purple-500/10 border-purple-500/30 hover:shadow-purple-500/20"
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white truncate">สร้างใบงาน/ข้อสอบ (AI)</h3>
                        <p className="text-sm text-gray-400">เปลี่ยนไอเดียเป็นเอกสารพร้อมพิมพ์</p>
                    </div>
                    <div className="p-3 rounded-lg">
                        <Icon name="FileText" className="text-purple-300" size={24} />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-purple-200 bg-purple-500/20 py-2 px-4 rounded-lg">
                <Icon name="Sparkles" size={16} className="mr-2"/>
                <span>ขับเคลื่อนด้วย AI</span>
            </div>
        </div>
    );
};

export default AIWorksheetFactoryCard;