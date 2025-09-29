<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEAN Student Coding Assessment README</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 25px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5em;
            color: #212529;
            margin: 0;
        }
        .header .lead {
            font-size: 1.2em;
            color: #6c757d;
            margin-top: 10px;
        }
        .section-title {
            font-size: 1.8em;
            color: #343a40;
            border-bottom: 2px solid #5865f2;
            padding-bottom: 10px;
            margin-top: 40px;
            margin-bottom: 20px;
        }
        .gif-container {
            text-align: center;
            margin: 30px 0;
        }
        .gif-container img {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        ul {
            list-style: none;
            padding: 0;
        }
        ul li {
            background: #f8f9fa;
            border-left: 4px solid #5865f2;
            padding: 12px 15px;
            margin-bottom: 10px;
            border-radius: 0 5px 5px 0;
        }
        ul li i {
            margin-right: 10px;
            color: #5865f2;
        }
        .tech-badges {
            margin-bottom: 20px;
        }
        .badge {
            display: inline-block;
            padding: 6px 12px;
            font-size: 14px;
            font-weight: 600;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: 16px;
            margin: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .badge-html { background: linear-gradient(45deg, #e34c26, #f16529); }
        .badge-css { background: linear-gradient(45deg, #264de4, #2965f1); }
        .badge-js { background: linear-gradient(45deg, #f7df1e, #f0db4f); color: #323330;}
        .badge-node { background: linear-gradient(45deg, #339933, #68a063); }
        .badge-express { background: linear-gradient(45deg, #444, #000); }
        .badge-gemini { background: linear-gradient(45deg, #5865f2, #7289da); }

        code {
            background: #e9ecef;
            color: #e83e8c;
            padding: 3px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
        }
        pre {
            background: #212529;
            color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
        }
        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        a {
            color: #5865f2;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-brain"></i> SkillAssess</h1>
            <p class="lead">A dynamic, AI-powered coding assessment platform for students and developers.</p>
        </div>
        
        <div class="gif-container">
            
            <img src="Images/Exams.gif" alt="App Demo GIF">
        </div>

        <p>This project is a comprehensive, single-page application designed to simulate a real-world technical assessment. It leverages the power of the Gemini API to dynamically generate quiz and coding questions tailored to a user's selected domain, providing a unique and challenging experience every time.</p>

        <h2 class="section-title"><i class="fas fa-star"></i> Core Features</h2>
        <ul>
            <li><i class="fas fa-cogs"></i><strong>Dynamic Question Generation:</strong> Utilizes the Gemini API to create unique MCQ and coding questions based on the selected domain.</li>
            <li><i class="fas fa-user-circle"></i><strong>Personalized Experience:</strong> A smooth onboarding process for domain selection and profile creation.</li>
            <li><i class="fas fa-laptop-code"></i><strong>Integrated Coding Environment:</strong> Features the Monaco Editor for a rich, familiar coding experience.</li>
            <li><i class="fas fa-play-circle"></i><strong>Real-time Code Validation:</strong> Run code against test cases and receive immediate feedback.</li>
            <li><i class="fas fa-chart-line"></i><strong>Performance Dashboard:</strong> A clean and clear results screen summarizing MCQ and coding scores.</li>
            <li><i class="fas fa-file-download"></i><strong>Downloadable Reports:</strong> Generate and download a PDF report of your assessment results.</li>
            <li><i class="fas fa-mobile-alt"></i><strong>Fully Responsive:</strong> A seamless experience across all devices.</li>
        </ul>

        <h2 class="section-title"><i class="fas fa-tools"></i> Technologies Used</h2>
        <div class="tech-badges">
            <span class="badge badge-html">HTML5</span>
            <span class="badge badge-css">CSS3</span>
            <span class="badge badge-js">JavaScript (ESM)</span>
            <span class="badge badge-node">Node.js</span>
            <span class="badge badge-express">Express.js</span>
            <span class="badge badge-gemini">Gemini API</span>
        </div>

        <h2 class="section-title"><i class="fas fa-rocket"></i> Getting Started</h2>
        <h3>Prerequisites</h3>
        <p>Ensure you have Node.js and npm installed on your system.</p>
        <pre><code>node -v
npm -v</code></pre>

        <h3>Installation &amp; Setup</h3>
        <ol>
            <li>Clone the repository to your local machine:
                <pre><code>git clone https://github.com/kishan-y/mean-student-coding-assessment.git</code></pre>
            </li>
            <li>Navigate into the project directory:
                <pre><code>cd mean-student-coding-assessment</code></pre>
            </li>
            <li>Install the required npm packages:
                <pre><code>npm install</code></pre>
            </li>
            <li>Create a <code>.env</code> file in the project root.</li>
            <li>Add your Gemini API key to the <code>.env</code> file:
                <pre><code>GEMINI_API_KEY="YOUR_GEMINI_API_KEY"</code></pre>
            </li>
            <li>Start the Express server:
                <pre><code>npm start</code></pre>
            </li>
            <li>Open your browser and navigate to <a href="http://127.0.0.1:8000">http://127.0.0.1:8000</a> to use the application.</li>
        </ol>
        
        <h2 class="section-title"><i class="fas fa-folder-open"></i> Project Structure</h2>
        <pre><code>.
├── css/
│   └── styles.css        # Main stylesheet
├── js/
│   ├── api.js            # Gemini API interaction logic
│   ├── coding.js         # Coding challenge screen logic
│   ├── main.js           # Main application flow and UI control
│   └── quiz.js           # Quiz screen logic
├── Images/
│   └── Exams.gif         # App demo GIF
│   └── ...               # Other image assets
├── .env                  # Environment variables (needs to be created)
├── index.html            # Main HTML file (SPA)
├── package.json          # Project dependencies and scripts
└── server.js             # Express.js backend server
</code></pre>
    </div>
</body>
</html>
