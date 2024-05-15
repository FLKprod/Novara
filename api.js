const username = localStorage.getItem("user");

// Mettre à jour le nom d'utilisateur dans la page
if (username) {
    const userSpan = document.getElementById("user");
    userSpan.textContent = ` - Utilisateur: ${username}`;
}

fileInput.addEventListener('change', () => {
    scanFile();
});

document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
    document.body.style.backgroundColor = '#f0f0f0';
});

document.body.addEventListener('dragleave', (e) => {
    e.preventDefault();
    document.body.style.backgroundColor = '';
});

document.body.addEventListener('drop', (e) => {
    e.preventDefault();
    document.body.style.backgroundColor = '';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
    }
});


async function checkUrl() {
    const apiKey = '714a19d995448c198dc77aa6a59f6822497ed95f5899221d155787c9faa6cce7'; // Remplacez 'YOUR_API_KEY' par votre clé d'API VirusTotal
    const url = document.getElementById('urlInput').value;

    // Vérifier si l'URL est vide
    if (!url) {
        alert("Veuillez entrer un lien à vérifier.");
        return;
    }

    // Effectuer une requête à l'API VirusTotal
    const response = await fetch(`https://www.virustotal.com/vtapi/v2/url/scan?apikey=${apiKey}&url=${encodeURIComponent(url)}`, {
        method: 'POST'
    });

    // Vérifier si la requête a réussi
    if (response.ok) {
        const data = await response.json();
        // Afficher le résultat
        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
    } else {
        alert("Une erreur s'est produite lors de la vérification de l'URL.");
    }
}