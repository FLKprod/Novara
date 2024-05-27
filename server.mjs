import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors'; //

const app = express();
const port = 3000; // Changer le port si nécessaire
const apiKey = '714a19d995448c198dc77aa6a59f6822497ed95f5899221d155787c9faa6cce7'; // Remplacez par votre clé API

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/scan', async (req, res) => {
    const url = req.body.url;
    try {
        const response = await fetch('https://www.virustotal.com/vtapi/v2/url/scan', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `apikey=${apiKey}&url=${encodeURIComponent(url)}`
        });
        const data = await response.json();

       

        // Envoyer la réponse avec la couleur
        console.log(color)
        res.json({ result: data, color });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la soumission de l\'URL.' });
    }
});


app.get('/report/:scanId', async (req, res) => {
    const scanId = req.params.scanId;
    try {
        const response = await fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${scanId}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du rapport.' });
    }
});

app.listen(port, () => {
    console.log(`Serveur proxy en écoute sur http://localhost:${port}`);
});
