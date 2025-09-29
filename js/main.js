import { parseResume } from './api.js';
import CodingAssessment from './coding.js';

// Store candidate information
let candidateInfo = {};
let quizInstance = null;
let codingAssessment = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    setupDomainSelection();
    setupProfileForm();
    setupTryAgainButton();
});

// Setup domain selection
function setupDomainSelection() {
    const domainChips = document.getElementById('domainChips');
    
    domainChips.addEventListener('click', (e) => {
        const clickedChip = e.target.closest('.chip');
        if (!clickedChip) return;

        console.log('Chip clicked:', clickedChip.id || clickedChip.dataset.domain); // Debug log

        if (clickedChip.id === 'customDomain') {
            const customDomain = prompt('Enter your domain:');
            if (customDomain && customDomain.trim()) {
                selectDomain(customDomain.trim());
            }
        } else {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
            clickedChip.classList.add('selected');
            selectDomain(clickedChip.dataset.domain);
        }
    });
}

// Handle domain selection
function selectDomain(domain) {
    if (!domain) return;
    
    console.log('Domain selected:', domain); // Debug log
    candidateInfo.domain = domain;
    const summaryDomain = document.getElementById('summaryDomain');
    if (summaryDomain) summaryDomain.textContent = domain;
    
    // Hide onboarding1 and show onboarding2
    const onboarding1 = document.getElementById('onboarding1');
    const onboarding2 = document.getElementById('onboarding2');
    
    if (onboarding1 && onboarding2) {
        onboarding1.classList.add('hidden');
        onboarding2.classList.remove('hidden');
    } else {
        console.error('Onboarding screens not found');
    }
}

// Setup profile form
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    const skipButton = document.getElementById('skipResume');
    const nameInput = document.getElementById('name');
    const summaryName = document.getElementById('summaryName');

    if (nameInput && summaryName) {
        nameInput.addEventListener('input', () => {
            summaryName.textContent = nameInput.value || '-';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleProfileSubmission(true);
    });

    skipButton.addEventListener('click', async () => {
        await handleProfileSubmission(false);
    });
}

// Handle profile submission
async function handleProfileSubmission(includeResume) {
    // Get form data
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const collegeInput = document.getElementById('college');
    const companyInput = document.getElementById('company');

    if (!nameInput || !emailInput || !collegeInput || !companyInput) {
        console.error('Required form fields not found');
        return;
    }

    candidateInfo = {
        ...candidateInfo,
        name: nameInput.value,
        email: emailInput.value,
        college: collegeInput.value,
        company: companyInput.value
    };

    const codingOnlyCheckbox = document.getElementById('codingOnly');
    const codingOnly = codingOnlyCheckbox ? codingOnlyCheckbox.checked : false;
    candidateInfo.codingOnly = codingOnly;

    // Save to localStorage
    localStorage.setItem('candidateInfo', JSON.stringify(candidateInfo));

    if (includeResume) {
        const resumeInput = document.getElementById('resume');
        if (resumeInput && resumeInput.files.length > 0) {
            try {
                const resumeData = await parseResume(resumeInput.files[0]);
                console.log('Resume parsed:', resumeData);
            } catch (error) {
                console.error('Error parsing resume:', error);
            }
        }
    }

    // Start quiz or coding depending on preference
    const onboarding2 = document.getElementById('onboarding2');
    const quizScreen = document.getElementById('quizScreen');
    const codingScreen = document.getElementById('codingScreen');

    if (!onboarding2) {
        console.error('Onboarding screen not found');
        return;
    }

    onboarding2.classList.add('hidden');

    if (codingOnly) {
        if (!codingScreen) {
            console.error('Coding screen not found');
            return;
        }
        codingScreen.classList.remove('hidden');
        if (!codingAssessment) {
            codingAssessment = new CodingAssessment();
        }
        await codingAssessment.initializeAssessment(candidateInfo.domain);
    } else {
        if (!quizScreen) {
            console.error('Quiz screen not found');
            return;
        }
        quizScreen.classList.remove('hidden');
        try {
            const Quiz = (await import('./quiz.js')).default;
            quizInstance = new Quiz();
            await quizInstance.initializeQuiz(candidateInfo.domain);
        } catch (error) {
            console.error('Error starting quiz:', error);
        }
    }
}

// Setup try again button
function setupTryAgainButton() {
    document.getElementById('tryAgain').addEventListener('click', () => {
        // Clear previous results
        localStorage.removeItem('quizScore');
        localStorage.removeItem('codingScore');
        
        // Show first screen
        document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
        document.getElementById('onboarding1').classList.remove('hidden');
        
        // Reset chip selection
        document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('selected'));
    });
}

// Event listener for next question button
document.getElementById('nextQuestion').addEventListener('click', () => {
    if (quizInstance) {
        quizInstance.moveToNextQuestion();
    }
});

// Initialize coding assessment when quiz ends
document.addEventListener('quizEnded', async () => {
    if (!codingAssessment) {
        codingAssessment = new CodingAssessment();
    }
    await codingAssessment.initializeAssessment(candidateInfo.domain);
});