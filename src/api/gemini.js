export const callGeminiAPI = async (prompt) => {
    // ***************************************************************
    // ** สำคัญ: กรุณาใส่ API Key ของคุณที่นี่ **
    // ***************************************************************
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
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
    if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Invalid response structure from API");
    }
};
