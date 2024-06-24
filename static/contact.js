document.getElementById("ContactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    var prenom = document.getElementById("prenom").value;
    var nom = document.getElementById("nom").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    var sujet = document.getElementById("sujet").value;
    var fichier = document.getElementById("fichier").files[0]; // Récupère le fichier

    // Définir l'URL du webhook en fonction du sujet
    var WEBHOOK_URLS = {
        url: 'https://discord.com/api/webhooks/1248695340023156756/jmjNbBIZJcHv_ePJmJTqRh8LXioVkei6BKytuL-7s4Lq_UcswN0mrXAzEcLOL7g1lgwl',
        support: 'https://discord.com/api/webhooks/1248695035541585920/9Pf7eu6oAmOwirGWzlVBiVf8kiAJ_8_ZlxlrHkXm9obSl_CwUL4P7Ti1ZSxrnNMVmj0C',
        feedback: 'https://discord.com/api/webhooks/1248694869719777442/kPT-DTf8cU7rMOrORyOjTXVga2GZp4vWDTtPJn4ussbJDMsA3nP82dPP6UZnfwnKBt5a',
        autre: 'https://discord.com/api/webhooks/1248695258015858842/L5BGRk5-ujh0imousqrldnen3gNTnKTi3GU44MFielT_zRktWApCV8fx1W9jzbFfDF6U'
    };

    var WEBHOOK_URL = WEBHOOK_URLS[sujet];

    var formData = new FormData();
    formData.append('prenom', prenom);
    formData.append('nom', nom);
    formData.append('email', email);
    formData.append('message', message);

    // Construire l'objet message
    var messageObject = {
        content: "Message de : " + nom + " " + prenom + "\nEmail : " + email + "\n\n" + message
    };

    // Ajouter le fichier à la FormData s'il est présent
    if (fichier) {
        formData.append('fichier', fichier, fichier.name);
        messageObject.file = {
            name: fichier.name,
            size: fichier.size,
            type: fichier.type
        };
    }

    // En-têtes de la requête
    var headers = {
        'User-Agent': 'Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11'
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        headers: headers
    })
    .then(response => {
        if (response.ok) {
            console.log('Message envoyé avec succès');
            var contactform = document.getElementById("reponse-server");
            contactform.innerHTML = '<h2>Merci pour votre message !</h2>'; // Affiche un message de remerciement
        } else {
            console.error('Erreur lors de l\'envoi du message');
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi du message');
        console.error(error);
    });
});
