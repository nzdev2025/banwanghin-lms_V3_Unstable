// src/components/shared/Pp5Card.jsx
import React from 'react';
import Icon from '../../icons/Icon';
import { colorThemes } from '../../constants/theme';

const Pp5Card = ({ onClick }) => {
    const theme = colorThemes.blue; // A new color theme might be needed

    return (
        <div
            onClick={onClick}
            className={`relative flex flex-col backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg overflow-hidden bg-blue-500/10 border-blue-500/30 shadow-glow-blue`}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="FileSpreadsheet" className={`w-32 h-32 text-blue-300 opacity-10`} />
            </div>

            <div className="flex-grow z-10">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white truncate">สร้างเอกสาร ปพ.5</h3>
                        <p className="text-sm text-gray-400">ส่งออกข้อมูลไปยัง Google Sheets</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                        <Icon name="FileSpreadsheet" className="text-blue-300" size={24} />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-blue-200 bg-blue-500/20 py-2 px-4 rounded-lg z-10">
                <Icon name="Download" size={16} className="mr-2"/>
                <span>ส่งออกข้อมูล</span>
            </div>
        </div>
    );
};

export default Pp5Card;