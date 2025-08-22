// src/components/modals/SubjectSelectionView.jsx

import React from 'react';
import Icon from '../../icons/Icon';
import ClassCard from '../shared/ClassCard';

const SubjectSelectionView = ({ subjects, onSubjectClick, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col p-4 sm:p-6 md:p-8">
            <header className="flex items-center justify-between mb-8 flex-shrink-0">
                <h1 className="text-3xl md:text-4xl font-bold text-white">เลือรายวิชา</h1>
                <button 
                    onClick={onClose} 
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                    <Icon name="ArrowLeft" size={16} />
                    กลับหน้าหลัก
                </button>
            </header>
            <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subjects.map((subject) => (
                        <ClassCard key={subject.id} subject={subject} onClick={() => onSubjectClick(subject)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubjectSelectionView;