// src/components/shared/AttendanceCard.jsx
import React from 'react';
import Icon from '../../icons/Icon';

const AttendanceCard = ({ onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className="flex flex-col backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg bg-lime-500/10 border-lime-500/30 hover:shadow-lime-500/20"
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white truncate">เช็คชื่อนักเรียน</h3>
                        <p className="text-sm text-gray-400">บันทึกการเข้าเรียนรายวัน</p>
                    </div>
                    <div className="p-3 rounded-lg">
                        <Icon name="CheckSquare" className="text-lime-300" size={24} />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-lime-200 bg-lime-500/20 py-2 px-4 rounded-lg">
                <Icon name="Bell" size={16} className="mr-2"/>
                <span>พร้อมแจ้งเตือน LINE</span>
            </div>
        </div>
    );
};

export default AttendanceCard;