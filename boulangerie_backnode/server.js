const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();
const port = 3001;


// Configuration de MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boulangerie'
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
  });

// Connexion à MySQL
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL : ' + err.stack);
    return;
  }
  console.log('Connecté à MySQL avec l\'ID : ' + connection.threadId);
});

// Middleware pour analyser les données JSON
app.use(bodyParser.json());

// Récupérer tous les produits nejah
app.get('/produitsnejah', (req, res) => {
  const recupererProduitsQuery = 'SELECT * FROM nejah';
  connection.query(recupererProduitsQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Récupérer tous les Dépenses parSemaine
app.get('/depensessemaine', (req, res) => {
  const recupererProduitsQuery = 'SELECT * FROM ouvrierstotal';
  connection.query(recupererProduitsQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Récupérer tous les produits nejah
app.get('/produitsnejahh/:id', (req, res) => {
  const id = req.params.id;
  const recupererProduitsQuery = 'SELECT * FROM nejah where id = ?';
  connection.query(recupererProduitsQuery,[id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Récupérer tous les magasins
app.get('/produitsmagasins', (req, res) => {
  const recupererProduitsQuery = 'SELECT magasin,nom, SUM(quantite) as quantite, SUM(prixtotal) as prixtotal FROM magasins GROUP BY magasin ,nom';
  connection.query(recupererProduitsQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Récupérer tous les magasins
app.get('/depensessemainegroupe', (req, res) => {
  const recupererProduitsQuery = 'SELECT nom, SUM(montant) as montant FROM ouvrierstotal GROUP BY nom';
  connection.query(recupererProduitsQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});
// Récupérer tous les produits magasins
app.get('/produitsmagasins/:magasin', (req, res) => {
  const  magasin  = req.params.magasin;
  const recupererProduitsQuery = 'SELECT * FROM magasins where magasin = ?';
  connection.query(recupererProduitsQuery, [magasin], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/produitsmagasinss/:id', (req, res) => {
  const  id  = req.params.id;
  const recupererProduitsQuery = 'SELECT * FROM magasins where id = ?';
  connection.query(recupererProduitsQuery, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Récuperer tous les ouvriers
app.get('/ouvriers', (req, res) => {
  const recupererProduitsQuery = 'SELECT * FROM ouvriers';
  connection.query(recupererProduitsQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Recuperer dernier encien credit
app.get('/dernierenciencredit', (req, res) => {
  const recupererProduitsQuery = 'SELECT totalcredit FROM caisselivreur ORDER BY id DESC LIMIT 1';


  connection.query(recupererProduitsQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});


// Ajout caisse Livreur
app.post('/ajoutcaisselivreur', (req, res) => {
  const { caisse,recette,enciencredit,credit,totalcredit,montantprisparlivreur,date} = req.body;
  const ajoutProduitQuery = 'INSERT INTO caisselivreur (caisse,recette,enciencredit,credit,totalcredit,montantprisparlivreur,date) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(ajoutProduitQuery, [caisse,recette,enciencredit,credit,totalcredit,montantprisparlivreur,date], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du produit : ' + err.stack);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
      return;
    }


    // Renvoyer les données du produit ajouté en réponse
    const produitAjoute = {recette,enciencredit,credit,totalcredit,montantprisparlivreur,date};
    res.status(200).json({ message: 'Produit ajouté avec succès', produit: produitAjoute });
  });
});


//Ajout d'ouvriers par leurs dépenses

app.post('/ajoutouvrier', (req, res) => {
  const { nom, montant, temps } = req.body;
  const ajoutProduitQuery = 'INSERT INTO ouvriers (nom, montant, temps) VALUES (?, ?, ?)';
  const ajoutProduitTotalQuery = 'INSERT INTO ouvrierstotal (nom, montant, temps) VALUES (?, ?, ?)';

  
  
  // Exécutez la première requête d'insertion dans la table ouvriers
  connection.query(ajoutProduitQuery, [nom, montant, temps], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du produit : ' + err.stack);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
      return;
    }
    
    // Exécutez la deuxième requête d'insertion dans la table ouvrierstotal
    connection.query(ajoutProduitTotalQuery, [nom, montant, temps], (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'ajout du produit dans la table ouvrierstotal : ' + err.stack);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du produit dans la table ouvrierstotal' });
        return;
      }
      
      // Renvoyer les données du produit ajouté en réponse
      const produitAjoute = { nom, montant, temps };
      res.status(200).json({ message: 'Produit ajouté avec succès', produit: produitAjoute });
    });
  });
});


app.post('/ajoutproduitmagasin', (req, res) => {
  const { magasin,nom,pu, quantite,prixtotal, date} = req.body;
  const ajoutProduitQuery = 'INSERT INTO magasins (magasin, nom, pu,quantite,prixtotal,tempsajout) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(ajoutProduitQuery, [magasin,nom,pu,quantite,prixtotal,date], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du produit : ' + err.stack);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
      return;
    }
    // Renvoyer les données du produit ajouté en réponse
    const produitAjoute = {magasin,nom,pu, quantite,prixtotal, date};
    res.status(200).json({ message: 'Produit ajouté avec succès', produit: produitAjoute });
  });
});

// Fiche Nejah

app.get('/fichenejah', (req, res) => {
  const sqlQuery = `
    SELECT 
        nom,
        SUM(quantite) AS total_quantite,
        SUM(prixtotal) AS total_prix
    FROM 
        nejah
    GROUP BY 
        nom;
  `;
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Fiche Ouvriers

app.get('/ficheouvriers', (req, res) => {
  const sqlQuery = `
    SELECT 
        nom,
        SUM(montant) AS total_montant
    FROM 
        ouvriers
    GROUP BY 
        nom;
  `;
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits : ' + err.stack);
      res.status(500).send('Erreur lors de la récupération des produits');
      return;
    }
    res.status(200).json(results);
  });
});

// Ajouter un produit
app.post('/produitsnejah', (req, res) => {
  const { nom, pu, quantite, date, prixtotal } = req.body;
  const ajoutProduitQuery = 'INSERT INTO nejah (nom, pu, quantite, prixtotal, tempsajout) VALUES (?, ?, ?, ?, ?)';
  connection.query(ajoutProduitQuery, [nom, pu, quantite, prixtotal, date], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du produit : ' + err.stack);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
      return;
    }
    // Renvoyer les données du produit ajouté en réponse
    const produitAjoute = { nom, pu, quantite, prixtotal, date };
    res.status(200).json({ message: 'Produit ajouté avec succès', produit: produitAjoute });
  });
});


// Modifier un produit
app.put('/produitsnejah/:id', (req, res) => {
  const productId = req.params.id;
  const { quantite, prixtotal} = req.body;
  const modifierProduitQuery = 'UPDATE nejah SET quantite = ?,prixtotal= ? WHERE id = ?';
  connection.query(modifierProduitQuery, [quantite,prixtotal, productId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification du produit : ' + err.stack);
      res.status(500).send('Erreur lors de la modification du produit');
      return;
    }
    res.status(200).send('Produit modifié avec succès');
  });
});

// Supprimer un produit nejah
app.delete('/produitsnejah/:id', (req, res) => {
  const productId = req.params.id;
  const supprimerProduitQuery = 'DELETE FROM nejah WHERE id = ?';
  connection.query(supprimerProduitQuery, [productId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression du produit : ' + err.stack);
      res.status(500).send('Erreur lors de la suppression du produit');
      return;
    }
    res.status(200).send('Produit supprimé avec succès');
  });
});

// Modifier un produit magasin
app.put('/produitsmagasins/:id', (req, res) => {
  const productId = req.params.id;
  const { quantite, prixtotal } = req.body;
  const modifierProduitQuery = 'UPDATE magasins SET quantite = ?, prixtotal = ? WHERE id = ?';
  connection.query(modifierProduitQuery, [quantite, prixtotal, productId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification du produit : ' + err.stack);
      res.status(500).send('Erreur lors de la modification du produit');
      return;
    }
    res.status(200).send('Produit modifié avec succès');
  });
});

// Supprimer un produit magasin
app.delete('/produitsmagasins/:id', (req, res) => {
  const productId = req.params.id;
  const supprimerProduitQuery = 'DELETE FROM magasins WHERE id = ?';
  connection.query(supprimerProduitQuery, [productId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression du produit : ' + err.stack);
      res.status(500).send('Erreur lors de la suppression du produit');
      return;
    }
    res.status(200).send('Produit supprimé avec succès');
  });
});


// Endpoint pour supprimer toutes les lignes de la table "nejah"
app.delete('/supprimerdepensessemaine', (req, res) => {
  const deleteQuery = 'DELETE FROM ouvrierstotal';
  connection.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la facture :', err);
      res.status(500).send('Erreur lors de la suppression de la facture');
    } else {
      console.log('Toutes les lignes de la table "nejah" ont été supprimées.');
      res.status(200).send('Toutes les lignes de la table "nejah" ont été supprimées.');
    }
  });
});
// Endpoint pour supprimer toutes les lignes de la table "nejah"
app.delete('/supprimerproduitsnejah', (req, res) => {
  const deleteQuery = 'DELETE FROM nejah';
  connection.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la facture :', err);
      res.status(500).send('Erreur lors de la suppression de la facture');
    } else {
      console.log('Toutes les lignes de la table "nejah" ont été supprimées.');
      res.status(200).send('Toutes les lignes de la table "nejah" ont été supprimées.');
    }
  });
});

//supprimer tous les magasins et leurs produits

app.delete('/supprimerproduitsmagasins', (req, res) => {
  const deleteQuery = 'DELETE FROM magasins';
  connection.query(deleteQuery, (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la facture :', err);
      res.status(500).send('Erreur lors de la suppression de la facture');
    } else {
      console.log('Toutes les lignes de la table "nejah" ont été supprimées.');
      res.status(200).send('Toutes les lignes de la table "nejah" ont été supprimées.');
    }
  });
});

// Route pour supprimer toutes les lignes des tables magasins, nejah et ouvriers
app.delete('/deletefiche', (req, res) => {
  const sqlMagasins = "DELETE FROM magasins";
  const sqlNejah = "DELETE FROM nejah";
  const sqlOuvriers = "DELETE FROM ouvriers";

  connection.query(sqlMagasins, (err, resultMagasins) => {
    if (err) {
      console.error('Erreur lors de la suppression des lignes de la table magasins :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression des lignes de la table magasins' });
      return;
    }
    console.log('Lignes supprimées de la table magasins:', resultMagasins.affectedRows);
    
    // Suppression des lignes de la table nejah
    connection.query(sqlNejah, (err, resultNejah) => {
      if (err) {
        console.error('Erreur lors de la suppression des lignes de la table nejah :', err);
        res.status(500).json({ error: 'Erreur lors de la suppression des lignes de la table nejah' });
        return;
      }
      console.log('Lignes supprimées de la table nejah:', resultNejah.affectedRows);
      
      // Suppression des lignes de la table ouvriers
      connection.query(sqlOuvriers, (err, resultOuvriers) => {
        if (err) {
          console.error('Erreur lors de la suppression des lignes de la table ouvriers :', err);
          res.status(500).json({ error: 'Erreur lors de la suppression des lignes de la table ouvriers' });
          return;
        }
        console.log('Lignes supprimées de la table ouvriers:', resultOuvriers.affectedRows);

        res.json({ message: 'Lignes supprimées de toutes les tables' });
      });
    });
  });
});


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});
