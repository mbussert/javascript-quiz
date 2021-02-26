let startQuiz = $("#startbtn");
let playAgain = $("#playagain");
let playAgain2 = $("#playagain2");
let clearScores = $("#clearscoresbtn");
let resultText = $("#result");
let scoreDisplay = $("#numcorrect");
let saveScoreBtn = $("#savescorebtn");
let username = $("#username");
let secondsLeft = 60;
let timeEl = $("#countdown");
let question = $("#question");
let choices = Array.from(document.getElementsByClassName("choice-text"));
let viewHighScores = $("viewhs");
let acceptAnswer = false;
let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let mostRecentScore = localStorage.getItem("mostRecentScore");
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let maxHighScores = 5;
let highScoresList = $("#highscoreslist");


// Not allow submission of score unless input entered.
(function () {
    $('form').on('keyup', 'input', function () {

        let empty = false;
        $('body').find('input[type="text"]').each(function () {
            if (($(this).val() == '')) {
                empty = true;
            }
        });

        if (empty) {
            $('#savescorebtn').attr('disabled', 'disabled');
        } else {
            $('#savescorebtn').removeAttr('disabled');
        }
    });
})()

let questions = [
    {
        question: "What does HTML stand for?",
        choice1: "HyperText Markup Language",
        choice2: "HyperTool Markup Language",
        choice3: "HyperText Markdown Language",
        choice4: "Hypnotic Tree Marking List",
        answer: 1
    },
    {
        question: "What does CSS stand for?",
        choice1: "Cascading Style Syntax",
        choice2: "Cascading Style Sheets",
        choice3: "Corresponding Style Sheet",
        choice4: "Creative Style Syntax",
        answer: 2
    },
    {
        question: "What HTML element is used to link to a JavaScript file?",
        choice1: "<js></js>",
        choice2: "<header></header>",
        choice3: "<link></link>",
        choice4: "<script></script>",
        answer: 4
    },
    {
        question: "What attribute will make a link open in a new window?",
        choice1: "target=_newTab",
        choice2: "link=NewWindow",
        choice3: "target=_blank",
        choice4: "target=_newWindow",
        answer: 3
    },
    {
        question: "What HTML element is used to apply CSS style in the HTML document itself?",
        choice1: "<color>",
        choice2: "<style>",
        choice3: "<css>",
        choice4: "<makepretty>",
        answer: 2
    },
    {
        question: "To access an external sheet, a link is added in which section of the HTML document:",
        choice1: "<head>",
        choice2: "<h1>",
        choice3: "<body>",
        choice4: "<!DOCTYPE>",
        answer: 1
    },
    {
        question: "HTML links are defined with the <a> tag and the address is specified by which attribute?",
        choice1: "HREF",
        choice2: "LINK",
        choice3: "TARGET",
        choice4: "SRC",
        answer: 1
    },
    {
        question: "Which of the following is/are true about Bootstrap?",
        choice1: "Free front-end framework",
        choice2: "Open source product",
        choice3: "It allows for responsive design",
        choice4: "All of the above",
        answer: 4
    },
];

startQuiz.on('click', function () {
    beginQuiz();
    timer();

});

playAgain.on('click', function() {
    beginQuiz();
    secondsLeft = 60;
    timer();

});

playAgain2.on('click', function () {
    beginQuiz();
    secondsLeft = 60;
    timer();

});

$("#viewhs").click(function () {
    $("#quiz").css("display", "none");
    $("#gameover").css("display", "none");
    $("#highscores").css("display", "inline-block");
    $("#quizbody").css("display", "none");
});

function beginQuiz() {
    $("#quizbody").css("display", "none");
    $("#highscores").css("display", "none");
    $("#gameover").css("display", "none");
    $("#quiz").css("display", "inline-block");

    score = 0;
    questionCounter = 0;
    availableQuestions = [...questions];
    getNewQuestion();

}

function getNewQuestion() {
    if (availableQuestions.length === 0) {
        mostRecentScore = score;
        localStorage.setItem("mostRecentScore", score);
        secondsLeft = 0;

        $("#quiz").css("display", "none");
        $("#gameover").css("display", "inline-block");
        scoreDisplay.text(score);
    }

    questionCounter++;
    resultText.text("");
    let questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.text(currentQuestion.question);

    choices.forEach(choice => {
        let number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })

    availableQuestions.splice(questionIndex, 1);

    acceptAnswer = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptAnswer) return;

        acceptAnswer = false;
        let selectedChoice = e.target;
        let selectedAnswer = selectedChoice.dataset["number"];

        let classToApply = "incorrect";
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = "correct";
            resultText.text("Correct!");
            score++;
        } else {
            resultText.text("Incorrect. You've lost 5 seconds of time.");

            if (secondsLeft >= 5) {
                secondsLeft = secondsLeft - 5;
            } else {
                gameOver();
            }

        }

        selectedChoice.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);



    });
});

function clearHighscores(event) {
    event.preventDefault();

    highScores = [];
    localStorage.clear();

    $("ul").empty();
}

function saveHighScore(event) {
    event.preventDefault();

    let score = {
        score: mostRecentScore,
        name: username.val()
    };
    highScores.push(score);

    highScores.sort((a, b) => {
        return b.score - a.score;
    });

    highScores.splice(5);
    localStorage.setItem("highScores", JSON.stringify(highScores));

    $("#quiz").css("display", "none");
    $("#gameover").css("display", "none");
    $("#highscores").css("display", "inline-block");
    timeEl.text("0");

    $("#highscoreslist").append(highScores.map(score => {
        return `<li>${score.name} - ${score.score}</li>`
    }).join(""))


};

function gameOver() {
    mostRecentScore = score;
    scoreDisplay.text(score);
    secondsLeft = 0;
    timeEl.text("0");
}

function timer() {
    secondsLeft = 60;
    let timerInterval = setInterval(function () {
        if (secondsLeft > 0) {
            secondsLeft--;
        } else if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            timeEl.text("0");
        }

        timeEl.text(secondsLeft);

        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            mostRecentScore = score;
            scoreDisplay.text(score);
            timeEl.text("0");
            $("#quiz").css("display", "none");
            $("#gameover").css("display", "inline-block");
        }
    }, 1000);
}
