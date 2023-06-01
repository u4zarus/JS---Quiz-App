quizTitle = "SEZNAM.CZ QUIZ";

class Quiz {
    constructor(questions) {
        this.quizTitle = document.getElementById("quiz-title");
        this.quizTitle.innerHTML = quizTitle;

        // Quiz properties
        this.score = 0;
        this.questions = questions;
        this.questionIndex = 0;
        this.remainingTime = 0;
    }

    getQuestionIndex() {
        // Retrieve the current question based on the question index
        return this.questions[this.questionIndex];
    }

    guess(answer) {
        // Check if the user's answer is correct and update the score accordingly
        if (this.getQuestionIndex().isAnswerCorrect(answer)) {
            this.score++;
        }
        this.questionIndex++;
        // Save current progress in local storage
        localStorage.setItem("questionIndex", this.questionIndex);
        localStorage.setItem("score", this.score);
    }

    finished() {
        // Check if all questions have been answered
        return this.questionIndex === this.questions.length;
    }

    restartQuiz() {
        this.score = 0;
        this.questionIndex = 0;
        this.remainingTime = 60; // Set the remaining time to 1 minute
        // Save the initial state in local storage
        localStorage.setItem("questionIndex", this.questionIndex);
        localStorage.setItem("score", this.score);
        localStorage.setItem("remainingTime", this.remainingTime);
        clearInterval(quizTimer); // Clear the existing countdown interval
        startTimer(); // Start the countdown after resetting the quiz
    }
}

class Question {
    constructor(text, choices, answer) {
        this.text = text;
        this.choices = choices;
        this.answer = answer;
    }

    isAnswerCorrect(choice) {
        return this.answer === choice;
    }
}

class TrueFalseQuestion extends Question {
    constructor(text, answer) {
        // Create a true/false question with fixed choices
        super(text, ["True", "False"], answer);
    }
}

// Create an array of questions
let questions = [
    new Question(
        "When was Seznam.cz founded?",
        ["1996", "2000", "2005", "2010"],
        "1996"
    ),
    new Question(
        "Who founded Seznam.cz?",
        ["Ivo Lukačovič", "Jan Koum", "Pavel Durov", "Mark Zuckerberg"],
        "Ivo Lukačovič"
    ),
    new Question(
        "How many different web services does Seznam run?",
        ["Almost 10", "Almost 20", "Almost 30", "Almost 40"],
        "Almost 30"
    ),
    new Question(
        "What is Seznam.cz?",
        ["A social media platform", "A search engine", "A video-sharing platform", "A music streaming service"],
        "A search engine"
    ),
    new Question(
        "What is the revenue of Seznam.cz for the year 2022?",
        ["CZK 6.928 billion", "CZK 7.928 billion", "CZK 8.928 billion", "CZK 5.928 billion"],
        "CZK 5.928 billion"
    ),
    new TrueFalseQuestion(
        "Seznam.cz is a web portal and search engine in the Czech Republic.",
        "True"
    ),
    new TrueFalseQuestion(
        "Seznam.cz is the place of first choice for Polish internet users.",
        "False"
    ),
];

// Retrieve previous progress from local storage or initialize new quiz
let storedQuestionIndex = localStorage.getItem("questionIndex");
let storedScore = localStorage.getItem("score");
let storedRemainingTime = localStorage.getItem("remainingTime");
let quiz;

if (storedQuestionIndex && storedScore && storedRemainingTime) {
    // Load the saved quiz state from local storage
    quiz = new Quiz(questions);
    quiz.questionIndex = parseInt(storedQuestionIndex);
    quiz.score = parseInt(storedScore);
    quiz.remainingTime = parseInt(storedRemainingTime);
} else {
    // Create a new quiz with the initial state
    quiz = new Quiz(questions);
    quiz.remainingTime = 60; // Set the initial remaining time to 1 minute
}
