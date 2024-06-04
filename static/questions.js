var questions = [
    { text: "Question 1: Avez-vous déjà utilisé ce produit auparavant ?", points: 20 },
    { text: "Question 2: Êtes-vous satisfait de votre expérience précédente ?", points: 20 },
    { text: "Question 3: Recommanderiez-vous ce produit à un ami ?", points: null },
    { text: "Question 4: Avez-vous confiance dans la qualité de ce produit ?", points: 20 },
    { text: "Question 5: Achèteriez-vous ce produit à nouveau ?", points: 20 }
];

var confidence = 70;
var currentQuestionIndex = 0;

function startQuestionnaire() {
    document.getElementById('score').innerHTML = confidence + "%";
    showQuestion();
}
startQuestionnaire()
function showQuestion() {
    document.getElementById('question-base').innerText = questions[currentQuestionIndex].text;
}

function answerQuestion(answer) {
    var currentQuestion = questions[currentQuestionIndex];
    if (answer) {
        if (currentQuestionIndex === 2) {
            confidence += 10;
        }
        else{
            confidence += (currentQuestion.points !== null) ? currentQuestion.points : 10;
        }
    } else {
        if (currentQuestionIndex === 2) {
            confidence -= 100;
        }
        else{
            confidence -= (currentQuestion.points !== null) ? currentQuestion.points : 10;
        }
    }

    console.log("SCORE = " + confidence);
    document.getElementById('score').innerHTML = confidence + "%";
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuestionnaire(confidence);
    }
}

function endQuestionnaire(confidence) {
    document.getElementById('score').innerHTML = confidence + "%";
}