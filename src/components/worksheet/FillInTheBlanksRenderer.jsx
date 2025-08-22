// src/components/worksheet/FillInTheBlanksRenderer.jsx (V3 - Syntax Fixed)
import React from 'react';

const FillInTheBlanksRenderer = ({ data, sectionNumber }) => {
    const createMarkup = (text) => {
        if (typeof text !== 'string') {
            console.warn("Received non-string content:", text);
            return '';
        }
        return text.replace(/___/g, 
            '<span class="inline-block border-b-2 border-dotted border-black w-40 mx-1 align-bottom"></span>'
        );
    };

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">ตอนที่ {sectionNumber}: {data.instruction || 'เติมคำในช่องว่างให้สมบูรณ์'}</h3>
            <div className="text-base leading-relaxed space-y-3">
                {Array.isArray(data.content) ? (
                    data.content.map((line, index) => (
                        <p key={index} dangerouslySetInnerHTML={{ __html: createMarkup(line) }} />
                    ))
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: createMarkup(data.content) }} />
                )}
            </div>
        </div> // <-- **FIX: เพิ่ม </div> ปิดที่ขาดหายไปตรงนี้**
    );
};

export default FillInTheBlanksRenderer;