import React, { useState } from 'react';

const AssignmentModal = ({ onClose, onSave, initialData = null }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [maxScore, setMaxScore] = useState(initialData?.maxScore || 10);
    const isEditMode = !!initialData;
    const handleSubmit = (e) => { e.preventDefault(); if (name.trim() && maxScore > 0) { onSave({ id: initialData?.id, name, maxScore: parseInt(maxScore, 10) }); }};
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"><div className="bg-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{isEditMode ? 'แก้ไขรายการเก็บคะแนน' : 'เพิ่มรายการเก็บคะแนนใหม่'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4"><label htmlFor="assignmentName" className="block text-sm font-medium text-gray-300 mb-1">ชื่องาน</label><input type="text" id="assignmentName" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
                <div className="mb-6"><label htmlFor="maxScore" className="block text-sm font-medium text-gray-300 mb-1">คะแนนเต็ม</label><input type="number" id="maxScore" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required min="1" /></div>
                <div className="flex justify-end gap-4"><button type="button" onClick={onClose} className="py-2 px-4 text-gray-300 hover:text-white">ยกเลิก</button><button type="submit" className="py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors">{isEditMode ? 'บันทึกการแก้ไข' : 'สร้างรายการ'}</button></div>
            </form>
        </div></div>
    );
};

export default AssignmentModal;
