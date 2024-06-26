document.getElementById('fileInput').addEventListener('change', function(event) {
    if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = "/connexion";
        return;
    }
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
        console.log('Progress update:', data.progress);
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

            let resultsHtml = '<p class="info-message-resultat">Analyse terminée</p>';
            resultsHtml += '<ul>';
            for (const [key, value] of Object.entries(results)) {
                if (value.result && value.result !== 'clean') {
                    resultsHtml += `<li><strong>${key}</strong>: ${value.result}</li>`;
                    detected = true;
                }
            }
            resultsHtml += '</ul>';

            if (detected) {
                resultsHtml += '<p class="info-message">L\'analyse du fichier est complète et une menace a été détectée. Nous vous déconseillons fortement d\'ouvrir ou d\'utiliser ce fichier.</p>';
                resultsHtml += '<div class="re-do"><a href="/index" class="status-link orange"></span> <p class="message-btn">Faire une nouvelle analyse</p></a></div>';
            } else {
                progressContainer.style.display = 'none';
                resultsHtml += '<p class="info-message">L\'analyse du fichier est complète et aucune menace ne semble avoir été détectée. Pour confirmer cette conclusion, veuillez répondre à quelques questions de sécurité.</p>';
                resultsHtml += '<div class="result-status"><a href="/question" class="status-link orange"><p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                resultsHtml += '<p class="line-resultat" src="${barrePath}" alt="line"></p>';
                resultsHtml += '<p class="ou-message">ou</p>';
                resultsHtml += '<p class="line-resultat2" src="${barrePath}" alt="line"></p>';
                resultsHtml += '<div class="re-do"><a href="/index" class="status-link orange"></span> <p class="message-btn">Faire une nouvelle analyse</p></a></div>';
            
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
    if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = "/connexion";
        return;
    }

    const resultDiv = document.getElementById('result');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const url_input = event.target.value;
    const url = ensureWWW(url_input);

    const elementsToRemove = document.querySelectorAll('.remove-on-upload');
    elementsToRemove.forEach(element => element.remove());

    resultDiv.innerHTML = `
        <img class="loading-gif" src="${loadingGifPath}" alt="Chargement...">
        <div class="loading-message">Analyse en cours...</div>`;

    progressContainer.style.display = 'block';

    const socket = io.connect();
    socket.on('update_progress', function(data) {
        animateProgressBar(data.progress);
    });

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
            socket.emit('update_progress', {progress: 100});
            let resultsHtml = '<p class="info-message-resultat">Analyse terminée</p>';
            resultsHtml += '<p class="info-message">L\'analyse de l\'url est complète et une menace a été détectée. Nous vous déconseillons fortement d\'utiliser cette url.</p>';
            resultsHtml += '<div class="re-do"><a href="/index" class="status-link orange"></span> <p class="message-btn">Faire une nouvelle analyse</p></a></div>';
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
                    socket.emit('update_progress', {progress: 100});
                    let resultsHtml = '<p class="info-message-resultat">Analyse terminée</p>';
                    resultsHtml += '<p class="info-message">L\'analyse de l\'url est complète et aucune menace a été détectée. Toutefois, veuillez répondre aux questions de sécurité pour en être sûr.</p>';
                    resultsHtml += '<div class="result-status"><a href="/url" class="status-link orange"><p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                    resultsHtml += '<p class="line-resultat" src="${barrePath}" alt="line"></p>';
                    resultsHtml += '<p class="ou-message">ou</p>';
                    resultsHtml += '<p class="line-resultat2" src="${barrePath}" alt="line"></p>';
                    resultsHtml += '<div class="re-do"><a href="/index" class="status-link orange"></span> <p class="message-btn">Faire une nouvelle analyse</p></a></div>';
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
                        socket.emit('update_progress', {progress: 100});  // Emit 100% progress on receiving the response
                        if (data.error) {
                            resultDiv.textContent = `Erreur : ${data.error}`;
                        } else {
                            const results = data.data.attributes.results;
                            let detected = false;
                            let resultsHtml = '<p class="info-message-resultat">Analyse terminée</p>';
                            resultsHtml += '<ul>';
                            for (const [key, value] of Object.entries(results)) {
                                if (value.result && value.result !== 'clean' && value.result !== 'unrated') {
                                    resultsHtml += `<li><strong>${key}</strong>: ${value.result}</li>`;
                                    detected = true;
                                }
                            }
                            resultsHtml += '</ul>';

                            if (detected) {
                                resultsHtml += '<p class="info-message">L\'analyse de l\'url est complète et une menace a été détectée. Nous vous déconseillons fortement d\'utiliser cette url.</p>';
                                resultsHtml += '<div class="re-do"><a href="/index" class="status-link orange"></span> <p class="message-btn">Faire une nouvelle analyse</p></a></div>';
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
                                progressContainer.style.display = 'none';
                                resultsHtml += '<p class="info-message">L\'analyse de l\'url est complète et aucune menace ne semble avoir été détectée. Pour confirmer cette conclusion, veuillez répondre à quelques questions de sécurité.</p>';
                                resultsHtml += '<div class="result-status"><a href="/url" class="status-link orange"><p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                                resultsHtml += '<p class="line-resultat" src="${barrePath}" alt="line"></p>';
                                resultsHtml += '<p class="ou-message">ou</p>';
                                resultsHtml += '<p class="line-resultat2" src="${barrePath}" alt="line"></p>';
                                resultsHtml += '<div class="re-do"><a href="/index" class="status-link orange"></span> <p class="message-btn">Faire une nouvelle analyse</p></a></div>';
                            }   

                            resultDiv.innerHTML = resultsHtml;
                        }
                    })
                    .catch(err => console.error(err));
                }
            })
            .catch(err => console.error(err));
        }
    })
    .catch(err => console.error(err));
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
