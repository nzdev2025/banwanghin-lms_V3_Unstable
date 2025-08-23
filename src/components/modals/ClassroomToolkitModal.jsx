// src/components/modals/ClassroomToolkitModal.jsx (The Corrected Final Version)
import React from 'react';
import Icon from '../../icons/Icon';
import StudentPicker from '../classroom_tools/StudentPicker';
import GroupGenerator from '../classroom_tools/GroupGenerator';
import ClassroomTimer from '../classroom_tools/ClassroomTimer';

const ClassroomToolkitModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = React.useState('picker');

    // --- REMOVED 'attendance' TAB ---
    const tabs = [
        { id: 'picker', label: 'สุ่มชื่อนักเรียน', icon: 'Shuffle' },
        { id: 'grouper', label: 'จัดกลุ่ม', icon: 'UsersRound' },
        { id: 'timer', label: 'นาฬิกาจับเวลา', icon: 'Timer' },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-amber-500/50 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Icon name="BrainCircuit" className="text-amber-300" />
                        <h2 className="text-2xl font-bold text-white">Classroom Engagement Toolkit</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="X" size={28} /></button>
                </header>
                
                <div className="p-4 border-b border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                            >
                                <Icon name={tab.icon} size={16}/>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-grow p-6 overflow-auto">
                    {/* --- REMOVED 'attendance' COMPONENT --- */}
                    {activeTab === 'picker' && <StudentPicker />}
                    {activeTab === 'grouper' && <GroupGenerator />}
                    {activeTab === 'timer' && <ClassroomTimer />}
                </div>
            </div>
        </div>
    );
};

export default ClassroomToolkitModal;