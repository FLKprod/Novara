document.getElementById('fileInput').addEventListener('change', function(event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    const elementsToRemove = document.querySelectorAll('.remove-on-upload');
    elementsToRemove.forEach(element => element.remove());

    const resultDiv = document.getElementById('result');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    resultDiv.innerHTML = 
        `<img class="loading-gif" src="${loadingGifPath}" alt="Chargement...">
        <div class="loading-message">Analyse en cours...</div>`;

    progressContainer.style.display = 'block';

    const socket = io.connect();

    socket.on('update_progress', function(data) {
        animateProgressBar(data.progress);
    });

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
            }
            resultDiv.innerHTML = resultsHtml;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred: ' + error.message;
    });
});

function animateProgressBar(targetProgress) {
    const progressBar = document.getElementById('progressBar');
    const currentProgress = parseFloat(progressBar.style.width) || 0;  // Ensure it's a number or default to 0
    const step = (targetProgress - currentProgress) / 10;

    function updateProgress() {
        let newProgress = parseFloat(progressBar.style.width) || 0;  // Ensure it's a number or default to 0
        newProgress += step;
        if (newProgress > targetProgress) {
            newProgress = targetProgress;
        }
        progressBar.style.width = newProgress + '%';
        progressBar.textContent = Math.round(newProgress) + '%';

        if (newProgress < targetProgress) {
            requestAnimationFrame(updateProgress);
        }
    }

    requestAnimationFrame(updateProgress);
}

document.getElementById('urlInput').addEventListener('change', function(event) {
    const resultDiv = document.getElementById('result');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const url_input = event.target.value;
    const url = ensureWWW(url_input);

    // Supprimer les éléments précédents
    const elementsToRemove = document.querySelectorAll('.remove-on-upload');
    elementsToRemove.forEach(element => element.remove());

    // Afficher l'indicateur de chargement
    resultDiv.innerHTML = `
        <img class="loading-gif" src="${loadingGifPath}" alt="Chargement...">
        <div class="loading-message">Analyse en cours...</div>`;

    progressContainer.style.display = 'block';

    // Se connecter au socket pour la progression (si nécessaire)
    const socket = io.connect();
    socket.on('update_progress', function(data) {
        animateProgressBar(data.progress);
    });

    // Envoyer la requête POST pour vérifier l'URL dans la base de données
    fetch('/check_url_blackbdd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            let resultsHtml = '<p class="info-message-resultat">Résultats de l\'analyse :</p>';
            resultsHtml += '<div class="result-status"><a href="#" class="status-link red"><span class="status-indicator red"></span> <span>Ne pas ouvrir</span></a></div>';
            resultDiv.innerHTML = resultsHtml;
        } else {
            fetch('/check_url_whitebdd', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({url: url})
            })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    let resultsHtml = '<p class="info-message-resultat">Résultats de l\'analyse :</p>';
                    resultsHtml += '<div class="result-status"><a href="#" class="status-link red"><span class="status-indicator red"></span> <span>OK</span></a></div>';
                    resultDiv.innerHTML = resultsHtml;
                } else {
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
                                fetch('/add_blacklist_url', {
                                    method: 'POST',
                                    headers: {
                                        accept: 'application/json',
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    body: new URLSearchParams({ url: url_input })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('URL added to blacklist:', data.message);
                                })
                                .catch(err => console.error('Error adding URL to blacklist:', err));
                            } else {
                                resultsHtml += '<p class="info-message">L\'Url semble ne pas être malveillant. Pour en être certain, veuillez répondre aux questions de sécurité.</p>';
                                resultsHtml += '<div class="result-status"><a href="/question" class="status-link orange"><span class="status-indicator orange"></span> <p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                            }

                            resultDiv.innerHTML = resultsHtml;
                        }
                    })
                    .catch(err => console.error(err)); // Ici est correct
                }
            })
            .catch(err => console.error(err)); // Ici était le problème
        }
    })
    .catch(err => console.error(err)); // Correction de la parenthèse en trop ici
});



function ensureWWW(url) {
    url = url.trim();
    
    // Check if the URL starts with http:// or https://
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = 'https://' + url; // Assuming default to HTTPS
    }
    if (!url.startsWith('https://www.') && !url.startsWith('http://www.')) {
        const urlObj = new URL(url);
        if (!urlObj.hostname.startsWith('www.')) {
            urlObj.hostname = 'www.' + urlObj.hostname;
        }
        return urlObj.toString();
    }
    return url;
}
