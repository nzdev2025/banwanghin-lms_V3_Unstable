import React from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import { grades } from '../../constants/data';
import Icon from '../../icons/Icon';

const TopStudentsLeaderboard = ({ subjects, onStudentClick }) => {
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
                            <div
                                key={grade}
                                onClick={student ? () => onStudentClick(student, student.grade) : undefined}
                                className={`bg-gradient-to-r from-amber-500/20 to-yellow-500/10 p-3 rounded-lg border border-amber-400/30 flex items-center gap-4 transition-colors ${student ? 'cursor-pointer hover:bg-amber-500/30' : ''}`}
                            >
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

export default TopStudentsLeaderboard;
