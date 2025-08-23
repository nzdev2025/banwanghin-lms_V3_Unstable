// src/components/modals/BehaviorLoggerModal.jsx
import React from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, logActivity, appId } from '../../firebase/firebase';
import Icon from '../../icons/Icon';

const behaviorTags = {
    positive: [
        { label: 'มีน้ำใจ/ช่วยเหลือเพื่อน', icon: 'HeartHandshake' },
        { label: 'มีความคิดสร้างสรรค์', icon: 'Lightbulb' },
        { label: 'กล้าแสดงออก', icon: 'Sparkles' },
        { label: 'มีส่วนร่วมในชั้นเรียน', icon: 'CheckCircle2' },
    ],
    needs_attention: [
        { label: 'ไม่ส่งการบ้าน/งาน', icon: 'Clock' },
        { label: 'ไม่มีสมาธิ', icon: 'Coffee' },
        { label: 'ทะเลาะกับเพื่อน', icon: 'MessageSquareWarning' },
    ],
};

const BehaviorLoggerModal = ({ student, grade, onClose }) => {
    const [note, setNote] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSaveLog = async (type, tag) => {
        setIsSaving(true);
        try {
            const logPath = `artifacts/${appId}/public/data/rosters/${grade}/students/${student.id}/behavior_logs`;
            await addDoc(collection(db, logPath), {
                type,
                tag: tag.label,
                icon: tag.icon,
                note: note,
                timestamp: serverTimestamp()
            });
            logActivity('BEHAVIOR_LOG', `บันทึกพฤติกรรม '${tag.label}' ของ ${student.firstName}`);
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Error saving behavior log:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-amber-500/50 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">บันทึกพฤติกรรม</h3>
                    <p className="text-gray-400">สำหรับ: {student.firstName} {student.lastName}</p>
                </header>
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="font-semibold text-green-300 mb-2">พฤติกรรมเชิงบวก</h4>
                        <div className="flex flex-wrap gap-2">
                            {behaviorTags.positive.map(tag => (
                                <button key={tag.label} onClick={() => handleSaveLog('positive', tag)} disabled={isSaving} className="flex items-center gap-2 py-2 px-3 bg-green-500/10 hover:bg-green-500/20 text-green-300 rounded-lg transition-colors">
                                    <Icon name={tag.icon} size={16} /> <span>{tag.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-300 mb-2">พฤติกรรมที่ควรส่งเสริม</h4>
                        <div className="flex flex-wrap gap-2">
                             {behaviorTags.needs_attention.map(tag => (
                                <button key={tag.label} onClick={() => handleSaveLog('needs_attention', tag)} disabled={isSaving} className="flex items-center gap-2 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg transition-colors">
                                    <Icon name={tag.icon} size={16} /> <span>{tag.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">บันทึกเพิ่มเติม (ถ้ามี)</label>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows="3" className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white" placeholder="เช่น ช่วยเพื่อนสอนการบ้าน..."></textarea>
                    </div>
                </div>
                 <footer className="p-4 border-t border-white/10 flex justify-end">
                     <button onClick={onClose} className="py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors">
                        ปิด
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default BehaviorLoggerModal;