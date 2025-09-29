import { fetchCodingQuestions, evaluateCode } from './api.js';

class CodingAssessment {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.submittedAnswers = new Set();
        this.editor = null;
        this.language = 'javascript';
        this.autoRunTimer = null;
        this.autoSaveTimer = null;
    }

    // Initialize coding assessment
    async initializeAssessment(domain) {
        this.questions = await fetchCodingQuestions(domain);
        // Keep only one question if API returns more
        if (Array.isArray(this.questions)) {
            this.questions = this.questions.slice(0, 1);
        }
        await this.displayQuestion(0);
        this.setupEventListeners();
    }

    // Setup event listeners for coding interface
    setupEventListeners() {
        document.getElementById('question1').addEventListener('click', () => this.displayQuestion(0));
        document.getElementById('runCode').addEventListener('click', () => this.runCode());
        document.getElementById('submitCode').addEventListener('click', () => this.submitCode());
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                // Save current code under old language before switching
                this.saveCurrentCode(this.getCurrentCode());
                this.language = e.target.value;
                this.setEditorLanguage(this.language);
                this.restoreCodeForCurrent();
                this.scheduleAutoRun();
            });
        }
    }

    // Display selected coding question
    async displayQuestion(index) {
        if (index >= this.questions.length) return;

        // Save current code before switching away
        if (this.editor) {
            this.saveCurrentCode(this.getCurrentCode());
        }

        this.currentQuestionIndex = index;
        const question = this.questions[index];

        // Update question buttons state
        document.querySelectorAll('.coding-question-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
            if (this.submittedAnswers.has(i)) {
                btn.disabled = true;
            }
        });

        // Display question details
        document.getElementById('codingQuestionDesc').textContent = question.description;
        const prettyInput = typeof question.sampleInput === 'string' ? question.sampleInput : JSON.stringify(question.sampleInput, null, 2);
        const prettyOutput = typeof question.sampleOutput === 'string' ? question.sampleOutput : JSON.stringify(question.sampleOutput, null, 2);
        document.getElementById('inputExample').innerHTML = `<strong>Sample Input:</strong><br><pre>${escapeHtml(prettyInput)}</pre>`;
        document.getElementById('outputExample').innerHTML = `<strong>Expected Output:</strong><br><pre>${escapeHtml(prettyOutput)}</pre>`;

        // Init editor if needed then restore code
        await this.ensureEditor();
        this.restoreCodeForCurrent(question);
        this.scheduleAutoRun();
    }

    // Run code with test cases
    async runCode() {
        const code = this.getCurrentCode();
        if (!code.trim()) {
            alert('Please write some code before running!');
            return;
        }

        try {
            const question = this.questions[this.currentQuestionIndex];
            if (this.language !== 'javascript') {
                this.renderTestResults({ passedTests: 0, totalTests: 0, cases: [], error: 'Only JavaScript can be executed in-browser. Switch to JavaScript or submit code as-is.', output: 'Language not supported' });
                return;
            }
            const result = await evaluateCode(code, question);
            this.renderTestResults(result);
            if (result && Array.isArray(result.cases)) {
                localStorage.setItem('lastRunCases', JSON.stringify(result.cases));
                if (typeof result.avgRuntimeMs !== 'undefined') {
                    localStorage.setItem('lastRunAvgMs', String(result.avgRuntimeMs));
                }
            }
        } catch (error) {
            this.renderTestResults({ passedTests: 0, totalTests: 0, cases: [], error: error.message, output: 'Error' });
        }
    }

    // Submit code for evaluation
    async submitCode() {
        const code = this.getCurrentCode();
        if (!code.trim()) {
            alert('Please write some code before submitting!');
            return;
        }

        try {
            const question = this.questions[this.currentQuestionIndex];
            const result = await evaluateCode(code, question);
            this.renderTestResults(result);
            // Store code in localStorage
            this.saveCurrentCode(code);
            
            // Update score
            if (result && result.passedTests === result.totalTests && result.totalTests > 0) {
                this.score++;
            }

            // Mark question as submitted
            this.submittedAnswers.add(this.currentQuestionIndex);
            document.querySelectorAll('.coding-question-btn')[this.currentQuestionIndex].disabled = true;

            // Check if all questions are submitted
            if (this.submittedAnswers.size === this.questions.length || 
                (this.submittedAnswers.has(0) && confirm('Would you like to submit the assessment?'))) {
                this.endAssessment();
            }
        } catch (error) {
            this.renderTestResults({ passedTests: 0, totalTests: 0, cases: [], error: error.message, output: 'Error' });
        }
    }

    // End assessment and show results
    endAssessment() {
        localStorage.setItem('codingScore', this.score);
        
        // Show results screen
        document.getElementById('codingScreen').classList.add('hidden');
        document.getElementById('resultScreen').classList.remove('hidden');
        
        // Display results
        this.displayResults();

        // Bind download
        this.bindDownloadReport();
        this.bindDownloadPDF();
    }

    // Display final results
    displayResults() {
        const quizScore = parseInt(localStorage.getItem('quizScore')) || 0;
        const candidateInfo = JSON.parse(localStorage.getItem('candidateInfo')) || {};

        document.getElementById('resultName').textContent = candidateInfo.name || 'N/A';
        document.getElementById('resultDomain').textContent = candidateInfo.domain || 'N/A';
        document.getElementById('resultCollege').textContent = candidateInfo.college || 'N/A';
        document.getElementById('mcqScore').textContent = quizScore;
        document.getElementById('codingScore').textContent = this.score;
        const codingOnly = !!(candidateInfo && candidateInfo.codingOnly);
        const totalPct = codingOnly
            ? (this.score / 1) * 100
            : ((quizScore / 20 + this.score / 1) / 2) * 100;
        document.getElementById('totalScore').textContent = `${totalPct.toFixed(2)}%`;

        // Remove accuracy chart for coding-only scenarios
        this.clearAccuracyChart();

        // Remove complexity hint content
        const complexityDiv = document.getElementById('complexityHint');
        if (complexityDiv) {
            complexityDiv.textContent = '';
        }
    }

    clearAccuracyChart() {
        const canvas = document.getElementById('accuracyChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Complexity estimation removed as requested

    bindDownloadReport() {
        const btn = document.getElementById('downloadReport');
        if (!btn) return;
        btn.onclick = () => {
            try {
                const candidateInfo = JSON.parse(localStorage.getItem('candidateInfo') || '{}');
                const quizScore = parseInt(localStorage.getItem('quizScore') || '0');
                const codingScore = parseInt(localStorage.getItem('codingScore') || '0');
                const cases = JSON.parse(localStorage.getItem('lastRunCases') || '[]');

                const lines = [];
                lines.push('Campus Placement Assessment Report');
                lines.push('');
                lines.push(`Name: ${candidateInfo.name || 'N/A'}`);
                lines.push(`Email: ${candidateInfo.email || 'N/A'}`);
                lines.push(`College: ${candidateInfo.college || 'N/A'}`);
                lines.push(`Domain: ${candidateInfo.domain || 'N/A'}`);
                lines.push('');
                lines.push(`MCQ Score: ${quizScore}/20`);
                lines.push(`Coding Score: ${codingScore}/1`);
                const codingOnly = !!candidateInfo.codingOnly;
                const totalPct = codingOnly ? (codingScore/1)*100 : ((quizScore/20 + codingScore/1)/2)*100;
                lines.push(`Total Score: ${totalPct.toFixed(2)}%`);
                lines.push('');
                if (cases.length) {
                    lines.push('Coding - Last Test Run:');
                    cases.forEach((c, i) => {
                        lines.push(`  Case ${i+1}: ${c.pass ? 'PASS' : 'FAIL'}`);
                        lines.push(`    Input: ${safeStringify(c.input)}`);
                        lines.push(`    Expected: ${safeStringify(c.expected)}`);
                        lines.push(`    Actual: ${safeStringify(c.actual)}`);
                        if (typeof c.durationMs !== 'undefined') {
                            lines.push(`    Duration: ${c.durationMs} ms`);
                        }
                        if (c.error) lines.push(`    Error: ${c.error}`);
                    });
                }

                const content = lines.join('\n');
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const safeName = (candidateInfo.name || 'Candidate').replace(/[^a-z0-9-_ ]/gi, '_');
                a.href = url;
                a.download = `${safeName}_Assessment_Report.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            } catch (_) {}
        };
    }

    bindDownloadPDF() {
        const btn = document.getElementById('downloadReport');
        if (!btn) return;
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
        btn.addEventListener('dblclick', async () => {
            try {
                const { jsPDF } = window.jspdf || {};
                if (!jsPDF) return;
                const node = document.getElementById('resultScreen');
                const canvas = await html2canvas(node, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth - 20;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const marginLeft = 10;
                let y = 10;
                if (imgHeight > pageHeight - 20) {
                    // Split into multiple pages if needed
                    let remaining = imgHeight;
                    const imgHeightPx = canvas.height;
                    const pageHeightPx = (imgWidth * canvas.height) / canvas.width;
                    pdf.addImage(imgData, 'PNG', marginLeft, y, imgWidth, pageHeight - 20, undefined, 'FAST');
                } else {
                    pdf.addImage(imgData, 'PNG', marginLeft, y, imgWidth, imgHeight, undefined, 'FAST');
                }
                const candidateInfo = JSON.parse(localStorage.getItem('candidateInfo') || '{}');
                const safeName = (candidateInfo.name || 'Candidate').replace(/[^a-z0-9-_ ]/gi, '_');
                pdf.save(`${safeName}_Assessment_Report.pdf`);
            } catch (_) {}
        });
    }

    // Render test results and errors
    renderTestResults(result) {
        const panel = document.getElementById('testResults');
        const list = document.getElementById('testList');
        const summary = document.getElementById('testSummary');
        const runtimeError = document.getElementById('runtimeError');

        if (!panel || !list || !summary || !runtimeError) return;

        panel.classList.remove('hidden');
        list.innerHTML = '';
        runtimeError.classList.add('hidden');
        runtimeError.textContent = '';

        const passed = result.passedTests || 0;
        const total = result.totalTests || 0;
        summary.textContent = `${passed}/${total} passed`;
        summary.style.background = passed === total && total > 0 ? '#d1fae5' : '#fde2e2';
        summary.style.color = passed === total && total > 0 ? '#065f46' : '#b91c1c';

        if (Array.isArray(result.cases)) {
            result.cases.forEach((c, idx) => {
                const li = document.createElement('li');
                const left = document.createElement('div');
                left.innerHTML = `<div><strong>Case ${idx + 1}</strong></div>
<div><em>Input:</em> ${escapeHtml(JSON.stringify(c.input))}</div>
<div><em>Expected:</em> ${escapeHtml(JSON.stringify(c.expected))}</div>
<div><em>Actual:</em> ${escapeHtml(JSON.stringify(c.actual))}</div>`;
                const status = document.createElement('div');
                status.className = c.pass ? 'test-status-pass' : 'test-status-fail';
                status.textContent = c.pass ? 'PASS' : 'FAIL';
                li.appendChild(left);
                li.appendChild(status);
                list.appendChild(li);
            });
        }

        if (result.error) {
            runtimeError.textContent = result.error;
            runtimeError.classList.remove('hidden');
        }
    }

    // Monaco Editor helpers
    async ensureEditor() {
        if (this.editor) return;
        await new Promise((resolve) => {
            if (window.require) return resolve();
            const check = setInterval(() => { if (window.require) { clearInterval(check); resolve(); } }, 50);
        });
        window.require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
        await new Promise((resolve) => {
            window.require(['vs/editor/editor.main'], () => resolve());
        });
        this.editor = monaco.editor.create(document.getElementById('editorContainer'), {
            value: this.getDefaultTemplate(),
            language: this.language,
            theme: 'vs',
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 14
        });
        this.editor.onDidChangeModelContent(() => {
            this.scheduleAutoRun();
            this.scheduleAutoSave();
        });
    }

    setEditorLanguage(lang) {
        if (!this.editor) return;
        const model = this.editor.getModel();
        if (model) monaco.editor.setModelLanguage(model, lang === 'cpp' ? 'cpp' : lang);
    }

    getDefaultTemplate() {
        if (this.language === 'javascript') {
            return `// Write a function that accepts 'input' and returns output\nreturn input;`;
        }
        if (this.language === 'python') {
            return `# Python is not executed in-browser here.\n# Switch to JavaScript to run tests.\n# You can still write your solution for submission.`;
        }
        return `// C++ is not executed in-browser here.\n// Switch to JavaScript to run tests.\n// You can still write your solution for submission.`;
    }

    restoreCodeForCurrent(question) {
        if (!this.editor) return;
        const key = this.getStorageKey();
        const starter = (question && question.starterCode) ? String(question.starterCode) : this.getDefaultTemplate();
        const saved = localStorage.getItem(key) || starter;
        this.editor.setValue(saved);
    }

    saveCurrentCode(code) {
        const key = this.getStorageKey();
        localStorage.setItem(key, code);
    }

    getStorageKey() {
        return `code_q${this.currentQuestionIndex}_${this.language}`;
    }

    getCurrentCode() {
        return this.editor ? this.editor.getValue() : '';
    }

    scheduleAutoRun() {
        if (this.autoRunTimer) clearTimeout(this.autoRunTimer);
        this.autoRunTimer = setTimeout(() => this.runCode(), 800);
    }

    scheduleAutoSave() {
        if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveCurrentCode(this.getCurrentCode());
        }, 500);
    }
}

// Export the CodingAssessment class
export default CodingAssessment;

// Simple HTML escaper to avoid rendering issues
function escapeHtml(str) {
    try {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    } catch (_) {
        return '';
    }
}

function safeStringify(obj) {
    try { return JSON.stringify(obj); } catch (_) { return String(obj); }
}