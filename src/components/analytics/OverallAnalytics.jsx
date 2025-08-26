// src/components/analytics/OverallAnalytics.jsx (The "Perfect Layout" Final Version)
import React from 'react';
import { getDocs, collection, collectionGroup } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import { grades } from '../../constants/data';
import { colorThemes } from '../../constants/theme';
import KeyMetricCard from './KeyMetricCard';
import SavingsGlowChart from './SavingsGlowChart';
import SubjectPerformanceChart from './SubjectPerformanceChart';


const OverallAnalytics = ({ subjects }) => {
    const [stats, setStats] = React.useState({ 
        totalStudents: 0, 
        overallAverage: 0, 
        totalDeposits: 0,
        totalWithdrawals: 0,
        isLoading: true 
    });
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
            let totalDeposits = 0;
            let totalWithdrawals = 0;
            const subjectAverages = [];

            try {
                const transactionsQuery = collectionGroup(db, 'transactions');
                const querySnapshot = await getDocs(transactionsQuery);
                
                querySnapshot.forEach(doc => {
                    if (doc.ref.path.startsWith(`artifacts/${appId}/public/data/savings`)) {
                        const transaction = doc.data();
                        if (transaction.type === 'deposit') {
                            totalDeposits += transaction.amount;
                        } else if (transaction.type === 'withdraw') {
                            totalWithdrawals += transaction.amount;
                        }
                    }
                });
            } catch (error) {
                console.error("Error fetching savings data:", error);
            }

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
                
                grandTotalScore += subjectTotalScore;
                grandTotalMaxScore += subjectTotalMaxScore;

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
            setStats({ 
                totalStudents, 
                overallAverage, 
                totalDeposits, 
                totalWithdrawals, 
                isLoading: false 
            });
        };

        fetchAllStats();
    }, [subjects]);


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                 {/* --- [!] เพิ่ม valueAlign="center" ให้การ์ด 2 ใบแรก --- */}
                 <KeyMetricCard icon="BookOpen" title="จำนวนวิชาทั้งหมด" value={subjects.length} isLoading={stats.isLoading} theme={colorThemes.teal} valueAlign="center" />
                 <KeyMetricCard icon="Users" title="จำนวนนักเรียนในระบบ" value={stats.totalStudents} isLoading={stats.isLoading} theme={colorThemes.sky} valueAlign="center" />
                 
                 {/* --- การ์ดที่เหลือจะใช้ค่า default 'right' (ชิดขวา) เหมือนเดิม --- */}
                 <KeyMetricCard icon="Target" title="ค่าเฉลี่ยคะแนนรวม" value={`${stats.overallAverage.toFixed(2)}%`} isLoading={stats.isLoading} theme={colorThemes.purple} />
                 <KeyMetricCard 
                    icon="Wallet" 
                    title="ยอดเงินฝากทั้งหมด" 
                    value={`${stats.totalDeposits.toLocaleString('th-TH')} ฿`} 
                    isLoading={stats.isLoading} 
                    theme={colorThemes.emerald} 
                 />
                 <KeyMetricCard 
                    icon="TrendingDown" 
                    title="ยอดเงินถอนทั้งหมด" 
                    value={`${stats.totalWithdrawals.toLocaleString('th-TH')} ฿`} 
                    isLoading={stats.isLoading} 
                    theme={colorThemes.rose} 
                 />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SubjectPerformanceChart data={performanceData} isLoading={stats.isLoading} />
                <SavingsGlowChart />
            </div>
        </div>
    );
};

export default OverallAnalytics;
