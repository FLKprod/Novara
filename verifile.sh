#!/bin/bash

# Liste des bibliothèques Python à vérifier
libraries=(
    "Flask"
    "cryptography"
    "sendgrid"
    "flask_sqlalchemy"
    "flask_bcrypt"
    "flask_login"
    "wtforms"
)

# Vérifier si les bibliothèques sont installées et les installer si nécessaire
for lib in "${libraries[@]}"
do
    if ! python3 -c "import $lib" &> /dev/null; then
        echo "La bibliothèque $lib n'est pas installée. Installation en cours..."
        pip install $lib
        echo "Installation de $lib terminée."
    else
        echo "La bibliothèque $lib est déjà installée."
    fi
done

# Lancer app.py
echo "Lancement de app.py..."
python app.py
