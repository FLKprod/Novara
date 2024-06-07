document.getElementById("ContactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Récupération des valeurs des champs
    var prenom = document.getElementById("prenom").value
    var nom = document.getElementById("nom").value ;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    var WEBHOOK_URL = 'https://discord.com/api/webhooks/1228078613853900850/St-8cUkQY7pH0dodJTUFNT0827XIclL_nE_XVVadlNu7YWR9aOX326nG4FZzvAb9IRS6'; // Remplacez par votre URL de webhook

    

    // La payload
    const payload = {
        content: "Message de : " + nom + " " + prenom + "\n email : " + email + "\n\n" + message + "\n\n\n"
    };

    // Les paramètres d'en-tête de la requête
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11'
    };

    // Enfin on construit notre requête
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    .then(response => {
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
    })
    .catch(error => {
        console.error('ERROR');
        console.error(error);
    });
    const elementsToRemove = document.querySelectorAll('#ContactForm');
    elementsToRemove.forEach(element => element.remove());
    var contactform=document.getElementById("reponse-server");
    contactform.innerHTML = '<h2>Merci pour votre message !</h2>' ////////// FAIRE APPARAITRE DES ELEMENTS POUR REMERCIER LE CLIENT
});