showQuestion();

let quizTime = quiz.remainingTime;
let timerElement = document.getElementById("timer");

let quizTimer;

startTimer();

const successAudio = document.getElementById("success-audio");
const failAudio = document.getElementById("fail-audio");

function playSuccessAudio() {
    successAudio.play().catch((err) => console.log(err));
}

function playFailAudio() {
    failAudio.play().catch((err) => console.log(err));
}
