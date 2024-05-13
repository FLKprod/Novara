// Récupérer le nom d'utilisateur depuis le stockage local
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