import React from 'react';
import { colorThemes } from '../../constants/theme';

const SubjectEditForm = ({ subject, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState({
        name: subject.name || '',
        teacherName: subject.teacherName || '',
        gradeRange: subject.gradeRange || 'ป.1-ป.6',
        iconName: subject.iconName || 'BookOpen',
        colorTheme: subject.colorTheme || 'teal',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, id: subject.id });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 border border-white/20 rounded-2xl w-full max-w-lg shadow-2xl p-6">
                 <h3 className="text-xl font-bold mb-6 text-white">{subject.id ? 'แก้ไขวิชา' : 'สร้างวิชาใหม่'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อวิชา</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อครูผู้สอน</label>
                        <input type="text" name="teacherName" value={formData.teacherName} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ชุดสี (Theme)</label>
                        <div className="grid grid-cols-6 gap-2">
                            {Object.keys(colorThemes).map(themeKey => (
                                <button type="button" key={themeKey} onClick={() => setFormData(p => ({...p, colorTheme: themeKey}))} className={`h-10 rounded-lg ${colorThemes[themeKey].bg} ${formData.colorTheme === themeKey ? `ring-2 ring-offset-2 ring-offset-gray-800 ring-${themeKey}-400` : ''}`}></button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={onCancel} className="py-2 px-4 text-gray-300 hover:text-white">ยกเลิก</button>
                    <button type="submit" className="py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors">บันทึก</button>
                </div>
            </form>
        </div>
    );
};

export default SubjectEditForm;
