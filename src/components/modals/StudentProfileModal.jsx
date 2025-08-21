import React from 'react';
import { getDocs, collection, doc } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import { callGeminiAPI } from '../../api/gemini';
import Icon from '../../icons/Icon';

// +++ NEW COMPONENT: StudentProfileModal +++
const StudentProfileModal = ({ student, grade, subjects, onClose }) => {
    const [studentScores, setStudentScores] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [aiSummary, setAiSummary] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [parentComment, setParentComment] = React.useState('');
    const [isGeneratingParentComment, setIsGeneratingParentComment] = React.useState(false);
    const [isCopied, setIsCopied] = React.useState(false);

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
        setParentComment('');

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
            const summaryText = await callGeminiAPI(prompt);
            setAiSummary(summaryText);
        } catch (error) {
            console.error("Error calling Gemini API for summary:", error);
            setAiSummary("เกิดข้อผิดพลาดในการเรียก AI เพื่อสรุปผล โปรดลองอีกครั้ง");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateParentComment = async () => {
        if (!aiSummary) return;
        setIsGeneratingParentComment(true);
        setParentComment('');

        const prompt = `
            ในฐานะครูที่ปรึกษาที่เชี่ยวชาญด้านการสื่อสารเชิงบวก จงนำบทวิเคราะห์ผลการเรียนต่อไปนี้:
            "${aiSummary}"

            แล้วเรียบเรียงใหม่เป็น "ข้อความคอมเมนต์สำหรับผู้ปกครอง" โดยใช้หลักการต่อไปนี้:
            1. ใช้ภาษาที่เป็นทางการ สุภาพ และเข้าใจง่ายสำหรับผู้ปกครอง
            2. ขึ้นต้นด้วยจุดแข็งหรือด้านที่น่าชื่นชมของนักเรียนเสมอ
            3. กล่าวถึงจุดที่ควรพัฒนาในเชิง "ข้อเสนอแนะเพื่อส่งเสริม" ไม่ใช่ "ข้อตำหนิ"
            4. จบด้วยประโยคที่แสดงถึงความร่วมมือระหว่างโรงเรียนและผู้ปกครอง
            5. มีความยาวไม่เกิน 3-4 ประโยค
        `;

        try {
            const commentText = await callGeminiAPI(prompt);
            setParentComment(commentText);
        } catch (error) {
            console.error("Error calling Gemini API for parent comment:", error);
            setParentComment("เกิดข้อผิดพลาดในการสร้างคอมเมนต์สำหรับผู้ปกครอง โปรดลองอีกครั้ง");
        } finally {
            setIsGeneratingParentComment(false);
        }
    };

    const handleCopy = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
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
                                    <div className="mt-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-300 text-sm mb-2">สรุปสำหรับคุณครู:</h4>
                                            <p className="text-white whitespace-pre-wrap">{aiSummary}</p>
                                        </div>

                                        <button onClick={handleGenerateParentComment} disabled={isGeneratingParentComment || isGenerating} className="w-full flex items-center justify-center gap-2 bg-teal-500/80 hover:bg-teal-500 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-wait">
                                            {isGeneratingParentComment ? <Icon name="Loader2" className="animate-spin" size={20}/> : <Icon name="ClipboardSignature" size={20}/>}
                                            {isGeneratingParentComment ? 'กำลังเรียบเรียง...' : 'สร้างคอมเมนต์สำหรับผู้ปกครอง'}
                                        </button>

                                        {parentComment && (
                                            <div className="pt-4 border-t border-gray-700">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-semibold text-gray-300 text-sm">ข้อความสำหรับผู้ปกครอง:</h4>
                                                    <button onClick={() => handleCopy(parentComment)} className="text-gray-400 hover:text-white">
                                                        {isCopied ? <Icon name="Check" size={18} className="text-green-400"/> : <Icon name="Copy" size={18}/>}
                                                    </button>
                                                </div>
                                                <p className="text-white whitespace-pre-wrap">{parentComment}</p>
                                            </div>
                                        )}
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

export default StudentProfileModal;
