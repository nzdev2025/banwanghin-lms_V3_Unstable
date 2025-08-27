// src/App.jsx (The "Professional UI" Final Version)

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import { db, auth, onAuthStateChanged, handleLogout } from './firebase/firebase';
import LoginView from './views/LoginView'; 

import Icon from './icons/Icon';
import OverallAnalytics from './components/analytics/OverallAnalytics';
import DashboardWidgets from './components/dashboard/DashboardWidgets';
import SavingsCard from './components/shared/SavingsCard';
import AssignmentSystemCard from './components/shared/AssignmentSystemCard';
import ClassroomToolkitCard from './components/shared/ClassroomToolkitCard';
import AIWorksheetFactoryCard from './components/shared/AIWorksheetFactoryCard';
import AttendanceCard from './components/shared/AttendanceCard';
import HealthCard from './components/shared/HealthCard'; // ++ 1. IMPORT
import SubjectSelectionView from './components/modals/SubjectSelectionView';
import GradeSelectionModal from './components/modals/GradeSelectionModal';
import ClassDetailView from './components/modals/ClassDetailView';
import SubjectManagementModal from './components/modals/SubjectManagementModal';
import RosterManagementModal from './components/modals/RosterManagementModal';
import StudentProfileModal from './components/modals/StudentProfileModal';
import SavingsManagementModal from './components/modals/SavingsManagementModal';
import ClassroomToolkitModal from './components/modals/ClassroomToolkitModal';
import AIWorksheetGeneratorModal from './components/modals/AIWorksheetGeneratorModal';
import LineNotifySettingsModal from './components/modals/LineNotifySettingsModal';
import AttendanceModal from './components/modals/AttendanceModal';
import HealthRecordModal from './components/modals/HealthRecordModal'; // ++ 2. IMPORT

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [subjects, setSubjects] = React.useState([]);
    const [view, setView] = React.useState('dashboard');
    const [modal, setModal] = React.useState({ type: null, data: null });
    const [appId, setAppId] = React.useState('banwanghin-lms-dev');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (!user) return; 
        const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
        const q = query(collection(db, subjectsMetaPath), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [appId, user]);

    const handleStudentClick = (student, grade) => setModal({ type: 'studentProfile', data: { student, grade } });
    const handleCloseModal = () => setModal({type: null});

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Icon name="Loader2" className="animate-spin text-teal-400" size={48} />
            </div>
        );
    }

    if (!user) {
        return <LoginView />;
    }

    return (
        <>
            {view === 'dashboard' && (
                <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-teal-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
                        <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000 bottom-1/4 right-1/4"></div>
                    </div>
                    
                    <main className="relative z-10 p-4 sm:p-6 md:p-8 flex-grow w-full max-w-screen-2xl mx-auto">
                        {/* --- [!] HEADER ที่อัปเกรดแล้ว --- */}
                        <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">KruKit (ครูคิท)</h1>
                                <p className="text-gray-400">ผู้ช่วยครูยุคดิจิทัล - โรงเรียนบ้านวังหิน by Wasin Suksuwan ICTTalent Connext ED</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* --- [A] User Profile Display แบบใหม่ --- */}
                                <div className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-lg border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-teal-500/50 flex items-center justify-center font-bold text-teal-200 flex-shrink-0">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-300 hidden sm:block truncate">{user.email}</span>
                                    <button onClick={handleLogout} className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-md" title="ออกจากระบบ">
                                        <Icon name="LogOut" size={18}/>
                                    </button>
                                </div>
                                
                                {/* --- [B] ย้ายปุ่มตั้งค่ากลับมาที่ Header และเปลี่ยนเป็นไอคอน --- */}
                                <button onClick={() => setModal({type: 'manageRoster'})} className="p-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg" title="ทะเบียนนักเรียน"><Icon name="Users2" size={20}/></button>
                                <button onClick={() => setModal({type: 'lineNotifySettings'})} className="p-2 bg-lime-500/20 hover:bg-lime-500/30 text-lime-300 rounded-lg" title="ตั้งค่าแจ้งเตือน"><Icon name="Bell" size={20}/></button>
                                <button onClick={() => setModal({type: 'manageSubjects'})} className="p-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg" title="ตั้งค่าวิชา"><Icon name="Settings" size={20}/></button>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            <div className="lg:col-span-2 space-y-8">
                                <OverallAnalytics subjects={subjects} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">เครื่องมือหลัก (Main Tools)</h2>
                                    {/* --- [C] เอาปุ่มที่ย้ายออกไปแล้วออกจาก Grid นี้ --- */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        <AttendanceCard onClick={() => setModal({ type: 'manageAttendance' })} />
                                        <AssignmentSystemCard onClick={() => setView('subjects')} subjectCount={subjects.length} />
                                        <SavingsCard onClick={() => setModal({ type: 'manageSavings' })} />
                                        <HealthCard onClick={() => setModal({ type: 'healthRecord' })} /> {/* ++ 3. ADD CARD ++ */}
                                        <AIWorksheetFactoryCard onClick={() => setModal({ type: 'aiWorksheet' })} /> 
                                        <ClassroomToolkitCard onClick={() => setModal({ type: 'classroomToolkit' })} />
                                    </div>
                                </div>
                            </div>

                            <DashboardWidgets subjects={subjects} onStudentClick={handleStudentClick} />

                        </div>
                    </main>
                </div>
            )}
            
            {view === 'subjects' && (
                <SubjectSelectionView 
                    subjects={subjects}
                    onSubjectClick={(subject) => setModal({ type: 'selectGrade', data: subject })}
                    onClose={() => setView('dashboard')}
                />
            )}

            {/* Modal Container */}
            {modal.type === 'manageAttendance' && <AttendanceModal onClose={handleCloseModal} />}
            {modal.type === 'lineNotifySettings' && <LineNotifySettingsModal onClose={handleCloseModal} />}
            {modal.type === 'selectGrade' && <GradeSelectionModal subject={modal.data} onSelect={(subject, grade) => setModal({ type: 'classDetail', data: { subject, grade } })} onClose={handleCloseModal} />}
            {modal.type === 'classDetail' && (<ClassDetailView subject={modal.data.subject} grade={modal.data.grade} onStudentClick={handleStudentClick} onClose={handleCloseModal}/>)}
            {modal.type === 'manageSubjects' && <SubjectManagementModal subjects={subjects} onClose={handleCloseModal}/>}
            {modal.type === 'manageRoster' && <RosterManagementModal onClose={handleCloseModal} />}
            {modal.type === 'studentProfile' && <StudentProfileModal student={modal.data.student} grade={modal.data.grade} subjects={subjects} onClose={handleCloseModal} />}
            {modal.type === 'manageSavings' && <SavingsManagementModal onClose={handleCloseModal} />}
            {modal.type === 'aiWorksheet' && <AIWorksheetGeneratorModal onClose={handleCloseModal} />}
            {modal.type === 'classroomToolkit' && <ClassroomToolkitModal onClose={handleCloseModal} />}
            {modal.type === 'healthRecord' && <HealthRecordModal onClose={handleCloseModal} />} {/* ++ 4. ADD MODAL RENDER ++ */}
        </>
    );
}

export default App;