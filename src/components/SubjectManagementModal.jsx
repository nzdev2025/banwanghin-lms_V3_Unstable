import React, { useState } from 'react';
import { X, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { doc, setDoc, addDoc, collection, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, appId } from '../firebase.js';
import SubjectEditForm from './SubjectEditForm.jsx';

const SubjectManagementModal = ({subjects, onClose}) => {
    const [editingSubject, setEditingSubject] = useState(null);

    // Handles saving a new or updated subject to Firestore.
    const handleSave = async (subjectData) => {
        const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
        try {
            if (subjectData.id) { // Update existing subject
                const docRef = doc(db, subjectsMetaPath, subjectData.id);
                const { ...dataToUpdate } = subjectData;
                delete dataToUpdate.id;
                await setDoc(docRef, dataToUpdate, { merge: true });
            } else { // Add new subject
                const { ...dataToAdd } = subjectData;
                delete dataToAdd.id;
                await addDoc(collection(db, subjectsMetaPath), { ...dataToAdd, createdAt: serverTimestamp() });
            }
            setEditingSubject(null);
        } catch (error) {
            console.error("Error saving subject:", error);
        }
    };

    // Handles deleting a subject from Firestore.
    const handleDelete = async (id) => {
        // NOTE: In a real app, using a custom modal instead of window.confirm is better for UX.
        // This is a placeholder for simplicity.
        // if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบวิชานี้? ข้อมูลทั้งหมดที่เกี่ยวข้องจะถูกลบอย่างถาวร")) return;
        try {
            const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
            await deleteDoc(doc(db, subjectsMetaPath, id));
            // In a full-scale app, you would also delete all associated sub-collections here.
        } catch (error) {
            console.error("Error deleting subject:", error);
        }
    }

    // Renders the edit form if a subject is being edited.
    if (editingSubject) {
        return <SubjectEditForm subject={editingSubject} onSave={handleSave} onCancel={() => setEditingSubject(null)} />
    }

    // Renders the list of subjects.
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl shadow-black/50">
                <header className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-2xl font-bold">จัดการรายวิชา</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={28} /></button>
                </header>
                <div className="p-6 flex-grow overflow-y-auto">
                    <ul className="space-y-3">
                        {subjects.map(sub => (
                            <li key={sub.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                <div>
                                    <p className="font-bold text-white">{sub.name}</p>
                                    <p className="text-sm text-gray-400">{sub.teacherName}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingSubject(sub)} className="p-2 text-sky-400 hover:bg-sky-500/20 rounded"><Pencil size={18}/></button>
                                    {/* This button should trigger a confirmation modal */}
                                    <button onClick={() => handleDelete(sub.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded"><Trash2 size={18}/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <footer className="p-4 border-t border-white/10">
                    <button onClick={() => setEditingSubject({})} className="w-full flex items-center justify-center gap-2 bg-teal-500/80 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        <PlusCircle size={20}/> เพิ่มวิชาใหม่
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SubjectManagementModal;
