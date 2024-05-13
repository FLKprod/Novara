document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Récupérer les valeurs saisies par l'utilisateur
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (verifyCredentials(username, password)) {
            localStorage.setItem("user",username);
            window.location.href = "tools.html";
            updateUser(username);
            
            
        } else {
            alert("Nom d'utilisateur ou mot de passe incorrect.");
        }
    });
    
});



function verifyCredentials(username, password) {
    // Supposons que vous ayez une base de données backend avec des identifiants valides
    const validCredentials = [
        { username: "max", password: "123" },
        { username: "yann", password: "456" }
        // Ajoutez d'autres identifiants valides au besoin
    ];

    // Vérifie si les identifiants saisis correspondent à ceux de la base de données
    for (let i = 0; i < validCredentials.length; i++) {
        if (username === validCredentials[i].username && password === validCredentials[i].password) {
            return true;
        }
    }

    return false;
}

function updateUser(username) {
    const userSpan = document.getElementById("user");
    userSpan.textContent = ` - Utilisateur: ` + localStorage.getItem("user");
}