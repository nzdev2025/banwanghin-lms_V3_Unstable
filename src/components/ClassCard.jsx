import React from 'react';
import { User, BookOpen, Calculator, FlaskConical, Code, MessageSquare, History } from 'lucide-react';
import { colorThemes } from '../config/constants.js';

const ClassCard = ({ subject, onClick }) => {
    const theme = colorThemes[subject.colorTheme] || colorThemes.teal;
    const Icon = { BookOpen, Calculator, FlaskConical, Code, MessageSquare, History }[subject.iconName] || BookOpen;
    return (
        <div onClick={onClick} className={`backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg ${theme.bg} ${theme.border} ${theme.shadow}`}>
            <div className="flex justify-between items-start">
                <div className="flex-grow"><h3 className="text-xl font-bold text-white truncate">{subject.name}</h3><p className="text-sm text-gray-400">{subject.gradeRange}</p></div>
                <div className={`p-3 rounded-lg bg-white/5`}><Icon className={theme.text} size={24} /></div>
            </div>
            <div className="mt-6 flex items-center text-sm text-gray-300"><User size={16} className="mr-2"/><span>{subject.teacherName || 'ยังไม่ได้กำหนด'}</span></div>
        </div>
    );
};

export default ClassCard;
