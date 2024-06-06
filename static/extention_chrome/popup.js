document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('scanButton').addEventListener('click', function() {
        // Récupère l'URL actuelle de l'onglet actif
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var url = tabs[0].url;

            

            
            var resultDiv=document.getElementById('result')
            url = ensureWWW(url);
            // Supprimer une partie de la page HTML
            const elementsToRemove = document.querySelectorAll('.remove-on-upload');
            elementsToRemove.forEach(element => element.remove());

            resultDiv.innerHTML = `
                <div class="loading-message">Analyse en cours...</div>
            `;

            fetch('http://127.0.0.1:5000/check_url_bdd', {
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
                    chrome.tabs.update(tabs[0].id, { url: 'https://flkprod.github.io/docs/warning.html'});
                    resultsHtml += '<div class="result-status"><a href="#" class="status-link red"><span class="status-indicator red"></span> <span>Ne pas ouvrir</span></a></div>';
                    resultDiv.innerHTML = resultsHtml;
                    console.log("L'URL est déjà présente dans la base de données. Pas besoin de la soumettre pour analyse.");
                    // Vous pouvez ajouter ici le code pour afficher un message ou effectuer d'autres actions si nécessaire
                } else {
                    console.log("/uploadurl")
                    // Si l'URL n'est pas présente dans la base de données, la soumettre pour analyse
                    fetch('http://127.0.0.1:5000/uploadurl', {
                        method: 'POST',
                        headers: {
                        accept: 'application/json',
                        'content-type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({url: url})
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Change le texte dans la div #result
                        document.getElementById('result').innerText = 'L\'URL actuelle est : ' + url;
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
                                fetch('http://127.0.0.1:5000/add_blacklist_url', {
                                    method: 'POST',
                                    headers: {
                                        accept: 'application/json',
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                    body: new URLSearchParams({ url: url })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    chrome.tabs.update(tabs[0].id, { url: 'https://flkprod.github.io/docs/warning.html'});
                                    console.log('URL added to blacklist:', data.message);
                                })
                                .catch(err => console.error('Error adding URL to blacklist:', err));
                            } else {
                                resultsHtml += '<p class="info-message">L\'Url semble ne pas être malveillant</p>';
                            }
                
                            resultDiv.innerHTML = resultsHtml;
                        }
                    })
                    .catch(err => console.error(err));
                }
            })
            .catch(err => console.error(err));
        });
        });
    });

    function ensureWWW(url) {
        url = url.trim();
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