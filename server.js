const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve static assets
app.use(express.static(__dirname));

// Healthcheck
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

// Proxy endpoints (optional): Only used if you set GEMINI_API_KEY env var when starting server
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

app.post('/api/quiz-questions', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
        const { domain } = req.body || {};
        const prompt = `Create 20 multiple choice questions for a ${domain} developer interview.\nFor each: {text, options[4], correctAnswer, difficulty: easy|medium|hard}. Return an array of exactly 20.`;
        const resp = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, topK: 1, topP: 1 } })
        });
        if (!resp.ok) return res.status(resp.status).json({ error: `Upstream error ${resp.status}` });
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const m = text.match(/\[[\s\S]*\]/);
        if (!m) return res.status(502).json({ error: 'Invalid AI response' });
        const questions = JSON.parse(m[0]);
        res.json({ questions });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/coding-question', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
        const { domain } = req.body || {};
        const prompt = `Create 1 coding question for a ${domain} role (frontend/web designer should prefer DOM/array/object problems for in-browser JS).\nReturn JSON array with ONE object: {id, description, functionName, parameters[], starterCode, sampleInput, sampleOutput}.`;
        const resp = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, topK: 1, topP: 1 } })
        });
        if (!resp.ok) return res.status(resp.status).json({ error: `Upstream error ${resp.status}` });
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const m = text.match(/\[[\s\S]*\]/);
        if (!m) return res.status(502).json({ error: 'Invalid AI response' });
        const arr = JSON.parse(m[0]);
        res.json({ question: Array.isArray(arr) ? arr[0] : arr });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// SPA fallback
// Use regex for catch-all to avoid path-to-regexp error
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});

