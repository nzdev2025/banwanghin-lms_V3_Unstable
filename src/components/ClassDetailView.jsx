import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, UserPlus, FilePlus, Pencil, Trash2 } from 'lucide-react';
import { db, appId } from '../firebase.js';
import { collection, query, orderBy, onSnapshot, doc, writeBatch, setDoc, addDoc, serverTimestamp, deleteDoc, getDocs, deleteField } from 'firebase/firestore';
import StudentModal from './StudentModal.jsx';
import AssignmentModal from './AssignmentModal.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';

const ClassDetailView = ({ subject, grade, onClose }) => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [scores, setScores] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modal, setModal] = useState({ type: null, data: null });
    const basePath = `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}`;

    // Effect to subscribe to real-time updates for students, assignments, and scores.
    useEffect(() => {
        setIsLoading(true);
        const studentsQuery = query(collection(db, `${basePath}/students`), orderBy("studentNumber"));
        const assignmentsQuery = query(collection(db, `${basePath}/assignments`), orderBy("createdAt"));
        const unsubscribers = [
            onSnapshot(studentsQuery, (snapshot) => setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(assignmentsQuery, (snapshot) => setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(collection(db, `${basePath}/scores`), (snapshot) => {
                const scoreData = {};
                snapshot.docs.forEach(doc => { scoreData[doc.id] = doc.data(); });
                setScores(scoreData);
                setIsLoading(false);
            })
        ];
        return () => unsubscribers.forEach(unsub => unsub());
    }, [basePath]);

    // Handles changes to score inputs, updating local state.
    const handleScoreChange = (studentId, assignmentId, value) => {
        const newScores = JSON.parse(JSON.stringify(scores));
        if (!newScores[studentId]) newScores[studentId] = {};
        newScores[studentId][assignmentId] = value === '' ? null : parseInt(value, 10);
        setScores(newScores);
    };

    // Saves all score changes to Firestore in a single batch write.
    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const batch = writeBatch(db);
            Object.keys(scores).forEach(studentId => {
                const studentScores = scores[studentId];
                const docRef = doc(db, `${basePath}/scores`, studentId);
                // Use set with merge to only update fields, not overwrite the whole doc
                batch.set(docRef, studentScores, { merge: true });
            });
            await batch.commit();
        } catch (error) { console.error("Error saving scores:", error); }
        finally { setIsSaving(false); }
    };

    // Generic handler for adding or editing students/assignments.
    const handleAddOrEdit = async (type, data) => {
        const collectionName = type === 'student' ? 'students' : 'assignments';
        try {
            if (data.id) { // Edit
                const docRef = doc(db, `${basePath}/${collectionName}`, data.id);
                const { ...dataToUpdate } = data;
                delete dataToUpdate.id; // remove id from data
                await setDoc(docRef, dataToUpdate, { merge: true });
            } else { // Add
                const { ...dataToAdd } = data;
                delete dataToAdd.id; // remove id from data
                await addDoc(collection(db, `${basePath}/${collectionName}`), { ...dataToAdd, createdAt: serverTimestamp() });
            }
            setModal({ type: null, data: null });
        } catch (error) { console.error(`Error saving ${type}:`, error); }
    };

    // Generic handler for deleting students/assignments and their related data.
    const handleDelete = async (type, id) => {
        if (!id) return;
        const collectionName = type === 'student' ? 'students' : 'assignments';
        try {
            const docRef = doc(db, `${basePath}/${collectionName}`, id);
            await deleteDoc(docRef);

            // If deleting an assignment, remove its score field from all student score documents.
            if (type === 'assignment') {
                const scoresQuery = query(collection(db, `${basePath}/scores`));
                const scoresSnapshot = await getDocs(scoresQuery);
                const batch = writeBatch(db);
                scoresSnapshot.forEach(scoreDoc => {
                    batch.update(scoreDoc.ref, { [id]: deleteField() });
                });
                await batch.commit();
            }

            // If deleting a student, remove their entire score document.
            if (type === 'student') {
                const scoreDocRef = doc(db, `${basePath}/scores`, id);
                await deleteDoc(scoreDocRef).catch(e => console.log("No scores to delete or error:", e));
            }
            setModal({ type: null, data: null });
        } catch (error) { console.error(`Error deleting ${type}:`, error); }
    };

    if (isLoading) return <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"><Loader2 className="animate-spin text-teal-500" size={48} /></div>;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-800/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl shadow-black/50">
                    <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                        <div><h2 className="text-2xl font-bold text-white">{subject.name} - (ป.{grade.replace('p','')})</h2><p className="text-gray-400">ตารางบันทึกคะแนน</p></div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={28} /></button>
                    </header>
                    <div className="p-6 flex-grow overflow-auto">
                        <table className="w-full min-w-[900px] text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-800/80 backdrop-blur-xl z-10">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 w-16 text-center">เลขที่</th>
                                    <th className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 min-w-[250px]">ชื่อ-สกุล</th>
                                    {assignments.map(assign => (
                                        <th key={assign.id} className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 text-center w-36 group relative">
                                            {assign.name}<span className="block text-xs text-gray-400 font-normal">({assign.maxScore} คะแนน)</span>
                                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setModal({ type: 'editAssignment', data: assign })} className="p-1 bg-sky-500/50 hover:bg-sky-500 rounded"><Pencil size={12}/></button>
                                                <button onClick={() => setModal({ type: 'deleteConfirmation', data: { type: 'assignment', id: assign.id, name: assign.name }})} className="p-1 bg-red-500/50 hover:bg-red-500 rounded"><Trash2 size={12}/></button>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 text-center w-28">คะแนนรวม</th>
                                    <th className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 w-24 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => {
                                   const totalScore = assignments.reduce((sum, assign) => (sum + (scores[student.id]?.[assign.id] ?? 0)), 0);
                                   return (
                                    <tr key={student.id} className="hover:bg-white/5">
                                        <td className="p-2 text-center border-b border-r border-gray-700">{student.studentNumber}</td>
                                        <td className="p-2 font-medium border-b border-r border-gray-700">{`${student.firstName} ${student.lastName}`}</td>
                                        {assignments.map(assign => (
                                            <td key={assign.id} className="p-0 border-b border-r border-gray-700">
                                                <input type="number" max={assign.maxScore} min="0" value={scores[student.id]?.[assign.id] ?? ''} onChange={(e) => handleScoreChange(student.id, assign.id, e.target.value)} className="w-full h-full bg-transparent text-center text-white p-3 outline-none focus:bg-sky-500/20" placeholder="-"/>
                                            </td>
                                        ))}
                                        <td className="p-3 text-center border-b border-r border-gray-700 font-bold text-teal-300">{totalScore}</td>
                                        <td className="p-2 text-center border-b border-r border-gray-700">
                                            <div className="flex justify-center gap-2">
                                               <button onClick={() => setModal({ type: 'editStudent', data: student })} className="p-1.5 text-sky-400 hover:bg-sky-500 hover:text-white rounded"><Pencil size={16}/></button>
                                               <button onClick={() => setModal({ type: 'deleteConfirmation', data: { type: 'student', id: student.id, name: `${student.firstName} ${student.lastName}` }})} className="p-1.5 text-red-400 hover:bg-red-500 hover:text-white rounded"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                   );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <footer className="flex items-center justify-between p-4 border-t border-white/10 flex-shrink-0 gap-4">
                        <div className="flex gap-4">
                            <button onClick={() => setModal({ type: 'addStudent' })} className="flex items-center gap-2 text-sm bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><UserPlus size={16} />เพิ่มนักเรียน</button>
                            <button onClick={() => setModal({ type: 'addAssignment' })} className="flex items-center gap-2 text-sm bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><FilePlus size={16} />เพิ่มรายการเก็บคะแนน</button>
                        </div>
                        <button onClick={handleSaveAll} disabled={isSaving} className="flex items-center gap-2 text-sm bg-teal-500/80 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-teal-500/20 disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </footer>
                </div>
            </div>

            {modal.type === 'addStudent' && <StudentModal onClose={() => setModal({type: null})} onSave={(data) => handleAddOrEdit('student', data)} />}
            {modal.type === 'editStudent' && <StudentModal onClose={() => setModal({type: null})} onSave={(data) => handleAddOrEdit('student', data)} initialData={modal.data} />}
            {modal.type === 'addAssignment' && <AssignmentModal onClose={() => setModal({type: null})} onSave={(data) => handleAddOrEdit('assignment', data)} />}
            {modal.type === 'editAssignment' && <AssignmentModal onClose={() => setModal({type: null})} onSave={(data) => handleAddOrEdit('assignment', data)} initialData={modal.data} />}
            {modal.type === 'deleteConfirmation' && <ConfirmationModal onClose={() => setModal({type: null})} onConfirm={() => handleDelete(modal.data.type, modal.data.id)} item={modal.data} />}
        </>
    );
};

export default ClassDetailView;
