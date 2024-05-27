const username = localStorage.getItem("user");
const apiKey = '714a19d995448c198dc77aa6a59f6822497ed95f5899221d155787c9faa6cce7';
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


document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const url = document.getElementById('urlInput').value;

    fetch('http://localhost:3000/scan', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        const scanId = data.scan_id;
        checkUrlReport(scanId);
    })
    .catch(error => {
        document.getElementById('result').textContent = 'Erreur lors de la soumission de l\'URL.';
        console.error('Erreur:', error);
    });
});

function checkUrlReport(scanId) {
    setTimeout(() => {
        fetch(`http://localhost:3000/report/${scanId}`)
        .then(response => response.json())
        .then(data => {
            if (data.response_code === 1) {
                displayResult(data);
            } else {
                document.getElementById('result').textContent = 'Aucun rapport disponible. Réessayez plus tard.';
            }
        })
        .catch(error => {
            document.getElementById('result').textContent = 'Erreur lors de la récupération du rapport.';
            console.error('Erreur:', error);
        });
    }, 3000); // Attendez 3 secondes avant de vérifier le rapport
}



function displayResult(data) {
    const positives = data.positives;
    const total = data.total;
    const resultText = `L'URL a été détectée comme malveillante par ${positives} sur ${total} scanners.`;
    document.getElementById('result').textContent = resultText;

     // Récupérer le nombre de scanners détectant l'URL comme malveillante
     const maliciousScannersCount = data.positives;

     // Définir la couleur en fonction du nombre de scanners malveillants détectés
     let color;
     if (maliciousScannersCount < 15) {
         color = 'green';
     } else if (maliciousScannersCount < 45) {
         color = 'orange';
     } else {
         color = 'red';
     }
     // Mettre à jour la couleur de l'indicateur
     const indicator = document.getElementById('colorIndicator');
     indicator.style.backgroundColor = color;
}
