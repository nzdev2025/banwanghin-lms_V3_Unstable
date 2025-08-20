import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, setDoc, addDoc, serverTimestamp, query, orderBy, deleteDoc, writeBatch, getDocs, deleteField, limit } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// --- Main App Component ---
// This file contains all the React components for the Ban Wang Hin LMS application.
// For clarity in this self-contained example, components are defined within this single file.

// --- SVG Icons (from lucide-react) ---
// Using inline SVGs to make the component self-contained.
const Icon = ({ name, ...props }) => {
  const icons = {
    BookOpen: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    Crown: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>,
    History: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M12 8v4l2 2"/></svg>,
    User: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Users: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Users2: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="10" r="4"/><path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"/></svg>,
    Target: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    X: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    Save: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    FilePlus: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
    Loader2: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
    UserPlus: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    AlertTriangle: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    Pencil: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
    Trash2: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
    Settings: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.73l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
    Square: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>,
    SquareAsterisk: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="m8.5 14 7-4"/><path d="m8.5 10 7 4"/></svg>,
    SquareDot: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="1"/></svg>,
    SquareEqual: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 10h10"/><path d="M7 14h10"/></svg>,
    SquarePen: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>,
    SquareM: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 16V8l4 4 4-4v8"/></svg>,
    PlusCircle: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    Upload: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    Download: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    TrendingUp: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    TrendingDown: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>,
    Minus: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    BarChart2: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    Sparkles: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  };
  const IconComponent = icons[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};


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
let app;
let db;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) {
    console.error("Firebase initialization error:", e);
}


// --- App ID for Firestore Path ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'banwanghin-lms-dev';

// --- Activity Logging Helper ---
const logActivity = async (type, message, details = {}) => {
    if (!db) return;
    try {
        const logPath = `artifacts/${appId}/public/data/activity_log`;
        await addDoc(collection(db, logPath), {
            type,
            message,
            details,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};


// --- Theming and Data Constants ---
const colorThemes = {
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', shadow: 'hover:shadow-teal-500/20', text: 'text-teal-300', hex: '#2dd4bf' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', shadow: 'hover:shadow-sky-500/20', text: 'text-sky-300', hex: '#38bdf8' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', shadow: 'hover:shadow-purple-500/20', text: 'text-purple-300', hex: '#a855f7' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', shadow: 'hover:shadow-rose-500/20', text: 'text-rose-300', hex: '#f43f5e' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', shadow: 'hover:shadow-amber-500/20', text: 'text-amber-300', hex: '#f59e0b' },
    lime: { bg: 'bg-lime-500/10', border: 'border-lime-500/30', shadow: 'hover:shadow-lime-500/20', text: 'text-lime-300', hex: '#84cc16' },
};

const gradeStyles = {
    p1: { icon: 'Square', color: 'text-rose-400' },
    p2: { icon: 'SquareDot', color: 'text-orange-400' },
    p3: { icon: 'SquarePen', color: 'text-amber-400' },
    p4: { icon: 'SquareAsterisk', color: 'text-lime-400' },
    p5: { icon: 'SquareEqual', color: 'text-sky-400' },
    p6: { icon: 'SquareM', color: 'text-purple-400' },
};
const grades = Object.keys(gradeStyles);

const assignmentCategories = {
  quiz: { label: 'เก็บคะแนน', color: 'bg-sky-500/20 text-sky-300', borderColor: 'border-sky-500/30' },
  midterm: { label: 'สอบกลางภาค', color: 'bg-amber-500/20 text-amber-300', borderColor: 'border-amber-500/30' },
  final: { label: 'สอบปลายภาค', color: 'bg-rose-500/20 text-rose-300', borderColor: 'border-rose-500/30' },
};

const analyticsCardStyles = [
    { gradient: 'from-purple-500/70 to-indigo-500/70', border: 'border-purple-400' },
    { gradient: 'from-green-500/70 to-teal-500/70', border: 'border-green-400' },
    { gradient: 'from-pink-500/70 to-rose-500/70', border: 'border-pink-400' },
    { gradient: 'from-orange-500/70 to-amber-500/70', border: 'border-orange-400' },
    { gradient: 'from-sky-500/70 to-cyan-500/70', border: 'border-sky-400' },
    { gradient: 'from-red-500/70 to-orange-500/70', border: 'border-red-400' },
    { gradient: 'from-yellow-500/70 to-lime-500/70', border: 'border-yellow-400' },
    { gradient: 'from-fuchsia-500/70 to-purple-500/70', border: 'border-fuchsia-400' },
];

// --- REVISED COMPONENT: TopStudentsLeaderboard ---
const TopStudentsLeaderboard = ({ subjects }) => {
    const [topStudents, setTopStudents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const calculateTopStudents = async () => {
            if (!db || subjects.length === 0) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);

            // 1. Fetch all data in parallel
            const promises = [];
            grades.forEach(grade => {
                promises.push(getDocs(collection(db, `artifacts/${appId}/public/data/rosters/${grade}/students`)));
                subjects.forEach(subject => {
                    promises.push(getDocs(collection(db, `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}/assignments`)));
                    promises.push(getDocs(collection(db, `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}/scores`)));
                });
            });

            const results = await Promise.all(promises);

            // 2. Process data in memory
            const data = {};
            let promiseIndex = 0;

            grades.forEach(grade => {
                data[grade] = {
                    students: results[promiseIndex++].docs.map(d => ({ id: d.id, ...d.data() })),
                    subjects: {}
                };
                subjects.forEach(subject => {
                    data[grade].subjects[subject.id] = {
                        assignments: results[promiseIndex++].docs.map(d => ({ id: d.id, ...d.data() })),
                        scores: results[promiseIndex++].docs.reduce((acc, doc) => {
                            acc[doc.id] = doc.data();
                            return acc;
                        }, {}),
                    };
                });
            });

            // 3. Calculate top students
            const allTopStudents = [];
            for (const grade of grades) {
                const { students, subjects: subjectData } = data[grade];
                if (students.length === 0) continue;

                let topStudentForGrade = null;
                let maxScorePercentage = -1;

                for (const student of students) {
                    let totalEarned = 0;
                    let totalMax = 0;

                    for (const subjectId in subjectData) {
                        const { assignments, scores } = subjectData[subjectId];
                        const studentScores = scores[student.id] || {};
                        
                        assignments.forEach(assignment => {
                            totalMax += assignment.maxScore || 0;
                            totalEarned += studentScores[assignment.id] || 0;
                        });
                    }
                    
                    const scorePercentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;

                    if (scorePercentage > maxScorePercentage) {
                        maxScorePercentage = scorePercentage;
                        topStudentForGrade = {
                            ...student,
                            grade: grade,
                            score: maxScorePercentage,
                        };
                    }
                }
                if (topStudentForGrade) {
                    allTopStudents.push(topStudentForGrade);
                }
            }

            setTopStudents(allTopStudents);
            setIsLoading(false);
        };

        calculateTopStudents();
    }, [subjects]);

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4">นักเรียนยอดเยี่ยม (Top Student)</h3>
            {isLoading ? (
                <div className="space-y-3">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {grades.map((grade) => {
                        const student = topStudents.find(s => s.grade === grade);
                        return (
                            <div key={grade} className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 p-3 rounded-lg border border-amber-400/30 flex items-center gap-4">
                                <div className="bg-amber-400/20 p-2 rounded-full">
                                    <Icon name="Crown" size={24} className="text-amber-300" />
                                </div>
                                {student ? (
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-white truncate">{student.firstName} {student.lastName}</p>
                                        <p className="text-xs text-gray-400">ป.{grade.replace('p','')} - คะแนนรวม {student.score.toFixed(2)}%</p>
                                    </div>
                                ) : (
                                     <div className="flex-grow">
                                        <p className="font-bold text-gray-500">ไม่มีข้อมูล</p>
                                        <p className="text-xs text-gray-600">ป.{grade.replace('p','')}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


const RecentActivityFeed = () => {
    const [activities, setActivities] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!db) return;
        const logPath = `artifacts/${appId}/public/data/activity_log`;
        const q = query(collection(db, logPath), orderBy("timestamp", "desc"), limit(10));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activitiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActivities(activitiesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching activity log:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const timeSince = (date) => {
        if (!date || !date.toDate) return '';
        const seconds = Math.floor((new Date() - date.toDate()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)} ปีที่แล้ว`;
        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)} เดือนที่แล้ว`;
        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)} วันที่แล้ว`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)} ชั่วโมงที่แล้ว`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} นาทีที่แล้ว`;
        return "เมื่อสักครู่";
    };

    const iconMap = {
        SUBJECT: 'BookOpen',
        STUDENT: 'User',
        ASSIGNMENT: 'FilePlus',
        SCORE: 'Save',
        DEFAULT: 'History'
    };

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-full">
            <h3 className="text-lg font-bold text-white mb-4">รายการเคลื่อนไหวล่าสุด</h3>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
                </div>
            ) : activities.length === 0 ? (
                 <div className="text-center py-10 h-full flex flex-col justify-center items-center">
                    <Icon name="History" className="mx-auto text-gray-500" size={40}/>
                    <p className="mt-2 text-sm text-gray-500">ยังไม่มีรายการเคลื่อนไหว</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {activities.map(activity => {
                        const activityType = activity.type.split('_')[0];
                        const iconName = iconMap[activityType] || iconMap.DEFAULT;
                        return (
                            <li key={activity.id} className="flex items-start gap-3">
                                <div className="bg-gray-700/50 p-2 rounded-full mt-1">
                                    <Icon name={iconName} size={16} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-white leading-tight" dangerouslySetInnerHTML={{ __html: activity.message }}></p>
                                    <p className="text-xs text-gray-400 mt-0.5">{timeSince(activity.timestamp)}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};


// --- Dashboard Analytics Components ---

const OverallAnalytics = ({ subjects }) => {
    const [stats, setStats] = React.useState({ totalStudents: 0, overallAverage: 0, isLoading: true });
    const [barChartData, setBarChartData] = React.useState([]);
    const [radarChartData, setRadarChartData] = React.useState([]);

    React.useEffect(() => {
        const fetchAllStats = async () => {
            if (!db) {
                setStats(s => ({ ...s, isLoading: false }));
                return;
            }
            setStats(s => ({ ...s, isLoading: true }));

            let totalStudents = 0;
            let grandTotalScore = 0;
            let grandTotalMaxScore = 0;
            const subjectAverages = [];
            const categoryCounts = { quiz: 0, midterm: 0, final: 0 };

            const studentCountPromises = grades.map(grade => getDocs(collection(db, `artifacts/${appId}/public/data/rosters/${grade}/students`)));
            const studentCountSnapshots = await Promise.all(studentCountPromises);
            studentCountSnapshots.forEach(snap => totalStudents += snap.size);

            for (const subject of subjects) {
                let subjectTotalScore = 0;
                let subjectTotalMaxScore = 0;
                
                for (const grade of grades) {
                    const basePath = `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}`;
                    try {
                        const [assignmentsSnap, scoresSnap] = await Promise.all([
                            getDocs(collection(db, `${basePath}/assignments`)),
                            getDocs(collection(db, `${basePath}/scores`))
                        ]);
                        
                        const assignmentsMap = new Map();
                        assignmentsSnap.forEach(doc => {
                            const data = doc.data();
                            assignmentsMap.set(doc.id, data);
                            const category = data.category || 'quiz';
                            if (Object.prototype.hasOwnProperty.call(categoryCounts, category)) {
                                categoryCounts[category]++;
                            }
                        });
                        
                        scoresSnap.forEach(scoreDoc => {
                            const scores = scoreDoc.data();
                            for (const assignmentId in scores) {
                                const assignment = assignmentsMap.get(assignmentId);
                                if (assignment && typeof scores[assignmentId] === 'number') {
                                    subjectTotalScore += scores[assignmentId];
                                    subjectTotalMaxScore += assignment.maxScore;
                                }
                            }
                        });
                    } catch (e) {
                         // This can happen if a grade collection doesn't exist yet, which is fine.
                    }
                }
                
                grandTotalScore += subjectTotalScore;
                grandTotalMaxScore += subjectTotalMaxScore;

                const subjectAverage = subjectTotalMaxScore > 0 ? (subjectTotalScore / subjectTotalMaxScore) * 100 : 0;
                subjectAverages.push({
                    id: subject.id,
                    name: subject.name,
                    average: subjectAverage,
                    colorTheme: subject.colorTheme,
                });
            }

            const overallAverage = grandTotalMaxScore > 0 ? (grandTotalScore / grandTotalMaxScore) * 100 : 0;
            
            setBarChartData(subjectAverages.sort((a, b) => b.average - a.average));
            
            const radarData = [
                { type: 'เก็บคะแนน', count: categoryCounts.quiz },
                { type: 'กลางภาค', count: categoryCounts.midterm },
                { type: 'ปลายภาค', count: categoryCounts.final },
            ];
            setRadarChartData(radarData);

            setStats({ totalStudents, overallAverage, isLoading: false });
        };

        fetchAllStats();
    }, [subjects]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <KeyMetricCard icon="BookOpen" title="จำนวนวิชาทั้งหมด" value={subjects.length} isLoading={stats.isLoading} theme={colorThemes.teal} />
                 <KeyMetricCard icon="Users" title="จำนวนนักเรียนในระบบ" value={stats.totalStudents} isLoading={stats.isLoading} theme={colorThemes.sky} />
                 <KeyMetricCard icon="Target" title="ค่าเฉลี่ยคะแนนรวม" value={`${stats.overallAverage.toFixed(2)}%`} isLoading={stats.isLoading} theme={colorThemes.purple} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SubjectPerformanceChart data={barChartData} isLoading={stats.isLoading} />
                <AssignmentTypeDistributionChart data={radarChartData} isLoading={stats.isLoading} />
            </div>
        </div>
    );
};

const KeyMetricCard = ({ icon, title, value, isLoading, theme }) => {
    return (
        <div className={`p-6 rounded-2xl backdrop-blur-lg shadow-lg flex items-center gap-6 ${theme.bg} ${theme.border}`}>
            <div className={`p-4 rounded-lg bg-white/10`}>
                <Icon name={icon} size={32} className={theme.text} />
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                {isLoading ? (
                     <div className="h-8 w-24 bg-gray-700/50 rounded-md animate-pulse mt-1"></div>
                ) : (
                    <p className="text-3xl font-bold text-white">{value}</p>
                )}
            </div>
        </div>
    );
};

const SubjectPerformanceChart = ({ data, isLoading }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/80 backdrop-blur-sm border border-white/20 p-3 rounded-lg shadow-lg">
                    <p className="font-bold text-white">{`${label}`}</p>
                    <p className="text-teal-300">{`คะแนนเฉลี่ย: ${payload[0].value.toFixed(2)}%`}</p>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
             <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px] flex items-center justify-center">
                <Icon name="Loader2" className="animate-spin text-teal-400" size={40} />
             </div>
        )
    }

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px]">
            <h3 className="text-lg font-bold text-white mb-4">ประสิทธิภาพรายวิชา (คะแนนเฉลี่ย)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 60 }}>
                    <defs>
                        {Object.keys(colorThemes).map((key) => (
                            <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colorThemes[key].hex} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={colorThemes[key].hex} stopOpacity={0.2}/>
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        interval={0}
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} unit="%" />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} />
                    <Bar dataKey="average" radius={[4, 4, 0, 0]} isAnimationActive={true}>
                         {data.map((entry) => (
                            <Cell key={`cell-${entry.id}`} fill={`url(#color-${entry.colorTheme || 'teal'})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const AssignmentTypeDistributionChart = ({ data, isLoading }) => {
    if (isLoading) {
        return (
             <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px] flex items-center justify-center">
                <Icon name="Loader2" className="animate-spin text-purple-400" size={40} />
             </div>
        )
    }

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px]">
            <h3 className="text-lg font-bold text-white mb-4">สัดส่วนประเภทงาน</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis dataKey="type" tick={{ fill: '#9ca3af', fontSize: 14 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 5']} tick={false} axisLine={false} />
                    <Radar name="Assignments" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{ color: '#ffffff' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};


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
                         <TopStudentsLeaderboard subjects={subjects} />
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

// --- Child Components ---

const ClassCard = ({ subject, onClick }) => {
    const theme = colorThemes[subject.colorTheme] || colorThemes.teal;
    const iconName = subject.iconName || 'BookOpen';
    return (
        <div onClick={onClick} className={`backdrop-blur-lg rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-lg ${theme.bg} ${theme.border} ${theme.shadow}`}>
            <div className="flex justify-between items-start">
                <div className="flex-grow"><h3 className="text-xl font-bold text-white truncate">{subject.name}</h3><p className="text-sm text-gray-400">{subject.gradeRange}</p></div>
                <div className={`p-3 rounded-lg bg-white/5`}><Icon name={iconName} className={theme.text} size={24} /></div>
            </div>
            <div className="mt-6 flex items-center text-sm text-gray-300"><Icon name="User" size={16} className="mr-2"/><span>{subject.teacherName || 'ยังไม่ได้กำหนด'}</span></div>
        </div>
    );
};

const GradeSelectionModal = ({ subject, onSelect, onClose }) => {
    const [gradeCounts, setGradeCounts] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchCounts = async () => {
            if (!db) return;
            setIsLoading(true);
            const counts = {};
            const gradePromises = grades.map(async (gradeId) => {
                const studentsPath = `artifacts/${appId}/public/data/rosters/${gradeId}/students`;
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
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><Icon name="X" size={28} /></button>
                <h2 className="text-3xl font-bold text-white mb-2">เลือกชั้นเรียนสำหรับวิชา</h2>
                <p className="text-lg text-gray-300 mb-8">{subject.name}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {grades.map((gradeId, index) => {
                        const style = gradeStyles[gradeId];
                        return (
                            <button key={gradeId} onClick={() => onSelect(subject, gradeId)} className={`group w-full p-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center`}>
                                <Icon name={style.icon} className={`w-12 h-12 mb-3 transition-colors ${style.color}`} />
                                <span className="text-xl font-bold text-white">ป.{index + 1}</span>
                                <div className="flex items-center text-sm font-normal text-gray-400 mt-1">
                                    {isLoading ? <Icon name="Loader2" size={16} className="animate-spin" /> : <><Icon name="User" size={16} className="mr-1.5"/><span>{gradeCounts[gradeId] || 0} คน</span></>}
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
    const [editingSubject, setEditingSubject] = React.useState(null);

    const handleSave = async (subjectData) => {
        if (!db) return;
        const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
        try {
            if (subjectData.id) {
                const docRef = doc(db, subjectsMetaPath, subjectData.id);
                const { id, ...dataToUpdate } = subjectData;
                await setDoc(docRef, dataToUpdate, { merge: true });
                logActivity('SUBJECT_UPDATE', `แก้ไขข้อมูลวิชา: <strong>${dataToUpdate.name}</strong>`);
            } else {
                const { id, ...dataToAdd } = subjectData;
                await addDoc(collection(db, subjectsMetaPath), { ...dataToAdd, createdAt: serverTimestamp() });
                logActivity('SUBJECT_CREATE', `สร้างวิชาใหม่: <strong>${dataToAdd.name}</strong>`);
            }
            setEditingSubject(null);
        } catch (error) {
            console.error("Error saving subject:", error);
        }
    };
    
    const handleDelete = async (id) => {
        if (!db) return;
        const subjectToDelete = subjects.find(s => s.id === id);
        if (!subjectToDelete) return;
        try {
            const subjectsMetaPath = `artifacts/${appId}/public/data/subjects_meta`;
            await deleteDoc(doc(db, subjectsMetaPath, id));
            logActivity('SUBJECT_DELETE', `ลบวิชา <strong>${subjectToDelete.name}</strong>`);
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
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="X" size={28} /></button>
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
                                    <button onClick={() => setEditingSubject(sub)} className="p-2 text-sky-400 hover:bg-sky-500/20 rounded"><Icon name="Pencil" size={18}/></button>
                                    <button onClick={() => handleDelete(sub.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded"><Icon name="Trash2" size={18}/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <footer className="p-4 border-t border-white/10">
                    <button onClick={() => setEditingSubject({})} className="w-full flex items-center justify-center gap-2 bg-teal-500/80 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        <Icon name="PlusCircle" size={20}/> เพิ่มวิชาใหม่
                    </button>
                </footer>
            </div>
        </div>
    );
};

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

const AnalyticsDashboard = ({ students, assignments, scores }) => {
    const analyticsData = React.useMemo(() => {
        if (students.length === 0 || assignments.length === 0) return [];
        
        return assignments.map(assign => {
            const assignmentScores = students
                .map(student => scores[student.id]?.[assign.id])
                .filter(score => typeof score === 'number');

            if (assignmentScores.length === 0) {
                return { id: assign.id, name: assign.name, category: assign.category, avg: '-', max: '-', min: '-' };
            }

            const sum = assignmentScores.reduce((acc, score) => acc + score, 0);
            const avg = (sum / assignmentScores.length).toFixed(2);
            const max = Math.max(...assignmentScores);
            const min = Math.min(...assignmentScores);

            return { id: assign.id, name: assign.name, category: assign.category, avg, max, min };
        });
    }, [students, assignments, scores]);

    if (!analyticsData.length) return null;

    return (
        <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Icon name="BarChart2" size={20}/>ภาพรวมคะแนน</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.map((data, index) => {
                    const cardStyle = analyticsCardStyles[index % analyticsCardStyles.length];
                    return (
                        <div key={data.id} className={`bg-gradient-to-br ${cardStyle.gradient} rounded-lg border ${cardStyle.border} overflow-hidden shadow-lg`}>
                            <div className="p-4">
                                <p className="font-bold text-white truncate mb-3 text-base">{data.name}</p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className="text-xs text-gray-300 flex items-center justify-center gap-1"><Icon name="Minus" size={12}/>เฉลี่ย</p>
                                        <p className="text-2xl font-bold text-white">{data.avg}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-300 flex items-center justify-center gap-1"><Icon name="TrendingUp" size={12}/>สูงสุด</p>
                                        <p className="text-2xl font-bold text-white">{data.max}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-300 flex items-center justify-center gap-1"><Icon name="TrendingDown" size={12}/>ต่ำสุด</p>
                                        <p className="text-2xl font-bold text-white">{data.min}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const ClassDetailView = ({ subject, grade, onClose, onStudentClick }) => {
    const [students, setStudents] = React.useState([]);
    const [assignments, setAssignments] = React.useState([]);
    const [scores, setScores] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [modal, setModal] = React.useState({ type: null, data: null });
    
    const subjectBasePath = `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}`;
    const rosterBasePath = `artifacts/${appId}/public/data/rosters/${grade}`;

    React.useEffect(() => {
        if (!db) return;
        setIsLoading(true);
        const studentsQuery = query(collection(db, `${rosterBasePath}/students`), orderBy("studentNumber"));
        const assignmentsQuery = query(collection(db, `${subjectBasePath}/assignments`), orderBy("createdAt"));
        const scoresQuery = collection(db, `${subjectBasePath}/scores`);

        const unsubscribers = [
            onSnapshot(studentsQuery, (snapshot) => setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(assignmentsQuery, (snapshot) => setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))),
            onSnapshot(scoresQuery, (snapshot) => {
                const scoreData = {};
                snapshot.docs.forEach(doc => { scoreData[doc.id] = doc.data(); });
                setScores(scoreData);
                setIsLoading(false);
            })
        ];
        return () => unsubscribers.forEach(unsub => unsub());
    }, [subjectBasePath, rosterBasePath]);

    const handleScoreChange = (studentId, assignmentId, value) => {
        const newScores = JSON.parse(JSON.stringify(scores));
        if (!newScores[studentId]) newScores[studentId] = {};
        newScores[studentId][assignmentId] = value === '' ? null : parseInt(value, 10);
        setScores(newScores);
    };

    const handleSaveAll = async () => {
        if (!db) return;
        setIsSaving(true);
        try {
            const batch = writeBatch(db);
            Object.keys(scores).forEach(studentId => {
                const studentScores = scores[studentId];
                const docRef = doc(db, `${subjectBasePath}/scores`, studentId);
                batch.set(docRef, studentScores, { merge: true });
            });
            await batch.commit();
            logActivity('SCORE_UPDATE', `บันทึกคะแนนในวิชา <strong>${subject.name}</strong> (ป.${grade.replace('p','')})`);
        } catch (error) { console.error("Error saving scores:", error); } 
        finally { setIsSaving(false); }
    };

    const handleAddOrEditAssignment = async (data) => {
        if (!db) return;
        try {
            if (data.id) {
                const docRef = doc(db, `${subjectBasePath}/assignments`, data.id);
                const { id, ...dataToUpdate } = data;
                await setDoc(docRef, dataToUpdate, { merge: true });
                logActivity('ASSIGNMENT_UPDATE', `แก้ไขงาน <strong>"${data.name}"</strong> ในวิชา <strong>${subject.name}</strong>`);
            } else {
                const { id, ...dataToAdd } = data;
                await addDoc(collection(db, `${subjectBasePath}/assignments`), { ...dataToAdd, createdAt: serverTimestamp() });
                logActivity('ASSIGNMENT_CREATE', `เพิ่มงานใหม่ <strong>"${data.name}"</strong> ในวิชา <strong>${subject.name}</strong>`);
            }
            setModal({ type: null, data: null });
        } catch (error) { console.error(`Error saving assignment:`, error); }
    };

    const handleDeleteAssignment = async (id) => {
        if (!id || !db) return;
        const assignmentToDelete = assignments.find(a => a.id === id);
        if(!assignmentToDelete) return;
        try {
            await deleteDoc(doc(db, `${subjectBasePath}/assignments`, id));
            
            const scoresQuery = query(collection(db, `${subjectBasePath}/scores`));
            const scoresSnapshot = await getDocs(scoresQuery);
            const batch = writeBatch(db);
            scoresSnapshot.forEach(scoreDoc => {
                batch.update(scoreDoc.ref, { [id]: deleteField() });
            });
            await batch.commit();
            logActivity('ASSIGNMENT_DELETE', `ลบงาน <strong>"${assignmentToDelete.name}"</strong> จากวิชา <strong>${subject.name}</strong>`);
            setModal({ type: null, data: null });
        } catch (error) { console.error(`Error deleting assignment:`, error); }
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

    if (isLoading) return <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"><Icon name="Loader2" className="animate-spin text-teal-500" size={48} /></div>;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-800/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl shadow-black/50">
                    <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                        <div><h2 className="text-2xl font-bold text-white">{subject.name} - (ป.{grade.replace('p','')})</h2><p className="text-gray-400">ตารางบันทึกคะแนน</p></div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="X" size={28} /></button>
                    </header>
                    <div className="p-6 flex-grow overflow-auto">
                        <AnalyticsDashboard students={students} assignments={assignments} scores={scores} />

                        <table className="w-full min-w-[900px] text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-800/80 backdrop-blur-xl z-10">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 w-16 text-center">เลขที่</th>
                                    <th className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 min-w-[250px]">ชื่อ-สกุล</th>
                                    {assignments.map(assign => {
                                        const category = assignmentCategories[assign.category] || assignmentCategories.quiz;
                                        return (
                                            <th key={assign.id} className={`p-3 text-sm text-white border-b border-r border-gray-700 text-center w-40 group relative`}>
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <span className="font-semibold w-full truncate" title={assign.name}>{assign.name}</span>
                                                    <span className="text-xs text-gray-400 font-normal">({assign.maxScore} คะแนน)</span>
                                                    <span className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${category.color}`}>{category.label}</span>
                                                </div>
                                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setModal({ type: 'editAssignment', data: assign })} className="p-1 bg-sky-500/50 hover:bg-sky-500 rounded"><Icon name="Pencil" size={12}/></button>
                                                    <button onClick={() => setModal({ type: 'deleteConfirmation', data: { type: 'assignment', id: assign.id, name: assign.name }})} className="p-1 bg-red-500/50 hover:bg-red-500 rounded"><Icon name="Trash2" size={12}/></button>
                                                </div>
                                            </th>
                                        );
                                    })}
                                    <th className="p-3 text-sm font-semibold text-white border-b border-r border-gray-700 text-center w-28">คะแนนรวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => {
                                   const totalScore = assignments.reduce((sum, assign) => (sum + (scores[student.id]?.[assign.id] ?? 0)), 0);
                                   return (
                                    <tr key={student.id} className="hover:bg-white/5">
                                        <td className="p-2 text-center border-b border-r border-gray-700">{student.studentNumber}</td>
                                        <td className="p-2 font-medium border-b border-r border-gray-700 cursor-pointer hover:text-teal-300" onClick={() => onStudentClick(student, grade)}>{`${student.firstName} ${student.lastName}`}</td>
                                        {assignments.map(assign => (
                                            <td key={assign.id} className="p-0 border-b border-r border-gray-700">
                                                <input type="number" max={assign.maxScore} min="0" value={scores[student.id]?.[assign.id] ?? ''} onChange={(e) => handleScoreChange(student.id, assign.id, e.target.value)} className="w-full h-full bg-transparent text-center text-white p-3 outline-none focus:bg-sky-500/20" placeholder="-"/>
                                            </td>
                                        ))}
                                        <td className="p-3 text-center border-b border-r border-gray-700 font-bold text-teal-300">{totalScore}</td>
                                    </tr>
                                   );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <footer className="flex items-center justify-between p-4 border-t border-white/10 flex-shrink-0 gap-4">
                        <div className="flex gap-4">
                            <button onClick={() => setModal({ type: 'addAssignment' })} className="flex items-center gap-2 text-sm bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Icon name="FilePlus" size={16} />เพิ่มรายการเก็บคะแนน</button>
                            <button onClick={handleExportData} className="flex items-center gap-2 text-sm bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Icon name="Download" size={16} />ส่งออกคะแนน</button>
                        </div>
                        <button onClick={handleSaveAll} disabled={isSaving} className="flex items-center gap-2 text-sm bg-teal-500/80 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-teal-500/20 disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {isSaving ? <Icon name="Loader2" className="animate-spin" size={16} /> : <Icon name="Save" size={16} />}{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </footer>
                </div>
            </div>
            
            {modal.type === 'addAssignment' && <AssignmentModal onClose={() => setModal({type: null})} onSave={handleAddOrEditAssignment} />}
            {modal.type === 'editAssignment' && <AssignmentModal onClose={() => setModal({type: null})} onSave={handleAddOrEditAssignment} initialData={modal.data} />}
            {modal.type === 'deleteConfirmation' && <ConfirmationModal onClose={() => setModal({type: null})} onConfirm={() => handleDeleteAssignment(modal.data.id)} item={modal.data} />}
        </>
    );
};

const StudentModal = ({ onClose, onSave, initialData = null }) => {
    const [studentNumber, setStudentNumber] = React.useState(initialData?.studentNumber || '');
    const [firstName, setFirstName] = React.useState(initialData?.firstName || '');
    const [lastName, setLastName] = React.useState(initialData?.lastName || '');
    const isEditMode = !!initialData;
    const handleSubmit = (e) => { e.preventDefault(); if (studentNumber && firstName.trim() && lastName.trim()) { onSave({ id: initialData?.id, studentNumber: parseInt(studentNumber, 10), firstName, lastName }); }};
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">{isEditMode ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4"><label htmlFor="studentNumber" className="block text-sm font-medium text-gray-300 mb-1">เลขที่</label><input type="number" id="studentNumber" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required min="1" /></div>
                    <div className="mb-4"><label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">ชื่อจริง</label><input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
                    <div className="mb-6"><label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">นามสกุล</label><input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required /></div>
                    <div className="flex justify-end gap-4 mt-8">
                        <button type="button" onClick={onClose} className="py-2 px-4 text-gray-300 hover:text-white">ยกเลิก</button>
                        <button type="submit" className="py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors">{isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มนักเรียน'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AssignmentModal = ({ onClose, onSave, initialData = null }) => {
    const [name, setName] = React.useState(initialData?.name || '');
    const [maxScore, setMaxScore] = React.useState(initialData?.maxScore || 10);
    const [category, setCategory] = React.useState(initialData?.category || 'quiz');
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
                <Icon name="AlertTriangle" className="text-red-400 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">ยืนยันการลบ</h3>
                <p className="text-gray-300 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบ "{item.name}"? <br/><span className="text-red-400 font-semibold">การกระทำนี้ไม่สามารถย้อนกลับได้</span></p>
                <div className="flex justify-center gap-4"><button onClick={onClose} className="py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors">ยกเลิก</button><button onClick={() => { onConfirm(); onClose(); }} className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">ยืนยันการลบ</button></div>
            </div>
        </div>
    );
};

const ImportStudentsModal = ({ onClose, onImport }) => {
    const [file, setFile] = React.useState(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [error, setError] = React.useState('');
    const fileInputRef = React.useRef(null);

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
                        {isProcessing ? <Icon name="Loader2" className="animate-spin" size={16}/> : <Icon name="Upload" size={16}/>}
                        {isProcessing ? 'กำลังประมวลผล...' : 'นำเข้าข้อมูล'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const RosterManagementModal = ({ onClose }) => {
    const [selectedGrade, setSelectedGrade] = React.useState('p1');
    const [students, setStudents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modal, setModal] = React.useState({ type: null, data: null });
    const rosterBasePath = `artifacts/${appId}/public/data/rosters/${selectedGrade}`;

    React.useEffect(() => {
        if (!db || !selectedGrade) return;
        setIsLoading(true);
        const q = query(collection(db, `${rosterBasePath}/students`), orderBy("studentNumber"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching students:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [selectedGrade, rosterBasePath]);

    const handleAddOrEditStudent = async (data) => {
        if (!db) return;
        try {
            const collectionRef = collection(db, `${rosterBasePath}/students`);
            if (data.id) {
                const docRef = doc(collectionRef, data.id);
                const { id, ...dataToUpdate } = data;
                await setDoc(docRef, dataToUpdate, { merge: true });
                logActivity('STUDENT_UPDATE', `แก้ไขข้อมูลนักเรียน <strong>${data.firstName}</strong> ในชั้น ป.${selectedGrade.replace('p','')}`);
            } else {
                // This is the fix for the final bug we found.
                // The 'id' field with 'undefined' value is removed before adding the document.
                const { id, ...dataToAdd } = data;
                await addDoc(collectionRef, dataToAdd);
                logActivity('STUDENT_ADD', `เพิ่มนักเรียนใหม่ <strong>${data.firstName}</strong> เข้าชั้น ป.${selectedGrade.replace('p','')}`);
            }
            setModal({ type: null, data: null });
        } catch (error) {
            console.error("Error saving student:", error);
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!id || !db) return;
        const studentToDelete = students.find(s => s.id === id);
        if(!studentToDelete) return;
        try {
            await deleteDoc(doc(db, `${rosterBasePath}/students`, id));
            logActivity('STUDENT_DELETE', `ลบนักเรียน <strong>${studentToDelete.firstName}</strong> ออกจากชั้น ป.${selectedGrade.replace('p','')}`);
            setModal({ type: null, data: null });
        } catch (error) { console.error("Error deleting student:", error); }
    };

    const handleImportStudents = async (newStudents) => {
        if (!db) return;
        const collectionRef = collection(db, `${rosterBasePath}/students`);
        try {
            const batch = writeBatch(db);
            newStudents.forEach(student => {
                const newDocRef = doc(collectionRef);
                batch.set(newDocRef, student);
            });
            await batch.commit();
            logActivity('STUDENT_ADD', `นำเข้ารายชื่อนักเรียน <strong>${newStudents.length}</strong> คน เข้าสู่ชั้น ป.${selectedGrade.replace('p','')}`);
            setModal({ type: null });
        } catch (error) {
            console.error("Error importing students:", error);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-gray-800/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                    <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                        <h2 className="text-2xl font-bold text-white">ทะเบียนนักเรียน</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="X" size={28} /></button>
                    </header>
                    <div className="p-6 flex-shrink-0 border-b border-white/10">
                        <div className="flex items-center gap-2 flex-wrap">
                            {grades.map((gradeId, index) => (
                                <button
                                    key={gradeId}
                                    onClick={() => setSelectedGrade(gradeId)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${selectedGrade === gradeId ? 'bg-sky-500 text-white' : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'}`}
                                >
                                    ป.{index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 flex-grow overflow-auto">
                        {isLoading ? (
                             <div className="flex items-center justify-center h-full"><Icon name="Loader2" className="animate-spin text-sky-400" size={40} /></div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-white">เลขที่</th>
                                        <th className="p-3 text-sm font-semibold text-white">ชื่อ</th>
                                        <th className="p-3 text-sm font-semibold text-white">นามสกุล</th>
                                        <th className="p-3 text-sm font-semibold text-white text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id} className="border-b border-gray-700/50 hover:bg-white/5">
                                            <td className="p-3">{student.studentNumber}</td>
                                            <td className="p-3">{student.firstName}</td>
                                            <td className="p-3">{student.lastName}</td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setModal({ type: 'editStudent', data: student })} className="p-1.5 text-sky-400 hover:bg-sky-500/20 rounded"><Icon name="Pencil" size={16}/></button>
                                                    <button onClick={() => setModal({ type: 'deleteConfirmation', data: { type: 'student', id: student.id, name: `${student.firstName} ${student.lastName}` }})} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"><Icon name="Trash2" size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <footer className="flex items-center justify-end p-4 border-t border-white/10 flex-shrink-0 gap-4">
                        <button onClick={() => setModal({ type: 'addStudent' })} className="flex items-center gap-2 text-sm bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 border border-gray-600"><Icon name="UserPlus" size={16} />เพิ่มนักเรียน</button>
                        <button onClick={() => setModal({ type: 'importStudents' })} className="flex items-center gap-2 text-sm bg-teal-500/80 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"><Icon name="Upload" size={16} />นำเข้ารายชื่อ</button>
                    </footer>
                </div>
            </div>
            {modal.type === 'addStudent' && <StudentModal onClose={() => setModal({type: null})} onSave={handleAddOrEditStudent} />}
            {modal.type === 'editStudent' && <StudentModal onClose={() => setModal({type: null})} onSave={handleAddOrEditStudent} initialData={modal.data} />}
            {modal.type === 'deleteConfirmation' && <ConfirmationModal onClose={() => setModal({type: null})} onConfirm={() => handleDeleteStudent(modal.data.id)} item={modal.data} />}
            {modal.type === 'importStudents' && <ImportStudentsModal onClose={() => setModal({type: null})} onImport={handleImportStudents} />}
        </>
    );
};

// +++ NEW COMPONENT: StudentProfileModal +++
const StudentProfileModal = ({ student, grade, subjects, onClose }) => {
    const [studentScores, setStudentScores] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [aiSummary, setAiSummary] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);

    React.useEffect(() => {
        const fetchStudentData = async () => {
            if (!db) return;
            setIsLoading(true);
            const scoresData = {};
            
            for (const subject of subjects) {
                const scoresPath = `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}/scores`;
                const assignmentsPath = `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}/assignments`;
                
                const scoresDocRef = doc(db, scoresPath, student.id);
                const assignmentsCollectionRef = collection(db, assignmentsPath);

                const [scoresSnap, assignmentsSnap] = await Promise.all([
                    getDocs(collection(db, scoresPath)),
                    getDocs(collection(db, assignmentsPath))
                ]);

                const studentScoresDoc = scoresSnap.docs.find(d => d.id === student.id);

                if (studentScoresDoc) {
                    const scores = studentScoresDoc.data();
                    const assignments = assignmentsSnap.docs.map(d => ({id: d.id, ...d.data()}));
                    
                    scoresData[subject.name] = assignments.map(assign => ({
                        name: assign.name,
                        score: scores[assign.id] ?? 'N/A',
                        maxScore: assign.maxScore
                    }));
                }
            }
            setStudentScores(scoresData);
            setIsLoading(false);
        };

        fetchStudentData();
    }, [student, grade, subjects]);

    const handleGenerateSummary = async () => {
        if (!studentScores) return;
        setIsGenerating(true);
        setAiSummary('');

        let scoreDetails = "";
        for (const subjectName in studentScores) {
            const scoresText = studentScores[subjectName]
                .map(s => `${s.name}: ${s.score}/${s.maxScore}`)
                .join(', ');
            scoreDetails += `- วิชา${subjectName}: ${scoresText}\n`;
        }

        const prompt = `
            ในฐานะผู้ช่วยครูมืออาชีพ จงวิเคราะห์ข้อมูลคะแนนของนักเรียนชื่อ '${student.firstName} ${student.lastName}' ชั้น ป.${grade.replace('p', '')}'
            ข้อมูลคะแนนมีดังนี้:
            ${scoreDetails}
            
            จงสรุปภาพรวมการเรียน, ระบุจุดแข็ง, และแนะนำจุดที่ควรพัฒนา 1-2 ข้อ
            เขียนสรุปเป็นภาษาไทยที่กระชับ, เข้าใจง่าย, และให้กำลังใจสำหรับคุณครูเพื่อนำไปใช้พัฒนาการสอน
        `;

        try {
            // NOTE: Replace with your actual Gemini API endpoint and key handling
            const apiKey = "AIzaSyAO-D6S5TFjQ06J6VGgkPlAcC-qUryOOkI"; // This should be handled securely
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
            
            const payload = {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const result = await response.json();
            const summaryText = result.candidates[0].content.parts[0].text;
            setAiSummary(summaryText);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setAiSummary("เกิดข้อผิดพลาดในการเรียก AI เพื่อสรุปผล โปรดลองอีกครั้ง");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{student.firstName} {student.lastName}</h2>
                        <p className="text-gray-400">ภาพรวมผลการเรียน - ป.{grade.replace('p','')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="X" size={28} /></button>
                </header>
                <div className="p-6 flex-grow overflow-auto space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full"><Icon name="Loader2" className="animate-spin text-sky-400" size={40} /></div>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">บทวิเคราะห์โดย AI</h3>
                                <button onClick={handleGenerateSummary} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-wait">
                                    {isGenerating ? <Icon name="Loader2" className="animate-spin" size={20}/> : <Icon name="Sparkles" size={20}/>}
                                    {isGenerating ? 'กำลังวิเคราะห์...' : 'ให้ AI ช่วยวิเคราะห์'}
                                </button>
                                {aiSummary && (
                                    <div className="mt-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                                        <p className="text-white whitespace-pre-wrap">{aiSummary}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">คะแนนรายวิชา</h3>
                                <div className="space-y-4">
                                    {Object.keys(studentScores).length > 0 ? Object.entries(studentScores).map(([subjectName, scores]) => (
                                        <div key={subjectName} className="bg-gray-700/30 p-4 rounded-lg">
                                            <h4 className="font-bold text-teal-300 mb-2">{subjectName}</h4>
                                            <ul className="text-sm text-gray-300 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                                                {scores.map(s => (
                                                    <li key={s.name} className="flex justify-between">
                                                        <span>{s.name}:</span>
                                                        <span className="font-mono">{s.score}/{s.maxScore}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )) : <p className="text-gray-500">ไม่มีข้อมูลคะแนน</p>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


export default App;
