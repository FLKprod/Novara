var confidence = 80;
var answers = {
    question1: null,
    question2: null,
    question3: null
};

function startQuestionnaire() {
    document.getElementById('score').innerHTML = confidence + "%";
}
startQuestionnaire()

function answerQuestion(questionId, answer, buttonId, messageId) {
    var previousAnswer = answers[questionId];

    // Si la réponse précédente est différente de la nouvelle réponse, ajustez le score
    if (previousAnswer !== answer) {
        if (previousAnswer !== null) {
            // Annulez l'effet de la réponse précédente sur le score
            adjustScore(questionId, previousAnswer, false);
        }

        // Appliquez l'effet de la nouvelle réponse sur le score
        adjustScore(questionId, answer, true);

        // Stockez la nouvelle réponse
        answers[questionId] = answer;

        // Mettez à jour l'affichage du score
        console.log("SCORE = " + confidence);
        document.getElementById('score').innerHTML = confidence + "%";
        updateButtonStyles(questionId, buttonId, answer, messageId);
    }
    
        endQuestionnaire(confidence);
}

function updateButtonStyles(questionId, buttonId,  answer, messageId) {
    var yesButton = document.getElementById(`oui-${questionId}`);
    var noButton = document.getElementById(`non-${questionId}`);
    var messageElement = document.getElementById(messageId);

    // Réinitialiser les styles des boutons
    yesButton.style.backgroundColor = '';
    yesButton.style.color = '';
    yesButton.style.border = '';
    noButton.style.backgroundColor = '';
    noButton.style.color = '';
    noButton.style.border = '';
    messageElement.style.color = 'black';

    // Appliquer le style au bouton cliqué
    if (answer) {
        yesButton.style.backgroundColor = '#4CAF50'; // Vert pour "Oui"
        yesButton.style.border = 'none';
    } else {
        noButton.style.backgroundColor = '#f44336'; // Rouge pour "Non"
        noButton.style.border = 'none';
    }
}

function adjustScore(questionId, answer, apply) {
    var impact = getScoreImpact(questionId, answer);
    if (apply) {
        confidence += impact;
    } else {
        confidence -= impact;
    }
}

function getScoreImpact(questionId, answer) {
    switch (questionId) {
        case 'question1':
            return answer ? -10 : 5; // Perte de 10 points pour "Oui", gain de 5 points pour "Non"
        case 'question2':
            return answer ? 10 : -5; // Gain de 10 points pour "Oui", perte de 5 points pour "Non"
        case 'question3':
            return answer ? -20 : 4; // Perte de 20 points pour "Oui", gain de 4 points pour "Non"
        default:
            return 0;
    }
}

function endQuestionnaire(confidence) {
    if (confidence > 80) {
        document.getElementById('paragraphe1').innerHTML = "Votre fichier a obtenu un indice de confiance de <strong>" + confidence + " %</strong>, ce qui est <span class='texte-vert'>très positif</span>.";
        document.getElementById('paragraphe2').innerHTML = "Cela signifie que votre fichier est jugé sûr et ne présente pas de risques majeurs de sécurité. Cependant, restez vigilant et continuez à suivre les bonnes pratiques de sécurité pour garantir une protection optimale."
        document.getElementById('score').style.color = '#63C500';
        if (confidence == 99) {
            document.getElementById('img1').src = ImageUrl1;
        } else if (confidence >= 95 && confidence < 99) {
            document.getElementById('img1').src = ImageUrl2;
        } else if (confidence >= 90 && confidence < 95) {
            document.getElementById('img1').src = ImageUrl3;
        } else if (confidence >= 85 && confidence < 90) {
            document.getElementById('img1').src = ImageUrl4;
        } else {
            document.getElementById('img1').src = ImageUrl5;
        }  
    } else if (confidence > 60 && confidence <= 80) {
        document.getElementById('paragraphe1').innerHTML = "Votre fichier a obtenu un indice de confiance de <strong>" + confidence + " %</strong>, ce qui est <span class='texte-vert-clair'>positif</span>.";
        document.getElementById('paragraphe2').innerHTML = "Cela signifie que votre fichier est relativement sûr, mais il peut présenter des risques potentiels. Nous vous recommandons de vérifier attentivement le fichier avant de l'ouvrir et de suivre les bonnes pratiques de sécurité pour minimiser les risques."
        document.getElementById('score').style.color = '#C2DD00';
        if (confidence >= 70) {
            document.getElementById('img1').src = ImageUrl6;
        } else {
            document.getElementById('img1').src = ImageUrl7;
        }  
    } else if (confidence > 40 && confidence <= 60) {
        document.getElementById('paragraphe1').innerHTML = "Votre fichier a obtenu un indice de confiance de <strong>" + confidence + " %</strong>, ce qui est <span class='texte-orange'>correct</span>.";
        document.getElementById('paragraphe2').innerHTML = "Cela indique qu'il y a un certain risque potentiel associé à ce fichier. Nous vous recommandons de faire preuve de prudence et de vérifier plus en détail avant de l'ouvrir ou de l'utiliser."
        document.getElementById('score').style.color = '#FFB902';
        document.getElementById('img1').src = ImageUrl8;
    } else if (confidence > 20 && confidence <= 40) {
        document.getElementById('paragraphe1').innerHTML = "Votre fichier a obtenu un indice de confiance de <strong>" + confidence + " %</strong>, ce qui est <span class='texte-orange-foncée'>négatif</span>.";
        document.getElementById('paragraphe2').innerHTML = "Cela signifie que le fichier présente des risques de sécurité significatifs. Nous vous conseillons vivement de ne pas ouvrir ce fichier et de prendre les mesures nécessaires pour le vérifier ou le supprimer. Assurez-vous de suivre les protocoles de sécurité appropriés pour protéger vos données."
        document.getElementById('score').style.color = '#FC6902';
        document.getElementById('img1').src = ImageUrl9;
    } else if (confidence <= 20) {
        document.getElementById('paragraphe1').innerHTML = "Votre fichier a obtenu un indice de confiance de <strong>" + confidence + " %</strong>, ce qui est <span class='texte-rouge'>très négatif</span>.";
        document.getElementById('paragraphe2').innerHTML = "Cela signifie que le fichier est considéré comme dangereux et qu'il présente des risques élevés de sécurité. Nous vous recommandons de ne pas ouvrir ce fichier"
        document.getElementById('score').style.color = '#F40505';
        document.getElementById('img1').src = ImageUrl10;
    }      

}