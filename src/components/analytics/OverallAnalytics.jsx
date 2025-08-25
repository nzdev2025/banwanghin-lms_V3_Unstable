// src/components/analytics/OverallAnalytics.jsx (The Absolute Final Version)
import React from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import { grades } from '../../constants/data';
import { colorThemes } from '../../constants/theme';
import KeyMetricCard from './KeyMetricCard';
// --- ลบตัวเก่าออก ---
// import SavingsActivityChart from './SavingsActivityChart';
// +++ เพิ่มตัวใหม่ล่าสุดเข้ามา +++
import SavingsGlowChart from './SavingsGlowChart';
import SubjectPerformanceChart from './SubjectPerformanceChart';


const OverallAnalytics = ({ subjects }) => {
    // ... ไม่ต้องแก้ไขโค้ดส่วน State และ useEffect ...
    const [stats, setStats] = React.useState({ totalStudents: 0, overallAverage: 0, isLoading: true });
    const [performanceData, setPerformanceData] = React.useState([]);

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
                        assignmentsSnap.forEach(doc => assignmentsMap.set(doc.id, doc.data()));

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
                    } catch (e) { /* Ignore errors */ }
                }

                const subjectAverage = subjectTotalMaxScore > 0 ? (subjectTotalScore / subjectTotalMaxScore) * 100 : 0;
                
                const themeKey = subject.colorTheme || 'teal';
                subjectAverages.push({
                    id: subject.id,
                    name: subject.name,
                    average: subjectAverage,
                    colorTheme: { key: themeKey, ...colorThemes[themeKey] },
                });
            }

            const overallAverage = grandTotalMaxScore > 0 ? (grandTotalScore / grandTotalMaxScore) * 100 : 0;

            setPerformanceData(subjectAverages.sort((a, b) => b.average - a.average));
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
                <SubjectPerformanceChart data={performanceData} isLoading={stats.isLoading} />
                {/* --- เรียกใช้กราฟเรืองแสงตัวใหม่ --- */}
                <SavingsGlowChart />
            </div>
        </div>
    );
};

export default OverallAnalytics;