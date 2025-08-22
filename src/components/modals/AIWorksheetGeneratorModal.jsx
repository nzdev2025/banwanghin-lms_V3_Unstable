// src/components/modals/AIWorksheetGeneratorModal.jsx (The Final Centered Version)
import React from 'react';
import Icon from '../../icons/Icon';
import { callGeminiAPI } from '../../api/gemini';
import WorksheetRenderer from '../worksheet/WorksheetRenderer';

const AIWorksheetGeneratorModal = ({ onClose }) => {
    const [formData, setFormData] = React.useState({
        docType: 'worksheet',
        topic: '',
        gradeLevel: 'ประถมศึกษาปีที่ 1',
        questionType: 'อัตนัย (คำถามสั้นๆ)',
        numQuestions: 5,
        specialInstructions: '',
    });
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [worksheetData, setWorksheetData] = React.useState(null);
    const [error, setError] = React.useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getPromptForQuestionType = () => {
        const { questionType, numQuestions } = formData;
        
        const createQuestionExample = (type, text, options = '') => `{ "id": 1, "text": "${text}"${options} }`;
        let questionExample = '';
        let sectionType = 'unknown';

        if (questionType.startsWith('ปรนัย')) {
            sectionType = 'multiple_choice';
            const numOptions = questionType.includes('4') ? 4 : 3;
            const optionsExample = ['"ก. [ตัวเลือก]"', '"ข. [ตัวเลือก]"', '"ค. [ตัวเลือก]"'];
            if (numOptions === 4) optionsExample.push('"ง. [ตัวเลือก]"');
            questionExample = createQuestionExample(sectionType, '[คำถามข้อที่ 1]', `, "options": [${optionsExample.join(', ')}]`);
        } else if (questionType === 'เติมคำในช่องว่าง') {
            sectionType = 'fill_in_the_blanks';
            return `{
                "type": "fill_in_the_blanks",
                "instruction": "จงเติมคำหรือข้อความลงในช่องว่างให้สมบูรณ์",
                "content": ["[สร้างประโยคที่มีช่องว่าง ___ ข้อที่ 1]", "[สร้างประโยคที่มีช่องว่าง ___ ข้อที่ 2]"]
            }`;
        } else if (questionType === 'ถูก-ผิด') {
            sectionType = 'true_false';
            questionExample = createQuestionExample(sectionType, '[สร้างข้อความสำหรับให้นักเรียนตัดสินว่าถูกหรือผิด]');
        } else if (questionType === 'อัตนัย (คำถามสั้นๆ)') {
            sectionType = 'short_answer';
            questionExample = createQuestionExample(sectionType, '[สร้างคำถามปลายเปิดที่ให้นักเรียนเขียนตอบสั้นๆ]');
        }

        return `{
            "type": "${sectionType}",
            "instruction": "[สร้างคำชี้แจงที่เหมาะสมกับประเภทคำถาม]",
            "questions": [ ${questionExample} ]
        }`;
    };

    const handleGenerate = async () => {
        if (!formData.topic) { alert("กรุณาใส่หัวข้อหลักก่อนครับ"); return; }
        setIsGenerating(true);
        setWorksheetData(null);
        setError('');
        let result = '';
        const questionStructure = getPromptForQuestionType();
        const prompt = `คุณคือ AI ผู้เชี่ยวชาญด้านการออกแบบสื่อการสอน... **โจทย์:** ... "จำนวนคำถามที่ต้องการ": ${formData.numQuestions} ข้อ ... **โครงสร้าง JSON ที่ต้องการ:** ... "sections": [ ${questionStructure} ] ... **กฎ:** ... 2. **ต้องสร้างคำถาม...ให้มีจำนวนเท่ากับ "จำนวนคำถามที่ต้องการ" (${formData.numQuestions} ข้อ) อย่างเคร่งครัด** ... 3. **ต้องสร้าง section ให้มี "type" ตรงกับที่ระบุ...เท่านั้น** ...`;

        try {
            result = await callGeminiAPI(prompt);
            const jsonString = result.match(/\{[\s\S]*\}/)[0];
            const parsedData = JSON.parse(jsonString);
            setWorksheetData(parsedData);
        } catch (e) {
            console.error("Failed to parse AI response:", e, "Raw response:", result);
            setError("AI ไม่สามารถสร้างข้อมูลได้ อาจเกิดจากข้อผิดพลาดชั่วคราว กรุณารอ 1 นาทีแล้วลองอีกครั้ง");
            setWorksheetData(null);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handlePrint = () => { window.print(); };
    const placeholders = { worksheet: { title: "ใบงานเรื่อง", topic: "เช่น ส่วนประกอบของพืช..." }, exam: { title: "แบบทดสอบวัดผล", topic: "เช่น ประวัติศาสตร์สุโขทัย..." } };
    const currentTexts = placeholders[formData.docType];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 print:p-0 print:bg-white print:block" onClick={onClose}>
             <div className="bg-gray-800 border border-purple-500/50 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl shadow-black/50 print:border-none print:shadow-none print:w-full print:h-auto print:block" onClick={(e) => e.stopPropagation()}>
                 <header className="flex items-center justify-between p-4 border-b border-white/10 print:hidden">
                     <div className="flex items-center gap-3"><Icon name="FileText" className="text-purple-300" /><h3 className="text-xl font-bold text-white">AI Document Factory</h3></div>
                     <button onClick={onClose} className="text-gray-400 hover:text-white"><Icon name="X" size={24} /></button>
                 </header>

                 <div className="flex-grow flex p-4 gap-4 overflow-hidden print:p-0 print:block">
                     <div className="w-1/3 flex flex-col gap-4 p-4 bg-gray-900/50 rounded-lg overflow-y-auto print:hidden">
                         <div><label className="block text-sm font-medium text-gray-300 mb-2">1. เลือกประเภทเอกสาร</label><div className="flex bg-gray-700/50 rounded-lg p-1"><button onClick={() => setFormData(p => ({...p, docType: 'worksheet'}))} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${formData.docType === 'worksheet' ? 'bg-purple-600 text-white' : 'text-gray-300'}`}>ใบงาน</button><button onClick={() => setFormData(p => ({...p, docType: 'exam'}))} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${formData.docType === 'exam' ? 'bg-purple-600 text-white' : 'text-gray-300'}`}>ข้อสอบ</button></div></div>
                         <div><label className="block text-sm font-medium text-gray-300 mb-1">2. หัวข้อหลัก</label><input type="text" name="topic" value={formData.topic} onChange={handleInputChange} placeholder={currentTexts.topic} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" /></div>
                         <div><label className="block text-sm font-medium text-gray-300 mb-1">3. ระดับชั้น</label><select name="gradeLevel" value={formData.gradeLevel} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">{['ประถมศึกษาปีที่ 1', 'ประถมศึกษาปีที่ 2', 'ประถมศึกษาปีที่ 3', 'ประถมศึกษาปีที่ 4', 'ประถมศึกษาปีที่ 5', 'ประถมศึกษาปีที่ 6'].map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                         <div><label className="block text-sm font-medium text-gray-300 mb-1">4. ประเภทคำถาม</label><select name="questionType" value={formData.questionType} onChange={handleInputChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white">{['เติมคำในช่องว่าง', 'ปรนัย 3 ตัวเลือก', 'ปรนัย 4 ตัวเลือก', 'ถูก-ผิด', 'อัตนัย (คำถามสั้นๆ)'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                         <div><label className="block text-sm font-medium text-gray-300 mb-1">5. จำนวนข้อ</label><input type="number" name="numQuestions" value={formData.numQuestions} onChange={handleInputChange} min="1" max="50" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white" /></div>
                         <div><label className="block text-sm font-medium text-gray-300 mb-1">6. คำสั่งพิเศษ (Optional)</label><textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleInputChange} placeholder="เช่น เน้นการคำนวณ, มีโจทย์ปัญหา..." rows="3" className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm"></textarea></div>
                         <button onClick={handleGenerate} disabled={isGenerating || !formData.topic} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mt-auto disabled:opacity-50 disabled:cursor-wait">{isGenerating ? <Icon name="Loader2" className="animate-spin" size={20}/> : <Icon name="Sparkles" size={20}/>}{isGenerating ? 'กำลังสร้าง...' : 'สร้างเอกสาร'}</button>
                     </div>
                     <div className="w-2/3 bg-gray-900/50 p-4 rounded-lg overflow-y-auto print:w-full print:h-auto print:p-0 print:overflow-visible print:bg-transparent">
                        <div id="a4-preview-area" className="a4-paper bg-white text-black p-12 shadow-lg mx-auto print:shadow-none print:mx-0 print:p-0 font-sarabun">
                            {/* **FIX: เปลี่ยนจาก text-center เป็น flexbox เพื่อความแม่นยำ** */}
                            <div className="school-header flex flex-col items-center mb-6">
                                <h1 className="text-xl font-bold">โรงเรียนบ้านวังหิน</h1>
                                <h2 className="text-lg">{worksheetData?.title || currentTexts.title}</h2>
                            </div>
                            <div className="info-section flex flex-wrap justify-between items-center border-t border-b border-gray-400 py-2 my-4 text-base gap-4">
                                <span>วิชา: {worksheetData?.subject || '................................'}</span>
                                <div className="flex flex-wrap gap-x-6">
                                    <span>ชื่อ: ............................................</span>
                                    <span>ชั้น: ...........</span>
                                </div>
                            </div>
                            <div className="content-area mt-6">{isGenerating && <div className="text-center text-gray-500 flex items-center justify-center h-48"><Icon name="Loader2" className="animate-spin mr-2" /> กำลังสร้างสรรค์ผลงาน...</div>}{error && <p className="text-center text-red-500 p-4 bg-red-500/10 rounded-lg">{error}</p>}{worksheetData && <WorksheetRenderer worksheetData={worksheetData} />}{!worksheetData && !isGenerating && !error && <div className="text-center text-gray-400 h-48 flex items-center justify-center">ผลลัพธ์จาก AI จะแสดงที่นี่...</div>}</div>
                        </div>
                     </div>
                 </div>
                  <footer className="p-3 border-t border-white/10 flex justify-end print:hidden">
                      <button onClick={handlePrint} className="flex items-center gap-2 py-2 px-6 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-colors">
                         <Icon name="Printer" size={18} /> พิมพ์
                     </button>
                 </footer>
             </div>
        </div>
    );
};

export default AIWorksheetGeneratorModal;