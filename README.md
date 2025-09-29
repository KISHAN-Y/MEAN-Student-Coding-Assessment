<div align="center">
<h1>🤖 SkillAssess</h1>
<strong>A dynamic, AI-powered coding assessment platform for students and developers.</strong>
</div>

<p align="center">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/html5-%2523E34F26.svg%3Fstyle%3Dfor-the-badge%26logo%3Dhtml5%26logoColor%3Dwhite" alt="HTML5" />
<img src="./images/" alt="CSS3" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/javascript-%2523323330.svg%3Fstyle%3Dfor-the-badge%26logo%3Djavascript%26logoColor%3D%2523F7DF1E" alt="JavaScript" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/node.js-6DA55F%3Fstyle%3Dfor-the-badge%26logo%3Dnode.js%26logoColor%3Dwhite" alt="Node.js" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/express.js-%2523404d59.svg%3Fstyle%3Dfor-the-badge%26logo%3Dexpress%26logoColor%3D%252361DAFB" alt="Express.js" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Gemini_API-4285F4%3Fstyle%3Dfor-the-badge%26logo%3Dgoogle%26logoColor%3Dwhite" alt="Gemini API" />
</p>

<p align="center">
<a href="https://www.google.com/search?q=http://127.0.0.1:8000">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/🔗 Live Demo-%2300b383.svg?style=for-the-badge" />
</a>
<a href="https://www.google.com/search?q=https://github.com/KISHAN-Y/Personal_Portfolio/archive/refs/heads/main.zip">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/⬇️ Download ZIP-%23222222.svg?style=for-the-badge" />
</a>
</p>

<p align="center">This project is a comprehensive, single-page application designed to simulate a real-world technical assessment. It leverages the power of the Gemini API to dynamically generate quiz and coding questions tailored to a user's selected domain, providing a unique and challenging experience every time.</p>

⭐ Key Features
<table>
<tr>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>🤖 Dynamic Content</strong></h4>
<p style="text-align: justify;">
<em>Uses the Gemini API to create unique MCQ and coding questions for any domain.</em>
</p>
</td>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>👤 Personalized Setup</strong></h4>
<p style="text-align: justify;">
<em>A smooth onboarding process for domain selection and profile creation.</em>
</p>
</td>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>💻 Pro Coding Editor</strong></h4>
<p style="text-align: justify;">
<em>Features the Monaco Editor for a rich, familiar coding experience.</em>
</p>
</td>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>✅ Instant Feedback</strong></h4>
<p style="text-align: justify;">
<em>Run code against test cases and receive immediate validation.</em>
</p>
</td>
</tr>
<tr>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>📊 Results Dashboard</strong></h4>
<p style="text-align: justify;">
<em>A clean and clear results screen summarizing MCQ and coding scores.</em>
</p>
</td>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>📄 PDF Reports</strong></h4>
<p style="text-align: justify;">
<em>Generate and download a PDF report of your assessment results for sharing.</em>
</p>
</td>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>📱 Fully Responsive</strong></h4>
<p style="text-align: justify;">
<em>A seamless and accessible experience across all devices, from mobile to desktop.</em>
</p>
</td>
<td align="center" width="25%" style="padding: 20px;">
<h4><strong>💡 Clean Code</strong></h4>
<p style="text-align: justify;">
<em>Well-structured files and modular JavaScript for easy understanding and maintenance.</em>
</p>
</td>
</tr>
</table>
<div>
    <h2>🚀 Getting Started</h2>

    <h3>Prerequisites</h3>
    <p>Ensure you have Node.js and npm installed on your system.</p>
    <pre><code>node -v
npm -v</code></pre>

    <h3>Installation &amp; Setup</h3>
    <ol>
        <li>
            <p>Clone the repository to your local machine:</p>
            <pre><code>git clone https://github.com/kishan-y/mean-student-coding-assessment.git</code></pre>
        </li>
        <li>
            <p>Navigate into the project directory:</p>
            <pre><code>cd mean-student-coding-assessment</code></pre>
        </li>
        <li>
            <p>Install the required npm packages:</p>
            <pre><code>npm install</code></pre>
        </li>
        <li>
            <p>Create a <code>.env</code> file in the project root.</p>
        </li>
        <li>
            <p>Add your Gemini API key to the <code>.env</code> file:</p>
            <pre><code>GEMINI_API_KEY="YOUR_GEMINI_API_KEY"</code></pre>
        </li>
        <li>
            <p>Start the Express server:</p>
            <pre><code>npm start</code></pre>
        </li>
        <li>
            <p>Open your browser and navigate to <a href="http://127.0.0.1:8000">http://127.0.0.1:8000</a> to use the application.</p>
        </li>
    </ol>
</div>

<div>
    <h2>📂 Project Structure</h2>
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
└── server.js             # Express.js backend server</code></pre>
</div>
