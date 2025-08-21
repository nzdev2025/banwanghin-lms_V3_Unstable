import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, appId } from './firebase.js';
import ClassCard from './components/ClassCard.jsx';
import GradeSelectionModal from './components/GradeSelectionModal.jsx';
import SubjectManagementModal from './components/SubjectManagementModal.jsx';
import ClassDetailView from './components/ClassDetailView.jsx';

// === MAIN APP COMPONENT ===
// This is the root component that orchestrates the entire application.
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

    // Handlers for managing modal states.
    const handleCardClick = (subject) => setModal({ type: 'selectGrade', data: subject });
    const handleGradeSelect = (subject, grade) => setModal({ type: 'classDetail', data: { subject, grade } });
    const handleCloseModal = () => setModal({type: null});

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
            {/* Background animated blobs for aesthetic appeal */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-teal-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
                <div className="absolute w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000 bottom-1/4 right-1/4"></div>
            </div>
            
            <main className="relative z-10 p-4 sm:p-6 md:p-8">
                <header className="flex justify-between items-center mb-8">
                    <div><h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1><p className="text-gray-400">ภาพรวมรายวิชา - โรงเรียนบ้านวังหิน</p></div>
                    <button onClick={() => setModal({type: 'manageSubjects'})} className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Settings size={16}/>จัดการวิชา</button>
                </header>
                
                {/* Grid for displaying subject cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subjects.map((subject) => (<ClassCard key={subject.id} subject={subject} onClick={() => handleCardClick(subject)}/>))}
                </div>
            </main>
            
            {/* Conditional rendering of modals based on the 'modal' state */}
            {modal.type === 'selectGrade' && <GradeSelectionModal subject={modal.data} onSelect={handleGradeSelect} onClose={handleCloseModal} />}
            {modal.type === 'classDetail' && (<ClassDetailView subject={modal.data.subject} grade={modal.data.grade} onClose={handleCloseModal}/>)}
            {modal.type === 'manageSubjects' && <SubjectManagementModal subjects={subjects} onClose={handleCloseModal}/>}
        </div>
    );
}

