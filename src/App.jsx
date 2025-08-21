import React from 'react';
import { createRoot } from 'react-dom/client';
import { collection, doc, onSnapshot, setDoc, addDoc, serverTimestamp, query, orderBy, deleteDoc, writeBatch, getDocs, deleteField, limit } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// --- Main App Component ---
// This file contains all the React components for the Ban Wang Hin LMS application.
// For clarity in this self-contained example, components are defined within this single file.

import Icon from './icons/Icon';


import { db, logActivity, appId } from './firebase/firebase';
import { callGeminiAPI } from './api/gemini';


import { colorThemes, gradeStyles, analyticsCardStyles } from './constants/theme';
import { grades, assignmentCategories } from './constants/data';

import TopStudentsLeaderboard from './components/dashboard/TopStudentsLeaderboard';
import RecentActivityFeed from './components/dashboard/RecentActivityFeed';
import AtRiskStudents from './components/dashboard/AtRiskStudents';
import OverallAnalytics from './components/analytics/OverallAnalytics';


// --- Core App Layout ---
function App() {
    const [subjects, setSubjects] = React.useState([]);
    const [modal, setModal] = React.useState({ type: null, data: null });
    
    React.useEffect(() => {
        if (!db) {
            console.error("Firestore is not initialized.");
            return;
        }
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

    React.useEffect(() => {
        const scriptId = 'papaparse-script';
        if (document.getElementById(scriptId)) return;
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            const scriptElement = document.getElementById(scriptId);
            if (scriptElement) {
                document.body.removeChild(scriptElement);
            }
        }
    }, []);

    const handleCardClick = (subject) => setModal({ type: 'selectGrade', data: subject });
    const handleGradeSelect = (subject, grade) => setModal({ type: 'classDetail', data: { subject, grade } });
    const handleCloseModal = () => setModal({type: null});
    const handleStudentClick = (student, grade) => setModal({ type: 'studentProfile', data: { student, grade } });

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-teal-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
                <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000 bottom-1/4 right-1/4"></div>
            </div>
            
            <main className="relative z-10 p-4 sm:p-6 md:p-8 flex-grow w-full max-w-screen-2xl mx-auto">
                <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div><h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1><p className="text-gray-400">ภาพรวมรายวิชา - โรงเรียนบ้านวังหิน</p></div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setModal({type: 'manageRoster'})} className="flex items-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-sky-500/40"><Icon name="Users2" size={16}/>ทะเบียนนักเรียน</button>
                        <button onClick={() => setModal({type: 'manageSubjects'})} className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Icon name="Settings" size={16}/>จัดการวิชา</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-8">
                        <OverallAnalytics subjects={subjects} />
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">รายวิชาทั้งหมด</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {subjects.map((subject) => (<ClassCard key={subject.id} subject={subject} onClick={() => handleCardClick(subject)}/>))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1 flex flex-col gap-6">
                         <AtRiskStudents subjects={subjects} onStudentClick={handleStudentClick} />
                         <TopStudentsLeaderboard subjects={subjects} onStudentClick={handleStudentClick} />
                         <RecentActivityFeed />
                    </div>
                </div>
            </main>

            <footer className="relative z-10 text-center py-4 text-gray-500 text-sm">
                <p>Developed by Wasin Suksuwan | ICTTalent Connext ED</p>
            </footer>
            
            {modal.type === 'selectGrade' && <GradeSelectionModal subject={modal.data} onSelect={handleGradeSelect} onClose={handleCloseModal} />}
            {modal.type === 'classDetail' && (<ClassDetailView subject={modal.data.subject} grade={modal.data.grade} onStudentClick={handleStudentClick} onClose={handleCloseModal}/>)}
            {modal.type === 'manageSubjects' && <SubjectManagementModal subjects={subjects} onClose={handleCloseModal}/>}
            {modal.type === 'manageRoster' && <RosterManagementModal onClose={handleCloseModal} />}
            {modal.type === 'studentProfile' && <StudentProfileModal student={modal.data.student} grade={modal.data.grade} subjects={subjects} onClose={handleCloseModal} />}
        </div>
    );
}

import GradeSelectionModal from './components/modals/GradeSelectionModal';
import ClassDetailView from './components/modals/ClassDetailView';
import SubjectManagementModal from './components/modals/SubjectManagementModal';
import RosterManagementModal from './components/modals/RosterManagementModal';
import StudentProfileModal from './components/modals/StudentProfileModal';
import ClassCard from './components/shared/ClassCard';


export default App;
