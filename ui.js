function showQuestion() {
    if (quiz.finished()) {
        scorePage();
    } else {
        let questionElement = document.getElementById("question");
        if (questionElement) {
            let currentQuestion = quiz.getQuestionIndex();
            questionElement.innerHTML = currentQuestion.text;

            let choices = currentQuestion.choices;
            let buttonsContainer = document.getElementsByClassName("buttons-containder")[0];
            buttonsContainer.innerHTML = ""; // Clear the existing buttons

            if (currentQuestion instanceof TrueFalseQuestion) {
                // For True/False questions, display only the True and False buttons
                let trueButton = createButton("True", "btn0", "btn");
                let falseButton = createButton("False", "btn1", "btn");

                buttonsContainer.appendChild(trueButton);
                buttonsContainer.appendChild(falseButton);
            } else {
                // For multiple-choice questions, display all four buttons
                for (let i = 0; i < choices.length; i++) {
                    let choiceElement = createButton(choices[i], "btn" + i, "btn");
                    buttonsContainer.appendChild(choiceElement);
                }
            }

            showProgress();
        }
    }
}

function createButton(choice, id, className) {
    let button = document.createElement("button");
    button.innerHTML = choice;
    button.id = id;
    button.className = className;
    button.onclick = function () {
        // Guess the selected choice and display the next question
        quiz.guess(choice);
        showQuestion();
    };
    return button;
}

function showProgress() {
    // Display the current question number and total number of questions
    const currentQuestionNumber = quiz.questionIndex + 1;
    const progressElement = document.getElementById("progress");

    if (progressElement) {
        progressElement.textContent = `Question ${currentQuestionNumber}/${quiz.questions.length}`;
    }
}

function scorePage() {
    // Determine if the user succeeded or failed the quiz
    const succeeded = quiz.score >= 5;
    // Create the HTML content for displaying the quiz scores and options to repeat the quiz
    const quizEndHTML = `
        <h1>${succeeded ? "You succeeded" : "You failed"}</h1>
        <h2 id="score">Right answers: ${quiz.score}/${quiz.questions.length}</h2>
        <div class="quiz-repeat">
            <a href="index.html" id="quiz-repeat-button">Take Quiz Again</a>
        </div>
    `;

    const quizElement = document.getElementById("quiz");
    if (quizElement) {
        // Update the quiz element with the quiz end HTML content
        quizElement.innerHTML = quizEndHTML;

        if (succeeded) {
            playSuccessAudio();
        } else {
            playFailAudio();
        }

        // Create and append an SVG image based on the quiz result
        createSvg(succeeded);

        /* Storing quiz info for offline usage */
        localStorage.removeItem("questionIndex");
        localStorage.removeItem("score");
        localStorage.removeItem("remainingTime");

        clearInterval(quizTimer);

        const quizRepeatButton = document.getElementById("quiz-repeat-button");
        if (quizRepeatButton) {
            quizRepeatButton.addEventListener("click", handleQuizRepeat);
        }
    }
}

function handleQuizRepeat() {
    quiz.restartQuiz();
    showQuestion();
    startTimer();
}

function createSvg(succeeded) {
    const quizElement = document.getElementById("quiz");
    if (!quizElement) return;

    // Create an SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "400");
    svg.setAttribute("height", "400");
    svg.setAttribute("viewBox", "0 0 400 400");
    svg.classList.add("centered-svg");

    // Create an image element and set its attributes based on the quiz result
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", succeeded ? "success.svg" : "fail.svg");
    image.setAttribute("width", "100%");
    image.setAttribute("height", "100%");

    svg.appendChild(image);
    quizElement.appendChild(svg);

    // Add a click event listener to the image for animation purposes
    image.addEventListener("click", function () {
        image.classList.add("rotate-image");
    });
}

function startTimer() {
    let sec = Math.floor(quiz.remainingTime % 60);
    let min = Math.floor(quiz.remainingTime / 60) % 60;
    timerElement.innerHTML = `TIME: ${pad(min)}:${pad(sec)}`;

    // Start the countdown timer
    quizTimer = setInterval(function () {
        if (quiz.remainingTime <= 0) {
            clearInterval(quizTimer);
            scorePage();
        } else {
            quiz.remainingTime--;
            sec = Math.floor(quiz.remainingTime % 60);
            min = Math.floor(quiz.remainingTime / 60) % 60;
            timerElement.innerHTML = `TIME: ${pad(min)}:${pad(sec)}`;

            // Save remaining time in local storage
            localStorage.setItem("remainingTime", quiz.remainingTime);
        }
    }, 1000);
}

function pad(value) {
    // Add leading zero if the value is less than 10
    return value < 1 ? `0${value}` : value;
}
