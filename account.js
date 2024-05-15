document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Récupérer les valeurs saisies par l'utilisateur
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        console.log(username+"/"+password)
        fetch('credentials.json')
        .then(response => response.json())
        .then(validCredentials => {
            // Vérifie si les identifiants saisis correspondent à ceux de la base de données
            for (let i = 0; i < validCredentials.length; i++) {
                console.log(validCredentials[i])
                if (username === validCredentials[i].username && password === validCredentials[i].password) {
                    localStorage.setItem("user",username);
            window.location.href = "tools.html";
            updateUser(username);
                }
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier JSON:', error);
        });
    });
    
});

document.addEventListener("DOMContentLoaded", function() {
    const inscriptionform = document.getElementById("inscription-form");

    inscriptionform.addEventListener("submit", function(event) {
        event.preventDefault();

        // Récupérer les valeurs saisies par l'utilisateur
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const licence = document.getElementById("license").value;

        // Charger le contenu du fichier JSON existant
        fetch('credentials.json')
            .then(response => response.json())
            .then(credentials => {
                // Vérifier si l'adresse e-mail est déjà présente dans le fichier JSON
                const emailExists = credentials.some(credential => credential.email === email);
                if (emailExists) {
                    alert("L'adresse e-mail est déjà utilisée. Veuillez en choisir une autre.");
                } else {
                    // Créer un nouvel objet avec les informations saisies par l'utilisateur
                    const newCredential = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        licence: licence
                    };

                    // Ajouter le nouvel objet au tableau des identifiants
                    credentials.push(newCredential);

                    // Sauvegarder le fichier JSON mis à jour
                    return fetch('credentials.json', {
                        method: 'PUT', // Utiliser la méthode PUT pour mettre à jour le fichier JSON
                        body: JSON.stringify(credentials),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    window.location.href = "index.html";
                }
            })
            .then(() => {
                // Rediriger l'utilisateur vers la page d'accueil
                
            })
            .catch(error => {
                console.error('Erreur lors du traitement des données JSON:', error);
            });
    });
});



function verifyCredentials(username, password) {
    // Charger le fichier JSON via fetch
    
}


function updateUser(username) {
    const userSpan = document.getElementById("user");
    userSpan.textContent = ` - Utilisateur: ` + localStorage.getItem("user");
}