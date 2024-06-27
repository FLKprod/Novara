# VeriFile

VeriFile est une plateforme web collaborative conçue pour renforcer votre sécurité numérique. Elle analyse et quantifie les risques d'origine cyber et aide les organisations à industrialiser leurs programmes de cybersécurité axés sur les risques.

## Table des matières

1. [Contexte](#contexte)
2. [Notre solution](#notre-solution)
3. [Technologies utilisées](#technologies-utilisées)
4. [Concurrents de VeriFile](#concurrents-de-verifile)
5. [Clients potentiels de VeriFile](#clients-potentiels-de-verifile)
6. [Tarification proposée pour VeriFile](#tarification-proposée-pour-verifile)
7. [Comparaison avec les concurrents](#comparaison-avec-les-concurrents)
8. [Prototype & maquette](#prototype--maquette)

## Contexte

Le attaUE par pièce jointe infectée ou par site malveillant demeure une méthode privilégiée pour les cybercriminels exploitant la confiance des utilisateurs envers des documents apparemment légitimes. En 2023, ces attaques ont contribué à une augmentation notable des incidents de sécurité, affectant particulièrement les entreprises.

## Notre solution

VeriFile analyse les pièces jointes et les URLs potentiellement malveillantes, en utilisant l'API de VirusTotal pour comparer les fichiers à une base de données de signatures de virus. Si un virus est détecté, la plateforme émet un avertissement. Si aucun virus n'est détecté, la plateforme pose une série de questions pour évaluer le niveau de risque.

### Fonctionnalités principales

- **Analyse des fichiers** : L'utilisateur peut glisser et déposer un fichier sur la plateforme pour une analyse approfondie.
- **Évaluation du risque** : La plateforme pose des questions pour évaluer le niveau de risque associé à un fichier.
- **Génération du score de confiance** : Un score de confiance est généré pour aider à déterminer la sécurité d'ouverture ou d'utilisation des fichiers et URLs.
- **Sensibilisation des utilisateurs** : Modules éducatifs sur les meilleures pratiques en matière de cybersécurité.

## Technologies utilisées

- **API VirusTotal** : Pour l'analyse des fichiers.
- **Visual Studio Code (VSCode)** : Éditeur de code.
- **Figma**,**Monday** : Outil de design d'interface utilisateur.
- **Trello** : Outil de gestion de projet.
- **Langages de programmation** : HTML, CSS, JavaScript.

## Concurrents de VeriFile

- **Proofpoint** : Solutions complètes de sécurité des emails.
- **Mimecast** : Protection contre le phishing, les spams et les malwares.
- **Cofense** : Détection et réponse aux attaques de phishing.
- **IRONSCALES** : Protection intégrée contre le phishing avec réponse automatisée.

## Clients potentiels de VeriFile

1. **Grandes Entreprises et Corporations** : Secteurs financier, technologique, santé.
2. **PME et Startups** : Agences de marketing, consultants.
3. **Secteur Public et Gouvernemental** : Agences gouvernementales, établissements éducatifs.
4. **Particuliers** : Familles, Etudiants.

## Tarification proposée pour VeriFile

1. **Forfait de Base** : 4 $ par utilisateur et par mois.
2. **Forfait Avancé** : 5 $ par utilisateur et par mois.
3. **Forfait Complet** : 7 $ par utilisateur et par mois.

## Comparaison avec les concurrents

| Produit      | Prix                 | Caractéristiques Principales                                        |
|--------------|----------------------|--------------------------------------------------------------------|
| **VeriFile** | 4 $ - 7 $ par utilisateur/mois | Analyse via VirusTotal, sandboxing, questions de risque, DLP, intégration SIEM, API complète. |
| **Barracuda** | 332 $ par utilisateur/an     | Protection AI, intégration Microsoft 365, sandboxing, alerte en temps réel.       |
| **Avanan**   | 30 $ - 60 $ par utilisateur/mois | ML pour détection de phishing, protection de Slack et Teams, intégration API, sandboxing.       |
| **Proofpoint** | Non spécifié           | Détection AI/ML, DLP, visibilité complète sur les menaces, protection contre phishing, ransomware et compromission de comptes. |
| **Mimecast**  | Non spécifié           | Sécurité des emails basée sur l'IA, protection Microsoft 365, analyse des pièces jointes et URLs. |

## Prototype & maquette

Les prototypes incluent la page d'accueil, les interfaces de connexion et d'inscription, ainsi que la page d'utilisation de l'outil.

---

Pour plus d'informations, veuillez consulter le document détaillé ou contacter notre équipe.

# Installation de l'Application

Ce guide vous aidera à installer et à démarrer l'application sur votre système local.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé un éditeur de code, tel que Visual Studio Code, et que Python est installé sur votre machine.

## Étapes d'Installation

1. **Téléchargement du fichier :**
   - Accédez à la page GitHub du projet et téléchargez le dernier fichier de l'application en cliquant sur *Clone or download* puis sur *Download ZIP*.

2. **Préparation de l'environnement :**
   - Décompressez le fichier téléchargé et ouvrez le dossier avec Visual Studio Code.

3. **Installation des dépendances :**
   - Ouvrez un terminal dans Visual Studio Code (Terminal > New Terminal).
   - Exécutez la commande suivante pour installer les bibliothèques nécessaires :
     ```
     pip install -r requirements.txt
     ```

4. **Lancement de l'application :**
   - Dans le terminal, lancez l'application avec la commande suivante :
     ```
     python app.py
     ```
   - Assurez-vous que l'application est configurée pour s'exécuter sur le port 5000. Si ce n'est pas le cas, vous pouvez modifier le fichier `app.py` pour définir le port approprié.

## Accès à l'Application

Après avoir lancé l'application, ouvrez un navigateur et accédez à `http://localhost:5000` pour commencer à utiliser l'application.

## Support

Pour toute question ou problème lors de l'installation ou de l'utilisation de l'application, n'hésitez pas à créer une issue sur la page GitHub du projet.


