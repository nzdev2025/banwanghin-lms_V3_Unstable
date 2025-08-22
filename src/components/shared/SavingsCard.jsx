// src/components/shared/SavingsCard.jsx (v2 - Flexbox Layout)

import React from 'react';
import Icon from '../../icons/Icon';

const SavingsCard = ({ onClick }) => {
    return (
        <div 
            onClick={onClick} 
            // เพิ่ม flex และ flex-col เพื่อควบคุมแนวตั้ง
            className="flex flex-col backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg bg-emerald-500/10 border-emerald-500/30 hover:shadow-emerald-500/20"
        >
            {/* ส่วนเนื้อหาหลัก เพิ่ม flex-grow เพื่อให้มันยืดขยาย ดันปุ่มไปอยู่ล่างสุด */}
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white truncate">ระบบออมทรัพย์</h3>
                        <p className="text-sm text-gray-400">บันทึกเงินออมนักเรียน</p>
                    </div>
                    <div className="p-3 rounded-lg">
                        <Icon name="PiggyBank" className="text-emerald-300" size={24} />
                    </div>
                </div>
            </div>

            {/* ส่วนปุ่ม จะถูกดันไปอยู่ล่างสุดเสมอ */}
            <div className="mt-6 flex items-center justify-center text-sm text-emerald-200 bg-emerald-500/20 py-2 px-4 rounded-lg">
                <Icon name="Wallet" size={16} className="mr-2"/>
                <span>จัดการการออม</span>
            </div>
        </div>
    );
};

export default SavingsCard;