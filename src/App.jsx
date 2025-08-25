// src/App.jsx (The New, Refactored & Elegant Version)

import React from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// --- Core App Imports ---
import Icon from './icons/Icon';
import { db } from './firebase/firebase';

// --- Dashboard & Analytics Components ---
import OverallAnalytics from './components/analytics/OverallAnalytics';
import DashboardWidgets from './components/dashboard/DashboardWidgets'; // ++ IMPORT ใหม่ ++

// --- Card Components ---
import SavingsCard from './components/shared/SavingsCard';
import AssignmentSystemCard from './components/shared/AssignmentSystemCard';
import ClassroomToolkitCard from './components/shared/ClassroomToolkitCard';
import AIWorksheetFactoryCard from './components/shared/AIWorksheetFactoryCard';
import AttendanceCard from './components/shared/AttendanceCard';

// --- Modal & View Components ---
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

// --- Core App Layout ---
function App() {
    const [subjects, setSubjects] = React.useState([]);
    const [view, setView] = React.useState('dashboard');
    const [modal, setModal] = React.useState({ type: null, data: null });
    const [appId, setAppId] = React.useState('banwanghin-lms-dev');

    React.useEffect(() => {
        const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
        const q = query(collection(db, subjectsMetaPath), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setSubjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [appId]);

    const handleStudentClick = (student, grade) => setModal({ type: 'studentProfile', data: { student, grade } });
    const handleCloseModal = () => setModal({type: null});

    return (
        <>
            {view === 'dashboard' && (
                <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-teal-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
                        <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000 bottom-1/4 right-1/4"></div>
                    </div>
                    
                    <main className="relative z-10 p-4 sm:p-6 md:p-8 flex-grow w-full max-w-screen-2xl mx-auto">
                        <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                            <div><h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Command Center</h1><p className="text-gray-400">เครื่องมือสำหรับครู - โรงเรียนบ้านวังหิน</p></div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setModal({type: 'lineNotifySettings'})} className="flex items-center gap-2 bg-lime-500/20 hover:bg-lime-500/30 text-lime-300 font-bold py-2 px-4 rounded-lg"><Icon name="Bell" size={16}/>ตั้งค่าแจ้งเตือน</button>
                                <button onClick={() => setModal({type: 'manageRoster'})} className="flex items-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold py-2 px-4 rounded-lg"><Icon name="Users2" size={16}/>ทะเบียนนักเรียน</button>
                                <button onClick={() => setModal({type: 'manageSubjects'})} className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"><Icon name="Settings" size={16}/>ตั้งค่าวิชา</button>
                            </div>
                        </header>

                        {/* +++ โครงสร้าง LAYOUT ใหม่! +++ */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* === Main Content (2/3 of screen) === */}
                            <div className="lg:col-span-2 space-y-8">
                                <OverallAnalytics subjects={subjects} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">เครื่องมือหลัก (Main Tools)</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        <AttendanceCard onClick={() => setModal({ type: 'manageAttendance' })} />
                                        <AssignmentSystemCard onClick={() => setView('subjects')} subjectCount={subjects.length} />
                                        <SavingsCard onClick={() => setModal({ type: 'manageSavings' })} />                                         
                                        <AIWorksheetFactoryCard onClick={() => setModal({ type: 'aiWorksheet' })} /> 
                                        <ClassroomToolkitCard onClick={() => setModal({ type: 'classroomToolkit' })} />
                                    </div>
                                </div>
                            </div>

                            {/* === Sidebar Widgets (1/3 of screen) === */}
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

            {/* --- Modal Container --- */}
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
        </>
    );
}

export default App;