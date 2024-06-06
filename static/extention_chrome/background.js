// Écoute les messages de l'extension
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'scanURL') {
        var url = message.url;
        
        // Effectue l'analyse de l'URL et envoie les résultats à l'interface utilisateur
        scanURL(url, function(results) {
            sendResponse(results);
        });
        
        // Indique que sendResponse sera appelé de manière asynchrone
        return true;
    }
});

// Fonction pour analyser l'URL
function scanURL(url, callback) {
    var resultDiv=document.getElementById('result');
    if (message.action === 'scanURL') {
    fetch('/check_url_bdd', {
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
            resultsHtml += '<div class="result-status"><a href="#" class="status-link red"><span class="status-indicator red"></span> <span>Ne pas ouvrir</span></a></div>';
            resultDiv.innerHTML = resultsHtml;
            console.log("L'URL est déjà présente dans la base de données. Pas besoin de la soumettre pour analyse.");
            // Vous pouvez ajouter ici le code pour afficher un message ou effectuer d'autres actions si nécessaire
        } else {
            console.log("/uploadurl")
            // Si l'URL n'est pas présente dans la base de données, la soumettre pour analyse
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
                            body: new URLSearchParams({ url: url })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('URL added to blacklist:', data.message);
                        })
                        .catch(err => console.error('Error adding URL to blacklist:', err));
                    } else {
                        resultsHtml += '<p class="info-message">L\'Url semble ne pas être malveillant. Pour en être certain, veuillez répondre aux questions de sécurité.</p>';
                        resultsHtml += '<div class="result-status"><a href="/question" class="status-link orange"><span class="status-indicator orange"></span> <p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                        resultsHtml += '<p class="info-message-pourquoi">Pourquoi répondre aux questions de sécurité ?</p>';
                        resultsHtml += '<p class="line-" src="${barrePath}" alt="line"></p>';
                        resultsHtml += '<p class="info-message">Ces questions nous permettront d\'évaluer plus précisément le niveau de confiance à accorder à votre fichier. Votre participation est cruciale pour garantir une protection optimale contre les menaces potentielles.</p>';
                    }
        
                    resultDiv.innerHTML = resultsHtml;
                }
            })
            .catch(err => console.error(err));
        }
    })
    .catch(err => console.error(err));
}
}
