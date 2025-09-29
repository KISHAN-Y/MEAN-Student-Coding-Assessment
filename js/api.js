const API_KEY = 'AIzaSyDTEOgnk-Pi0XvDCjJa2KPvsYyrwKOAWKE';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Function to get quiz questions based on domain
export async function fetchQuizQuestions(domain) {
    try {
        const prompt = `Create 20 multiple choice questions for a ${domain} developer interview. 
        For each question:
        1. Make it technical and specific to ${domain}
        2. Include 4 options
        3. Mark the correct answer
        4. Set difficulty (easy/medium/hard)

        Format each question exactly like this example:
        {
            "text": "What is JavaScript?",
            "options": ["A programming language", "A database", "A web server", "An operating system"],
            "correctAnswer": "A programming language",
            "difficulty": "easy"
        }

        Return an array of exactly 20 questions formatted as valid JSON.`;

        const response = await fetchWithRetry(() => fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 1
                }
            })
        }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Gemini API response:', data);

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
            throw new Error('Invalid API response structure');
        }

        // Extract the text content from Gemini's response
        const generatedContent = data.candidates[0].content.parts[0].text;
        
        // Find the array in the response using regex
        const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('No JSON array found in response');
        }

        // Parse the JSON array
        const questions = JSON.parse(jsonMatch[0]);
        
        // Validate the questions structure
        if (!Array.isArray(questions) || questions.length !== 20) {
            throw new Error('Invalid questions format');
        }

        // Validate each question has required properties
        questions.forEach((q, index) => {
            if (!q.text || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer || !q.difficulty) {
                throw new Error(`Invalid question format at index ${index}`);
            }
        });

        return questions;
    } catch (error) {
        console.error('Error with Gemini API:', error);
        
        // Return basic questions as emergency fallback
        return Array.from({ length: 20 }, (_, i) => ({
            text: `Fallback Q${i + 1}: What is the primary purpose of version control systems?`,
            options: [
                "To track changes in code",
                "To compile code faster",
                "To debug applications",
                "To deploy applications"
            ],
            correctAnswer: "To track changes in code",
            difficulty: i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy"
        }));
    }
}

// Fallback questions in case API fails
function getFallbackQuestions(domain) {
    const defaultQuestions = [
        {
            text: "What is the primary purpose of version control systems?",
            options: [
                "To track changes in code",
                "To compile code faster",
                "To debug applications",
                "To deploy applications"
            ],
            correctAnswer: "To track changes in code",
            difficulty: "easy"
        },
        {
            text: "Which data structure uses LIFO (Last In, First Out)?",
            options: ["Queue", "Stack", "Array", "Tree"],
            correctAnswer: "Stack",
            difficulty: "easy"
        },
        {
            text: "What is the time complexity of binary search?",
            options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
            correctAnswer: "O(log n)",
            difficulty: "medium"
        }
    ];
    return defaultQuestions;
}

// Function to get coding questions based on domain
export async function fetchCodingQuestions(domain) {
    try {
        const prompt = `Create 1 coding question for a ${domain} role (web designer or frontend developer should get DOM/array/object problems suitable for in-browser JS).
        For each question, provide fields EXACTLY as JSON with these keys:
        {
          "id": "Q1",                      // unique id string
          "description": "Problem statement",
          "functionName": "filterProducts", // function to implement
          "parameters": ["products", "query", "minPrice", "maxPrice"], // param names
          "starterCode": "function filterProducts(products, query, minPrice, maxPrice) {\n  // write your code here\n}\n", // starter code string
          "sampleInput": {"products": [{"name":"A","price":10}], "query":"a", "minPrice":0, "maxPrice":20}, // JSON serializable input matching parameters
          "sampleOutput": [{"name":"A","price":10}] // JSON serializable expected output
        }
        Return an array of exactly 1 question as valid JSON.`;

        const response = await fetchWithRetry(() => fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 1
                }
            })
        }));

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Gemini API coding questions response:', data);

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
            throw new Error('Invalid API response structure');
        }

        // Extract the text content from Gemini's response
        const generatedContent = data.candidates[0].content.parts[0].text;
        
        // Find the array in the response using regex
        const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('No JSON array found in response');
        }

        // Parse the JSON array
        const questions = JSON.parse(jsonMatch[0]);
        
        // Validate the questions structure
        if (!Array.isArray(questions) || questions.length !== 1) {
            throw new Error('Invalid questions format');
        }

        return questions;
    } catch (error) {
        console.error('Error fetching coding questions:', error);
        // Fallback with starter code pattern
        return [
            {
                id: "Q1",
                description: "Implement filterProducts that returns products whose name contains the query (case-insensitive) and price within [minPrice,maxPrice] if provided.",
                functionName: "filterProducts",
                parameters: ["products", "query", "minPrice", "maxPrice"],
                starterCode: "function filterProducts(products, query, minPrice, maxPrice) {\n  // name contains query (case-insensitive)\n  // apply minPrice/maxPrice if they are numbers; ignore if null/undefined\n  // return a new filtered array\n}\n",
                sampleInput: { "products": [{"name":"Mouse","price":499},{"name":"Keyboard","price":1299},{"name":"House","price":9999}], "query": "ou", "minPrice": 300, "maxPrice": 2000 },
                sampleOutput: [{"name":"Mouse","price":499}]
            }
        ];
    }
}

// Generic retry helper for transient errors
async function fetchWithRetry(fetchFn, options = { retries: 3, baseDelayMs: 1000 }) {
    const { retries, baseDelayMs } = options;
    let attempt = 0;
    let lastError;
    while (attempt <= retries) {
        try {
            const res = await fetchFn();
            if (!res.ok) {
                // Retry on 429/5xx
                if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
                    throw new Error(`Transient error ${res.status}`);
                }
                throw new Error(`HTTP error ${res.status}`);
            }
            return res;
        } catch (err) {
            lastError = err;
            if (attempt === retries) break;
            const delay = baseDelayMs * Math.pow(2, attempt); // exponential backoff
            console.warn(`Request failed (attempt ${attempt + 1}/${retries + 1}): ${err.message}. Retrying in ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
            attempt++;
        }
    }
    throw lastError;
}

// Function to evaluate coding solution
export async function evaluateCode(code, question) {
    try {
        const result = await runStarterSignature(code, question);
        return {
            passedTests: result.pass ? 1 : 0,
            totalTests: 1,
            output: result.pass ? 'Passed 1/1' : 'Failed 0/1',
            cases: [
                {
                    input: result.inputShown,
                    expected: result.expected,
                    actual: result.actual,
                    pass: result.pass,
                    durationMs: result.durationMs
                }
            ],
            error: result.error || null,
            avgRuntimeMs: result.durationMs
        };
    } catch (error) {
        console.error('Error evaluating code:', error);
        return {
            passedTests: 0,
            totalTests: 1,
            output: error.message,
            cases: [],
            error: error.message
        };
    }
}

// Execute starter signature: call question.functionName with sampleInput
async function runStarterSignature(code, question) {
    if (!question || !question.functionName) throw new Error('Invalid question spec');
    const fnName = question.functionName;
    const params = Array.isArray(question.parameters) ? question.parameters : [];
    const expected = question.sampleOutput;
    const inputObj = question.sampleInput;

    const { argsArray, inputShown } = buildArgsArray(params, inputObj);
    const start = performance.now ? performance.now() : Date.now();
    const { value: actual, error } = executeStarterFunction(code, fnName, argsArray);
    const end = performance.now ? performance.now() : Date.now();
    const durationMs = Number((end - start).toFixed(3));
    const pass = !error && deepEqual(actual, expected);
    return { pass, expected, actual, durationMs, error, inputShown };
}

function buildArgsArray(paramNames, inputObj) {
    // If sampleInput is an object map {name: value}, map by param names order
    try {
        if (paramNames && Array.isArray(paramNames) && inputObj && typeof inputObj === 'object' && !Array.isArray(inputObj)) {
            const arr = paramNames.map(n => inputObj[n]);
            return { argsArray: arr, inputShown: inputObj };
        }
        // If it's already an array, pass through
        if (Array.isArray(inputObj)) {
            return { argsArray: inputObj, inputShown: inputObj };
        }
        // Otherwise single argument
        return { argsArray: [inputObj], inputShown: inputObj };
    } catch (_) {
        return { argsArray: [inputObj], inputShown: inputObj };
    }
}

function executeStarterFunction(code, functionName, args) {
    try {
        const loader = new Function(`${code}; try { return ${functionName}; } catch(e) { return undefined; }`);
        const fn = loader();
        if (typeof fn !== 'function') return { value: undefined, error: `Function ${functionName} not found` };
        const value = fn.apply(null, args);
        return { value };
    } catch (err) {
        return { value: undefined, error: err.message };
    }
}

// Execute user code safely and try multiple patterns to get a return value
function executeUserCodeSafely(code, input) {
    const originalLog = console.log;
    const logs = [];
    console.log = (...args) => { try { logs.push(args.join(' ')); } catch(_) {} };
    try {
        // 1) Direct return from body
        let fn = new Function('input', code);
        let value = fn(input);
        if (typeof value !== 'undefined') return { value };

        // 2) Look for a named function solve
        const getter = new Function(`${code}; return (typeof solve !== 'undefined') ? solve : undefined;`);
        const solveFn = getter();
        if (typeof solveFn === 'function') {
            value = solveFn(input);
            if (typeof value !== 'undefined') return { value };
        }

        // 3) Try to return a variable named result
        fn = new Function('input', `${code}; try { return result; } catch (e) { return undefined; }`);
        value = fn(input);
        if (typeof value !== 'undefined') return { value };

        // 4) Fallback to last console.log value
        if (logs.length > 0) return { value: logs[logs.length - 1] };

        return { value: undefined };
    } catch (err) {
        return { value: undefined, error: err.message };
    } finally {
        console.log = originalLog;
    }
}

// Simple deep equality using JSON stringification for common cases
function deepEqual(a, b) {
    try {
        if (a === b) return true;
        const sa = JSON.stringify(a);
        const sb = JSON.stringify(b);
        return sa === sb;
    } catch (_) {
        return false;
    }
}

// Function to parse resume and get relevant information
export async function parseResume(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // In a real application, you would send this to an API
            // For now, we'll just return basic file info
            resolve({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                content: e.target.result.substring(0, 100) // Just first 100 chars for demo
            });
        };
        reader.readAsText(file);
    });
}