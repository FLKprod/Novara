document.getElementById('fileInput').addEventListener('change', function(event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    // Afficher un message de chargement
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Analyse en cours...';

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
            resultDiv.textContent = `Erreur : ${data.error}`;
        } else {
            const results = data.data.attributes.results;
            let detected = false;
            let resultsHtml = '<h3>Résultats de l\'analyse :</h3>';
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
                resultsHtml += '<p class="info-message">Le fichier semble ne pas être malveillant. Pour en savoir plus, veuillez répondre aux questions de sécurité.</p>';
                resultsHtml += '<div class="result-status"><a href="/security-questions" class="status-link orange"><span class="status-indicator orange"></span> <span>Répondre aux questions de sécurité</span></a></div>';
            }

            resultDiv.innerHTML = resultsHtml;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.textContent = 'An error occurred: ' + error.message;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const resultDiv = document.getElementById('resulturl');
    document.getElementById('urlInput').addEventListener('change', function(event) {
        fetch('/uploadurl', {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({url: document.getElementById('urlInput').value})
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultDiv.textContent = `Erreur : ${data.error}`;
            } else {
                const results = data.data.attributes.results;
                let detected = false;
                let resultsHtml = '<h3>Résultats de l\'analyse :</h3>';
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
                    resultsHtml += '<p class="info-message">Le fichier semble ne pas être malveillant. Pour en savoir plus, veuillez répondre aux questions de sécurité.</p>';
                    resultsHtml += '<div class="result-status"><a href="/security-questions" class="status-link orange"><span class="status-indicator orange"></span> <span>Répondre aux questions de sécurité</span></a></div>';
                }
    
                resultDiv.innerHTML = resultsHtml;
            }})
        .catch(err => console.error(err));
    });
});


