async function calculateFileHash(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            crypto.subtle.digest('SHA-256', arrayBuffer).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convertir en tableau d'octets
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convertir en chaîne hexadécimale
                resolve(hashHex);
            }).catch(error => {
                console.error('Hashing error:', error);
                document.getElementById('result').innerText = 'An error occurred while hashing the file';
                reject(error);
            });
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}




document.getElementById('fileInput').addEventListener('change', async function(event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    // Supprimer une partie de la page HTML
    const elementsToRemove = document.querySelectorAll('.remove-on-upload');
    elementsToRemove.forEach(element => element.remove());

    // Afficher un message de chargement avec une classe et une image gif
    const resultDiv = document.getElementById('result');

    const file = event.target.files[0];

    try {
        // Attendre que le hash soit calculé
        const hashHex = await calculateFileHash(file);

        // Log le hash ici
        console.log(hashHex);

        // Vérifier si le hash est déjà présent dans la base de données
        const params = new URLSearchParams();
        params.append('hash', hashHex);

        fetch('/check_hash_bdd', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                let resultsHtml = '<p class="info-message-resultat">Résultats de l\'analyse :</p>';
                resultsHtml += '<div class="result-status"><a href="#" class="status-link red"><span class="status-indicator red"></span> <span>Ne pas ouvrir</span></a></div>';
                resultDiv.innerHTML = resultsHtml;
                console.log("Le Hash du fichier est déjà présent dans la base de données. Pas besoin de le soumettre pour analyse.");
                // Vous pouvez ajouter ici le code pour afficher un message ou effectuer d'autres actions si nécessaire
            } else {
                resultDiv.innerHTML = `
                    <img class="loading-gif" src="${loadingGifPath}" alt="Chargement...">
                    <div class="loading-message">Analyse en cours...</div>
                `;
                // Si le hash n'est pas présent dans la base de données, uploader le fichier pour analyse
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
                            // Ajouter le hash à la liste noire
                            fetch('/add_blacklist_hash', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: new URLSearchParams({ hash: hashHex })
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Hash ajouté à la liste noire:', data.message);
                            })
                            .catch(err => console.error('Erreur lors de l\'ajout du hash à la liste noire:', err));
                        } else {
                            resultsHtml += '<p class="info-message">Le fichier semble ne pas être malveillant. Pour en être certain, veuillez répondre aux questions de sécurité.</p>';
                            resultsHtml += '<div class="result-status"><a href="/question" class="status-link orange"><span class="status-indicator orange"></span> <p class="message-btn">Répondre aux questions de sécurité</p></a></div>';
                        }
                        resultDiv.innerHTML = resultsHtml;
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    resultDiv.innerHTML = 'Une erreur est survenue : ' + error.message;
                });
            }
        })
        .catch(err => console.error(err));
    } catch (error) {
        console.error('Erreur lors du calcul du hash:', error);
        resultDiv.innerText = 'Une erreur est survenue lors du calcul du hash du fichier';
    }
});


document.getElementById('urlInput').addEventListener('change', function(event) {

    var resultDiv=document.getElementById('result')
    console.log(document.getElementById('urlInput').value)
    url_sans_www = document.getElementById('urlInput').value;
    url = ensureWWW(url_sans_www);
    // Supprimer une partie de la page HTML
    const elementsToRemove = document.querySelectorAll('.remove-on-upload');
    elementsToRemove.forEach(element => element.remove());

    resultDiv.innerHTML = `
        <img class="loading-gif" src="${loadingGifPath}" alt="Chargement...">
        <div class="loading-message">Analyse en cours...</div>
    `;

    fetch('/check_url_blackbdd', {
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
                            body: new URLSearchParams({ url: url_sans_www })
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

