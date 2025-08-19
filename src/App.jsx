import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calculator, FlaskConical, Code, MessageSquare, History, User, X, Save, FilePlus, Loader2, UserPlus, AlertTriangle, Pencil, Trash2, Palette, Settings, GraduationCap, Square, SquareAsterisk, SquareDot, SquareEqual, SquarePen, SquareM, PlusCircle, Tag, Upload, Download } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, setDoc, addDoc, serverTimestamp, query, orderBy, deleteDoc, writeBatch, getDocs, deleteField } from 'firebase/firestore';
// import Papa from 'papaparse'; // <-- REMOVED: We will load this from a script tag instead.

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCGy9AqyJTjJSVJidVPQ_3H4xqDl81K7uU",
    authDomain: "banwanghinscore.firebaseapp.com",
    projectId: "banwanghinscore",
    storageBucket: "banwanghinscore.appspot.com",
    messagingSenderId: "730874164075",
    appId: "1:730874164075:web:d1e73f5f642fcede7f122e"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- App ID for Firestore Path ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'banwanghin-lms-dev';

// --- Theming and Data Constants ---
const colorThemes = {
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', shadow: 'hover:shadow-teal-500/20', text: 'text-teal-300' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', shadow: 'hover:shadow-sky-500/20', text: 'text-sky-300' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', shadow: 'hover:shadow-purple-500/20', text: 'text-purple-300' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', shadow: 'hover:shadow-rose-500/20', text: 'text-rose-300' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', shadow: 'hover:shadow-amber-500/20', text: 'text-amber-300' },
    lime: { bg: 'bg-lime-500/10', border: 'border-lime-500/30', shadow: 'hover:shadow-lime-500/20', text: 'text-lime-300' },
};

const gradeStyles = {
    p1: { icon: Square, color: 'text-rose-400' },
    p2: { icon: SquareDot, color: 'text-orange-400' },
    p3: { icon: SquarePen, color: 'text-amber-400' },
    p4: { icon: SquareAsterisk, color: 'text-lime-400' },
    p5: { icon: SquareEqual, color: 'text-sky-400' },
    p6: { icon: SquareM, color: 'text-purple-400' },
};
const grades = Object.keys(gradeStyles);

const assignmentCategories = {
  quiz: { label: 'เก็บคะแนน', color: 'bg-sky-500/20 text-sky-300', borderColor: 'border-sky-500/30' },
  midterm: { label: 'สอบกลางภาค', color: 'bg-amber-500/20 text-amber-300', borderColor: 'border-amber-500/30' },
  final: { label: 'สอบปลายภาค', color: 'bg-rose-500/20 text-rose-300', borderColor: 'border-rose-500/30' },
};


// === MAIN APP COMPONENT ===
export default function App() {
    const [subjects, setSubjects] = useState([]);
    const [modal, setModal] = useState({ type: null, data: null });
    
    // Effect to fetch subject metadata from Firestore in real-time.
    useEffect(() => {
        const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
        const q = query(collection(db, subjectsMetaPath), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const subjectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubjects(subjectsData);
        }, (error) => {
            console.error("Error fetching subjects meta data: ", error);
        });
        return () => unsubscribe();
    }, []);

    // NEW: Effect to load the Papaparse CSV library from a CDN
    useEffect(() => {
        const scriptId = 'papaparse-script';
        if (document.getElementById(scriptId)) return; // Avoid adding script multiple times
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);


    // Handlers for managing modal states.
    const handleCardClick = (subject) => setModal({ type: 'selectGrade', data: subject });
    const handleGradeSelect = (subject, grade) => setModal({ type: 'classDetail', data: { subject, grade } });
    const handleCloseModal = () => setModal({type: null});

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-teal-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
                <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000 bottom-1/4 right-1/4"></div>
            </div>
            
            <main className="relative z-10 p-4 sm:p-6 md:p-8">
                <header className="flex justify-between items-center mb-8">
                    <div><h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1><p className="text-gray-400">ภาพรวมรายวิชา - โรงเรียนบ้านวังหิน</p></div>
                    <button onClick={() => setModal({type: 'manageSubjects'})} className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Settings size={16}/>จัดการวิชา</button>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subjects.map((subject) => (<ClassCard key={subject.id} subject={subject} onClick={() => handleCardClick(subject)}/>))}
                </div>
            </main>
            
            {modal.type === 'selectGrade' && <GradeSelectionModal subject={modal.data} onSelect={handleGradeSelect} onClose={handleCloseModal} />}
            {modal.type === 'classDetail' && (<ClassDetailView subject={modal.data.subject} grade={modal.data.grade} onClose={handleCloseModal}/>)}
            {modal.type === 'manageSubjects' && <SubjectManagementModal subjects={subjects} onClose={handleCloseModal}/>}
        </div>
    );
}

// === CHILD COMPONENTS ===

const ClassCard = ({ subject, onClick }) => {
    const theme = colorThemes[subject.colorTheme] || colorThemes.teal;
    const Icon = { BookOpen, Calculator, FlaskConical, Code, MessageSquare, History }[subject.iconName] || BookOpen;
    return (
        <div onClick={onClick} className={`backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg ${theme.bg} ${theme.border} ${theme.shadow}`}>
            <div className="flex justify-between items-start">
                <div className="flex-grow"><h3 className="text-xl font-bold text-white truncate">{subject.name}</h3><p className="text-sm text-gray-400">{subject.gradeRange}</p></div>
                <div className={`p-3 rounded-lg bg-white/5`}><Icon className={theme.text} size={24} /></div>
            </div>
            <div className="mt-6 flex items-center text-sm text-gray-300"><User size={16} className="mr-2"/><span>{subject.teacherName || 'ยังไม่ได้กำหนด'}</span></div>
        </div>
    );
};

const GradeSelectionModal = ({ subject, onSelect, onClose }) => {
    const [gradeCounts, setGradeCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            setIsLoading(true);
            const counts = {};
            const gradePromises = grades.map(async (gradeId) => {
                const studentsPath = `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${gradeId}/students`;
                try {
                    const snapshot = await getDocs(collection(db, studentsPath));
                    counts[gradeId] = snapshot.size;
                } catch (error) { console.error(error); counts[gradeId] = 0; }
            });
            await Promise.all(gradePromises);
            setGradeCounts(counts);
            setIsLoading(false);
        };
        fetchCounts();
    }, [subject.id]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-3xl shadow-2xl shadow-black/50 p-8 text-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={28} /></button>
                <h2 className="text-3xl font-bold text-white mb-2">เลือกชั้นเรียน</h2>
                <p className="text-lg text-gray-300 mb-8">วิชา: {subject.name}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {grades.map((gradeId, index) => {
                        const style = gradeStyles[gradeId];
                        const GradeIcon = style.icon;
                        return (
                            <button key={gradeId} onClick={() => onSelect(subject, gradeId)} className={`group w-full p-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center`}>
                                <GradeIcon className={`w-12 h-12 mb-3 transition-colors ${style.color}`} />
                                <span className="text-xl font-bold text-white">ป.{index + 1}</span>
                                <div className="flex items-center text-sm font-normal text-gray-400 mt-1">
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><User size={16} className="mr-1.5"/><span>{gradeCounts[gradeId] || 0} คน</span></>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SubjectManagementModal = ({subjects, onClose}) => {
    const [editingSubject, setEditingSubject] = useState(null);

    const handleSave = async (subjectData) => {
        const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
        try {
            if (subjectData.id) {
                const docRef = doc(db, subjectsMetaPath, subjectData.id);
                const { id, ...dataToUpdate } = subjectData;
                await setDoc(docRef, dataToUpdate, { merge: true });
            } else {
                const { id, ...dataToAdd } = subjectData;
                await addDoc(collection(db, subjectsMetaPath), { ...dataToAdd, createdAt: serverTimestamp() });
            }
            setEditingSubject(null);
        } catch (error) {
            console.error("Error saving subject:", error);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
            await deleteDoc(doc(db, subjectsMetaPath, id));
        } catch (error) {
            console.error("Error deleting subject:", error);
        }
    }

    if (editingSubject) {
        return <SubjectEditForm subject={editingSubject} onSave={handleSave} onCancel={() => setEditingSubject(null)} />
    }

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

const SubjectEditForm = ({ subject, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
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
                <h3 className="text-xl font-bold mb-6">{subject.id ? 'แก้ไขวิชา' : 'สร้างวิชาใหม่'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อวิชา</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อครูผู้สอน</label>
                        <input type="text" name="teacherName" value={formData.teacherName} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ชุดสี (Theme)</label>
                        <div className="grid grid-cols-6 gap-2">
                            {Object.keys(colorThemes).map(themeKey => (
                                <button type="button" key={themeKey} onClick={() => setFormData(p => ({...p, colorTheme: themeKey}))} className={`h-10 rounded-lg ${colorThemes[themeKey].bg} ${formData.colorTheme === themeKey ? `ring-2 ring-offset-2 ring-offset-gray-800 ${colorThemes[themeKey].text.replace('text-','ring-')}` : ''}`}></button>
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

const ClassDetailView = ({ subject, grade, onClose }) => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [scores, setScores] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modal, setModal] = useState({ type: null, data: null });
    const basePath = `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}`;

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

    const handleScoreChange = (studentId, assignmentId, value) => {
        const newScores = JSON.parse(JSON.stringify(scores));
        if (!newScores[studentId]) newScores[studentId] = {};
        newScores[studentId][assignmentId] = value === '' ? null : parseInt(value, 10);
        setScores(newScores);
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const batch = writeBatch(db);
            Object.keys(scores).forEach(studentId => {
                const studentScores = scores[studentId];
                const docRef = doc(db, `${basePath}/scores`, studentId);
                batch.set(docRef, studentScores, { merge: true });
            });
            await batch.commit();
        } catch (error) { console.error("Error saving scores:", error); } 
        finally { setIsSaving(false); }
    };

    const handleAddOrEdit = async (type, data) => {
        const collectionName = type === 'student' ? 'students' : 'assignments';
        try {
            if (data.id) {
                const docRef = doc(db, `${basePath}/${collectionName}`, data.id);
                const { id, ...dataToUpdate } = data;
                await setDoc(docRef, dataToUpdate, { merge: true });
            } else {
                const { id, ...dataToAdd } = data;
                await addDoc(collection(db, `${basePath}/${collectionName}`), { ...dataToAdd, createdAt: serverTimestamp() });
            }
            setModal({ type: null, data: null });
        } catch (error) { console.error(`Error saving ${type}:`, error); }
    };

    const handleDelete = async (type, id) => {
        if (!id) return;
        const collectionName = type === 'student' ? 'students' : 'assignments';
        try {
            const docRef = doc(db, `${basePath}/${collectionName}`, id);
            await deleteDoc(docRef);
            
            if (type === 'assignment') {
                const scoresQuery = query(collection(db, `${basePath}/scores`));
                const scoresSnapshot = await getDocs(scoresQuery);
                const batch = writeBatch(db);
                scoresSnapshot.forEach(scoreDoc => {
                    batch.update(scoreDoc.ref, { [id]: deleteField() });
                });
                await batch.commit();
            }
            
            if (type === 'student') {
                const scoreDocRef = doc(db, `${basePath}/scores`, id);
                await deleteDoc(scoreDocRef).catch(e => console.log("No scores to delete or error:", e));
            }
            setModal({ type: null, data: null });
        } catch (error) { console.error(`Error deleting ${type}:`, error); }
    };

    const handleExportData = () => {
        const headers = ['เลขที่', 'ชื่อ', 'สกุล', ...assignments.map(a => `${a.name} (${a.maxScore})`)];
        const rows = students.map(student => {
            const studentScores = assignments.map(assign => scores[student.id]?.[assign.id] ?? '');
            return [student.studentNumber, student.firstName, student.lastName, ...studentScores];
        });

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${subject.name}_ป${grade.replace('p','')}_scores.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportStudents = async (newStudents) => {
        const studentsCollectionRef = collection(db, `${basePath}/students`);
        try {
            const batch = writeBatch(db);
            newStudents.forEach(student => {
                const newDocRef = doc(studentsCollectionRef);
                batch.set(newDocRef, student);
            });
            await batch.commit();
            setModal({ type: null });
        } catch (error) {
            console.error("Error importing students: ", error);
        }
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
                                    {assignments.map(assign => {
                                        const category = assignmentCategories[assign.category] || assignmentCategories.quiz;
                                        return (
                                            <th key={assign.id} className={`p-3 text-sm font-semibold text-white border-b border-r border-gray-700 text-center w-40 group relative`}>
                                                <div className="flex flex-col items-center justify-center">
                                                    <span>{assign.name}</span>
                                                    <span className="block text-xs text-gray-400 font-normal mb-1">({assign.maxScore} คะแนน)</span>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${category.color}`}>{category.label}</span>
                                                </div>
                                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setModal({ type: 'editAssignment', data: assign })} className="p-1 bg-sky-500/50 hover:bg-sky-500 rounded"><Pencil size={12}/></button>
                                                    <button onClick={() => setModal({ type: 'deleteConfirmation', data: { type: 'assignment', id: assign.id, name: assign.name }})} className="p-1 bg-red-500/50 hover:bg-red-500 rounded"><Trash2 size={12}/></button>
                                                </div>
                                            </th>
                                        );
                                    })}
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
                            <button onClick={() => setModal({ type: 'importStudents' })} className="flex items-center gap-2 text-sm bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Upload size={16} />นำเข้ารายชื่อ</button>
                            <button onClick={handleExportData} className="flex items-center gap-2 text-sm bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Download size={16} />ส่งออกคะแนน</button>
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
            {modal.type === 'importStudents' && <ImportStudentsModal onClose={() => setModal({type: null})} onImport={handleImportStudents} />}
        </>
    );
};

const StudentModal = ({ onClose, onSave, initialData = null }) => {
    const [studentNumber, setStudentNumber] = useState(initialData?.studentNumber || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const isEditMode = !!initialData;
    const handleSubmit = (e) => { e.preventDefault(); if (studentNumber && firstName.trim() && lastName.trim()) { onSave({ id: initialData?.id, studentNumber: parseInt(studentNumber, 10), firstName, lastName }); }};
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"><div className="bg-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{isEditMode ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4"><label htmlFor="studentNumber" className="block text-sm font-medium text-gray-300 mb-1">เลขที่</label><input type="number" id="studentNumber" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required min="1" /></div>
                <div className="mb-4"><label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">ชื่อจริง</label><input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
                <div className="mb-6"><label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">นามสกุล</label><input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
                <div className="flex justify-end gap-4"><button type="button" onClick={onClose} className="py-2 px-4 text-gray-300 hover:text-white">ยกเลิก</button><button type="submit" className="py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors">{isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มนักเรียน'}</button></div>
            </form>
        </div></div>
    );
};

const AssignmentModal = ({ onClose, onSave, initialData = null }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [maxScore, setMaxScore] = useState(initialData?.maxScore || 10);
    const [category, setCategory] = useState(initialData?.category || 'quiz');
    const isEditMode = !!initialData;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && maxScore > 0) {
            onSave({ id: initialData?.id, name, maxScore: parseInt(maxScore, 10), category });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold mb-4">{isEditMode ? 'แก้ไขรายการเก็บคะแนน' : 'เพิ่มรายการเก็บคะแนนใหม่'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="assignmentName" className="block text-sm font-medium text-gray-300 mb-1">ชื่องาน</label>
                        <input type="text" id="assignmentName" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    </div>
                    <div>
                        <label htmlFor="maxScore" className="block text-sm font-medium text-gray-300 mb-1">คะแนนเต็ม</label>
                        <input type="number" id="maxScore" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required min="1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">ประเภท</label>
                        <div className="flex gap-2">
                            {Object.entries(assignmentCategories).map(([key, value]) => (
                                <button type="button" key={key} onClick={() => setCategory(key)} className={`flex-1 text-sm py-2 px-3 rounded-lg border transition-colors ${category === key ? `${value.borderColor} ${value.color} font-bold` : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}>
                                    {value.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 text-gray-300 hover:text-white">ยกเลิก</button>
                        <button type="submit" className="py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors">{isEditMode ? 'บันทึกการแก้ไข' : 'สร้างรายการ'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmationModal = ({ onClose, onConfirm, item }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-800 border border-red-500/50 rounded-2xl p-6 w-full max-w-md shadow-2xl text-center">
                <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">ยืนยันการลบ</h3>
                <p className="text-gray-300 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบ "{item.name}"? <br/><span className="text-red-400 font-semibold">การกระทำนี้ไม่สามารถย้อนกลับได้</span></p>
                <div className="flex justify-center gap-4"><button onClick={onClose} className="py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors">ยกเลิก</button><button onClick={() => { onConfirm(); onClose(); }} className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">ยืนยันการลบ</button></div>
            </div>
        </div>
    );
};

const ImportStudentsModal = ({ onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('กรุณาเลือกไฟล์ .csv เท่านั้น');
        }
    };

    const handleProcessFile = () => {
        if (!file) {
            setError('กรุณาเลือกไฟล์ก่อน');
            return;
        }
        if (!window.Papa) {
            setError('Library สำหรับประมวลผลไฟล์ยังไม่พร้อม โปรดรอสักครู่แล้วลองอีกครั้ง');
            return;
        }

        setIsProcessing(true);
        window.Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const requiredHeaders = ['studentNumber', 'firstName', 'lastName'];
                const actualHeaders = results.meta.fields;
                const hasAllHeaders = requiredHeaders.every(h => actualHeaders.includes(h));

                if (!hasAllHeaders) {
                    setError(`ไฟล์ CSV ต้องมีคอลัมน์: ${requiredHeaders.join(', ')}`);
                    setIsProcessing(false);
                    return;
                }

                const studentsData = results.data.map(row => ({
                    studentNumber: parseInt(row.studentNumber, 10),
                    firstName: row.firstName.trim(),
                    lastName: row.lastName.trim(),
                })).filter(s => !isNaN(s.studentNumber) && s.firstName && s.lastName);

                onImport(studentsData);
                setIsProcessing(false);
            },
            error: (err) => {
                setError('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message);
                setIsProcessing(false);
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                <h3 className="text-xl font-bold mb-4">นำเข้ารายชื่อนักเรียนจากไฟล์ CSV</h3>
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm rounded-lg p-3 mb-4">
                    <p className="font-bold">คำแนะนำ:</p>
                    <ul className="list-disc list-inside mt-1">
                        <li>ไฟล์ต้องเป็นประเภท .csv</li>
                        <li>ต้องมีคอลัมน์ `studentNumber`, `firstName`, `lastName`</li>
                        <li>แถวแรกสุด (Header) ต้องเป็นชื่อคอลัมน์ตามลำดับ</li>
                    </ul>
                </div>
                
                <input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <button onClick={() => fileInputRef.current.click()} className="w-full text-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                    {file ? `เลือกไฟล์แล้ว: ${file.name}` : 'คลิกเพื่อเลือกไฟล์'}
                </button>

                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onClose} className="py-2 px-4 text-gray-300 hover:text-white">ยกเลิก</button>
                    <button onClick={handleProcessFile} disabled={!file || isProcessing} className="flex items-center gap-2 py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                        {isProcessing ? 'กำลังประมวลผล...' : 'นำเข้าข้อมูล'}
                    </button>
                </div>
            </div>
        </div>
    );
};
