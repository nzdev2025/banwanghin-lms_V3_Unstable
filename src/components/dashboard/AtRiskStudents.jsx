import React from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import { grades } from '../../constants/data';
import Icon from '../../icons/Icon';

const AtRiskStudents = ({ subjects, onStudentClick }) => {
    const [atRiskStudents, setAtRiskStudents] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const findAtRiskStudents = async () => {
            if (!db || subjects.length === 0) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);

            const allStudentsData = new Map();
            const allAssignments = new Map();

            // Fetch all data first
            for (const grade of grades) {
                const studentsSnap = await getDocs(collection(db, `artifacts/${appId}/public/data/rosters/${grade}/students`));
                studentsSnap.forEach(doc => {
                    if (!allStudentsData.has(doc.id)) {
                        allStudentsData.set(doc.id, { ...doc.data(), id: doc.id, grade });
                    }
                });

                for (const subject of subjects) {
                    const assignmentsSnap = await getDocs(collection(db, `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}/assignments`));
                    assignmentsSnap.forEach(doc => {
                        if (!allAssignments.has(doc.id)) {
                            allAssignments.set(doc.id, { ...doc.data(), subjectName: subject.name });
                        }
                    });

                    const scoresSnap = await getDocs(collection(db, `artifacts/${appId}/public/data/subjects/${subject.id}/grades/${grade}/scores`));
                    scoresSnap.forEach(scoreDoc => {
                        const student = allStudentsData.get(scoreDoc.id);
                        if (student) {
                            if (!student.scores) student.scores = {};
                            student.scores = { ...student.scores, ...scoreDoc.data() };
                        }
                    });
                }
            }

            // Process data to find at-risk students
            const atRisk = [];
            allStudentsData.forEach(student => {
                let lowScoreCount = 0;
                if (student.scores) {
                    for (const assignmentId in student.scores) {
                        const assignment = allAssignments.get(assignmentId);
                        const score = student.scores[assignmentId];
                        if (assignment && typeof score === 'number') {
                            if ((score / assignment.maxScore) < 0.5) { // less than 50%
                                lowScoreCount++;
                            }
                        }
                    }
                }
                if (lowScoreCount >= 2) { // At-risk if 2 or more scores are below 50%
                    atRisk.push({ ...student, lowScoreCount });
                }
            });

            setAtRiskStudents(atRisk);
            setIsLoading(false);
        };

        findAtRiskStudents();
    }, [subjects]);

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-rose-900/20 border border-rose-500/30">
            <h3 className="text-lg font-bold text-white mb-4">นักเรียนที่น่าเป็นห่วง</h3>
            {isLoading ? (
                <div className="flex items-center justify-center h-full py-4"><Icon name="Loader2" className="animate-spin text-rose-400" size={32} /></div>
            ) : atRiskStudents.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-rose-200/80">ยอดเยี่ยม! ไม่มีนักเรียนที่เข้าเกณฑ์น่าเป็นห่วงในขณะนี้</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {atRiskStudents.map(student => (
                        <li key={student.id} onClick={() => onStudentClick(student, student.grade)} className="bg-rose-500/10 hover:bg-rose-500/20 p-3 rounded-lg flex items-center gap-4 cursor-pointer transition-colors">
                            <div className="bg-rose-500/20 p-2 rounded-full">
                                <Icon name="AlertTriangle" size={20} className="text-rose-300" />
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="font-bold text-white truncate">{student.firstName} {student.lastName}</p>
                                <p className="text-xs text-rose-300/80">ป.{student.grade.replace('p','')} - มี {student.lowScoreCount} รายการที่คะแนนต่ำกว่า 50%</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AtRiskStudents;
