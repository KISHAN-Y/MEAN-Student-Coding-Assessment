import { fetchQuizQuestions } from './api.js';

class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timePerQuestion = 30; // default 30 seconds
    }

    // Initialize quiz with questions
    async initializeQuiz(domain) {
        this.questions = await fetchQuizQuestions(domain);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.displayQuestion();
    }

    // Display current question
    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endQuiz();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('question').textContent = question.text;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.onclick = () => this.selectOption(index);
            optionsContainer.appendChild(optionElement);
        });

        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        this.startTimer();
    }

    // Start timer for current question
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        let timeLeft = this.questions[this.currentQuestionIndex].difficulty === 'hard' ? 60 : 30;
        const timerElement = document.getElementById('timer');
        
        this.timer = setInterval(() => {
            timeLeft--;
            const seconds = timeLeft.toString().padStart(2, '0');
            timerElement.textContent = `00:${seconds}`;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.moveToNextQuestion();
            }
        }, 1000);
    }

    // Handle option selection
    selectOption(optionIndex) {
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        options[optionIndex].classList.add('selected');
        
        document.getElementById('nextQuestion').classList.remove('hidden');
    }

    // Move to next question
    moveToNextQuestion() {
        clearInterval(this.timer);
        
        const selectedOption = document.querySelector('.option.selected');
        if (selectedOption) {
            const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;
            if (selectedOption.textContent === correctAnswer) {
                this.score++;
            }
        }

        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
            document.getElementById('nextQuestion').classList.add('hidden');
        } else {
            this.endQuiz();
        }
    }

    // End quiz and show results
    endQuiz() {
        clearInterval(this.timer);
        document.getElementById('quizScreen').classList.add('hidden');
        document.getElementById('codingScreen').classList.remove('hidden');
        
        // Store quiz score in localStorage
        localStorage.setItem('quizScore', this.score);

        // Notify listeners that quiz ended
        document.dispatchEvent(new CustomEvent('quizEnded'));
    }

    // Get final score
    getScore() {
        return this.score;
    }
}

// Export the Quiz class
export default Quiz;