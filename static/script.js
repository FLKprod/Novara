document.getElementById('fileInput').addEventListener('change', function(event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    // Supprimer une partie de la page HTML
    const elementsToRemove = document.querySelectorAll('.remove-on-upload');
    elementsToRemove.forEach(element => element.remove());

    // Afficher un message de chargement avec une classe et une image gif
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <img class="loading-gif" src="${loadingGifPath}" alt="Chargement...">
        <div class="loading-message">Analyse en cours...</div>
    `;

    fetch('/uploadfile', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            resultDiv.innerHTML = `<p>Erreur : ${data.error}</p>`;
        } else {
            const results = data.data.attributes.results;
            let detected = false;
            let resultsHtml = '<p class="info-message-resultat">Résultats de l\'analyse :</p>';
            resultsHtml += '<p class="line-resultat" src="${barrePath}" alt="line"></p>';
            resultsHtml += '<ul>';
            for (const [key, value] of Object.entries(results)) {
                if (value.result && value.result !== 'clean') {
                    resultsHtml += `<li><strong>${key}</strong>: ${value.result}</li>`;
                    detected = true;
                }
            }
            resultsHtml += '</ul>';

            if (detected) {
                resultsHtml += '<div class="result-status"><a href="#" class="status-link red"><span class="status-indicator red"></span> <span>Ne pas ouvrir</span></a></div>';
            } else {
                resultsHtml += '<p class="info-message">Le fichier semble ne pas être malveillant. Pour en être certain, veuillez répondre aux questions de sécurité.</p>';
                resultsHtml += '<div class="result-status"><a href="/question" class="status-link orange"><span class="status-indicator orange"></span> <p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                resultsHtml += '<p class="info-message-pourquoi">Pourquoi répondre aux questions de sécurité ?</p>';
                resultsHtml += '<p class="line-" src="${barrePath}" alt="line"></p>';
                resultsHtml += '<p class="info-message">Ces questions nous permettront d\'évaluer plus précisément le niveau de confiance à accorder à votre fichier. Votre participation est cruciale pour garantir une protection optimale contre les menaces potentielles.</p>';
            }
            resultDiv.innerHTML = resultsHtml;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred: ' + error.message;
    });
});

document.getElementById('urlInput').addEventListener('change', function(event) {
        var resultDiv=document.getElementById('result')
        console.log(document.getElementById('urlInput').value)
        url = document.getElementById('urlInput').value;
        url = ensureWWW(url);
        // Supprimer une partie de la page HTML
        const elementsToRemove = document.querySelectorAll('.remove-on-upload');
        elementsToRemove.forEach(element => element.remove());

        resultDiv.innerHTML = `
            <img class="loading-gif" src="${loadingGifPath}" alt="Chargement...">
            <div class="loading-message">Analyse en cours...</div>
        `;
        fetch('/uploadurl', {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({url: url})
        })
        .then(response => response.json())
        .then(data => {
            
            if (data.error) {
                resultDiv.textContent = `Erreur : ${data.error}`;
            } else {
                const results = data.data.attributes.results;
                let detected = false;
                let resultsHtml = '<p class="info-message-resultat">Résultats de l\'analyse :</p>';
                resultsHtml += '<p class="line-resultat" src="${barrePath}" alt="line"></p>';
                resultsHtml += '<ul>';
                for (const [key, value] of Object.entries(results)) {
                    if (value.result && value.result !== 'clean' && value.result !== 'unrated') {
                        resultsHtml += `<li><strong>${key}</strong>: ${value.result}</li>`;
                        detected = true;
                    }
                }
                resultsHtml += '</ul>';
    
                if (detected) {
                    resultsHtml += '<div class="result-status"><a href="#" class="status-link red"><span class="status-indicator red"></span> <span>Ne pas ouvrir</span></a></div>';
                } else {
                    resultsHtml += '<p class="info-message">L\'Url semble ne pas être malveillant. Pour en être certain, veuillez répondre aux questions de sécurité.</p>';
                    resultsHtml += '<div class="result-status"><a href="/question" class="status-link orange"><span class="status-indicator orange"></span> <p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                    resultsHtml += '<p class="info-message-pourquoi">Pourquoi répondre aux questions de sécurité ?</p>';
                    resultsHtml += '<p class="line-" src="${barrePath}" alt="line"></p>';
                    resultsHtml += '<p class="info-message">Ces questions nous permettront d\'évaluer plus précisément le niveau de confiance à accorder à votre fichier. Votre participation est cruciale pour garantir une protection optimale contre les menaces potentielles.</p>';
                }
    
                resultDiv.innerHTML = resultsHtml;
            }})
        .catch(err => console.error(err));
    });

var score = 70;
var click = 1;

function confirmClick(signe) {
    var questionElement = document.getElementById('question-base');
    if (questionElement) {
        if (click === 1) {
            questionElement.innerHTML = "Question 2 : Connaissez-vous le contenu du courriel ?";
            if (signe === '+') {
                score += 5;
            } else if (signe === '-') {
                score -= 5;
            }
        } else if (click === 2) {
            questionElement.innerHTML = "Question 3 : Avez-vous déjà reçu un courriel de cet expéditeur ?";
            if (signe === '+') {
                score += 5;
            } else if (signe === '-') {
                score -= 5;
            }
        }
        // Ajouter d'autres conditions pour des questions supplémentaires
        click++;
        console.log('Score: ' + score);
        console.log('Click count: ' + click);
    } else {
        console.error('Element with id "question-base" not found.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Pas besoin d'attacher des gestionnaires d'événements supplémentaires
});

    function ensureWWW(url) {
        // Ensure the URL starts with https:// or http://
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            url = 'https://' + url;
        }
        
        // Check if the URL starts with https://www. or http://www.
        if (!url.startsWith('https://www.') && !url.startsWith('http://www.')) {
            // Parse the URL
            const urlObj = new URL(url);
            
            // Add 'www.' to the hostname if not present
            if (!urlObj.hostname.startsWith('www.')) {
                urlObj.hostname = 'www.' + urlObj.hostname;
            }

            // Return the modified URL as a string
            return urlObj.toString();
        }

        // Return the original URL if already correct
        return url;
    }