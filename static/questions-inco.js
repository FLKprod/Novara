var questions = [
    { text: "Question 1 : Le fichier est-il de type courant (par exemple, .docx, .pdf) ?", points: null },
    { text: "Question 2 : Le nom du fichier vous semble-t-il familier ou en rapport avec votre travail ?", points: 5 },
    { text: "Question 3 : Le fichier est-il stocké dans un emplacement habituel pour vos documents ?", points: null },
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
        if (currentQuestionIndex === 0) {
            confidence += 5;
        }else if (currentQuestionIndex === 2) {
            confidence += 9;
        }
        else{
            confidence += (currentQuestion.points !== null) ? currentQuestion.points : 10;
        }
    } else {
        if (currentQuestionIndex === 0) {
            confidence -= 10;
        }else if (currentQuestionIndex === 2) {
            confidence -= 15;
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
    if (confidence > 80) {
        document.getElementById('question-base').innerHTML = "Merci d'avoir pris le temps de répondre à ces questions. Suite à cette analyse poussée par notre outil VeriFile, nous estimons la confiance de ce document à " + confidence + " %. Le fichier ne semble pas être malveillant, cependant il n'en reste pas moindre de faire attention !";
    } else if (confidence > 60 && confidence <= 80) {
        document.getElementById('question-base').innerHTML = "Merci d'avoir pris le temps de répondre à ces questions. Suite à cette analyse poussée par notre outil VeriFile, nous estimons la confiance de ce document à " + confidence + " %. Le risque est modéré mais nous conseillons une vérification supplémentaire.";
        document.querySelector('.cercle-vert-clair').style.backgroundColor = 'orange';
    } else if (confidence > 40 && confidence <= 60) {
        document.getElementById('question-base').innerHTML = "Merci d'avoir pris le temps de répondre à ces questions. Suite à cette analyse poussée par notre outil VeriFile, nous estimons la confiance de ce document à " + confidence + " %. Il présente des risques potentiels. Nous recommandons prudence et vérifications complémentaires.";
        document.querySelector('.cercle-vert-clair').style.backgroundColor = 'orange';
    } else if (confidence > 20 && confidence <= 40) {
        document.getElementById('question-base').innerHTML = "Merci d'avoir pris le temps de répondre à ces questions. Suite à cette analyse poussée par notre outil VeriFile, nous estimons la confiance de ce document à " + confidence + " %. Il est probablement risqué. Veuillez procéder avec une extrême prudence.";
        document.querySelector('.cercle-vert-clair').style.backgroundColor = 'orange';
    } else if (confidence <= 20) {
        document.getElementById('question-base').innerHTML = "Merci d'avoir pris le temps de répondre à ces questions. Suite à cette analyse poussée par notre outil VeriFile, nous estimons une confiance de seulement " + confidence + " % pour ce document. Il est très probablement malveillant. Nous conseillons de ne pas l'utiliser.";
        document.querySelector('.cercle-vert-clair').style.backgroundColor = 'red';
    }    
    document.getElementById('oui').style.display = 'none';
    document.getElementById('non').style.display = 'none';
    document.getElementById('line-question-base').style.display = 'none';
    document.querySelector('.slogan').style.top = '-60%';
    document.getElementById('slogan').innerHTML = "Couleur de confiance :";
    document.getElementById('score').style.display = 'none';
    document.querySelector('.cercle-vert-clair').style.top = '-70%';
}