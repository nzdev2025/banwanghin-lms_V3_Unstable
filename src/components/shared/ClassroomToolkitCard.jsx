// src/components/shared/ClassroomToolkitCard.jsx
import React from 'react';
import Icon from '../../icons/Icon';

const ClassroomToolkitCard = ({ onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className="flex flex-col backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg bg-amber-500/10 border-amber-500/30 hover:shadow-amber-500/20"
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white truncate">Classroom Toolkit</h3>
                        <p className="text-sm text-gray-400">เครื่องมือช่วยสอนในชั้นเรียน</p>
                    </div>
                    <div className="p-3 rounded-lg">
                        <Icon name="BrainCircuit" className="text-amber-300" size={24} />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-amber-200 bg-amber-500/20 py-2 px-4 rounded-lg">
                <Icon name="Sparkles" size={16} className="mr-2"/>
                <span>เปิดใช้งาน</span>
            </div>
        </div>
    );
};

export default ClassroomToolkitCard;