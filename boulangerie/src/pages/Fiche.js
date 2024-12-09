import { useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import './fiche.css';

function Fiche() {
  const [encienCredit, setEncienCredit] = useState(0);
  const [recette, setRecette] = useState();
  const [montantPris, setMontantPris] = useState(0);
  const [credit, setCredit] = useState(0)
  const [data, setData] = useState([]);
  const [dataOuvriers, setDataOuvriers] = useState([]);
  const [caisse, setCaisse] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalOuvriers, setTotalOuvriers] = useState(0);
  const [magasinsData, setMagasinsData] = useState([]);
  const [sommeTotal, setSommeTotal] = useState([]);
  const [dateJour,setDateJour] = useState('')

  const printPage = () =>{
    
    window.print();
  }
  setInterval(() => {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, locale: 'fr-FR' };
    const date = currentDate.toLocaleString(undefined, options);
    setDateJour(date);
  }, 1000);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const caisseLivreur = {
      caisse: caisse,
      recette: recette,
      enciencredit: encienCredit,
      credit: credit,
      totalcredit: totalCredit,
      montantprisparlivreur: montantPris,
      date: new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString(),
    };
    try {
      const response = await fetch("http://localhost:3001/ajoutcaisselivreur", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(caisseLivreur)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du produit');
      }

      const data = await response.json();
      console.log('Produit ajouté avec succès:', data);
      window.location.reload()

    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetch('http://localhost:3001/produitsmagasins')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        return response.json();
      })
      .then(data => {
        const magasinsObj = {};
        data.forEach(magasin => {
          if (!magasinsObj[magasin.magasin]) {
            magasinsObj[magasin.magasin] = [];
          }
          magasinsObj[magasin.magasin].push(magasin);
        });

        setMagasinsData(magasinsObj);

        const nouvellesSommes = {};
        for (const magasin in magasinsObj) {
          nouvellesSommes[magasin] = magasinsObj[magasin].reduce((somme, produit) => somme + produit.prixtotal, 0);
        }
        setSommeTotal(nouvellesSommes);
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  }, []); // Utilisez un tableau vide pour les dépendances



  useEffect(() => {
    fetch('http://localhost:3001/ficheouvriers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        return response.json();
      })
      .then(data => {
        setDataOuvriers(data);
        setTotalOuvriers(data.reduce((somme, ouvrier) => { return somme + ouvrier.total_montant }, 0));
        
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  }, []);
  useEffect(() => {
    fetch('http://localhost:3001/fichenejah')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setCaisse(data.reduce((caisse, produit) => { return caisse + produit.total_prix }, 0));


      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/dernierenciencredit')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        return response.json();
      })
      .then(data => {
        setEncienCredit(data[0].totalcredit);


      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  }, []);

  


  const handleRecetteChange = (e) => {

    const newRecette = parseInt(e.target.value);
    setRecette(newRecette);
    setCaisse(data.reduce((caisse, produit) => caisse + produit.total_prix, 0));
    const newCredit = caisse - newRecette;
    setCredit(newCredit);
    setTotalCredit(encienCredit + newCredit);
  }

  const handleMontantChange = (e) => {
    const montant = parseInt(e.target.value);
    const updatedTotalCredit = parseInt(encienCredit) + parseInt(credit) - montant;
    setMontantPris(montant);
    setTotalCredit(updatedTotalCredit);
  }

  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, locale: 'fr-FR' };
  const date = currentDate.toLocaleString(undefined, options);
  const handlePrint = () => {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, locale: 'fr-FR' };
    const date = currentDate.toLocaleString(undefined, options);

    const content = `
      <style>
        /* Styles pour la mise en page des tables */
        .container-fluid {
          display: flex; /* Utiliser un affichage flex pour les div enfants */
          flex-wrap: wrap; /* Permettre le retour à la ligne si nécessaire */
        }
  
        .table-container {
          flex: 1; /* Utiliser une largeur flexible pour s'adapter à l'espace disponible */
          margin: 0 10px; /* Ajouter une marge entre les tables */
          box-sizing: border-box; /* Inclure les bordures dans la largeur de la table */
          width: calc(50% - 20px); /* Définir la largeur de chaque table */
        }
  
        /* Styles pour les tables */
        .table {
          width: 100%; /* Utiliser la largeur totale de la table */
          font-size: 12px; /* Définir la taille de la police */
        }
      </style>
      <hr>
      <h3>${date}</h3>
      <hr>
      <div class="container-fluid">
      
        <div class="table-container">
          <table class="table table-bordered">
            <h3>NEJAH</h3>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix Total</th>
            </tr>
            ${data.map(produit => `
              <tr>
                <td>${produit.nom}</td>
                <td>${produit.total_quantite}</td>
                <td>${produit.total_prix}</td>
              </tr>
            `).join('')}
            <tr style="border-top: 2px solid grey;">
              <th>Total Caisse:</th>
              <th colspan="2">${caisse}</th>
            </tr>
            <tr>
              <th>Recette:</th>
              <th colspan="2" > ${recette}</th>
            </tr>
            <tr>
              <th>Montant Pris Par Nejah:</th>
              <th colspan="2">${montantPris}</th>
            </tr>
            <tr>
              <th>Encien Credit: </th>
              <th colspan="2">${encienCredit}</th>
            </tr>
            <tr>
              <th>Crédit:</th>
              <th colspan="2" >${credit}</th>
            </tr>
            <tr>
              <th>Total Credit: </th>
              <th colspan="2"  >${totalCredit}</th>
            </tr>
          </table>
        </div>
        <div class="table-container">
          <table class="table table-bordered">
            <h3>DEPENSES</h3>
            <tr>
              <th>DES</th>
              <th>MONTANT</th>
            </tr>
            ${dataOuvriers.map(ouvrier => `
              <tr>
                <td>${ouvrier.nom}</td>
                <td>${ouvrier.total_montant}</td>
              </tr>
            `).join('')}
            <tr style="border-top: 2px solid grey;">
              <th>Total:</th>
              <th colspan="2">${totalOuvriers}</th>
            </tr>
          </table>
        </div>
      </div>
      <hr>
    `;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const handlePrint2 = () => {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, locale: 'fr-FR' };
    const date = currentDate.toLocaleString(undefined, options);

    const content = `
      <style>
        /* Styles pour la mise en page des tables */
        .container-fluid {
          display: flex; /* Utiliser un affichage flex pour les div enfants */
          flex-wrap: wrap; /* Permettre le retour à la ligne si nécessaire */
        }
  
        .table-container {
          flex: 1; /* Utiliser une largeur flexible pour s'adapter à l'espace disponible */
          margin: 0 10px; /* Ajouter une marge entre les tables */
          box-sizing: border-box; /* Inclure les bordures dans la largeur de la table */
          width: calc(50% - 20px); /* Définir la largeur de chaque table */
        }
  
        /* Styles pour les tables */
        .table {
          width: 100%; /* Utiliser la largeur totale de la table */
          font-size: 12px; /* Définir la taille de la police */
        }
      </style>
      <hr>
      <h3>${date}</h3>
      <hr>
      <div class="container-fluid">
        ${Object.keys(magasinsData).map((nomMagasin, index) => `
          <div class="table-container">
            <h3>${nomMagasin.toUpperCase()}</h3>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>DES</th>
                  <th>QTE</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${magasinsData[nomMagasin].map(produit => `
                  <tr>
                    <td>${produit.nom}</td>
                    <td>${produit.quantite}</td>
                    <td>${produit.prixtotal}</td>
                  </tr>
                `).join('')}
                <tr style="border-top: 2px solid grey;"><th>Total:</th>
                <th colspan="2">${sommeTotal[nomMagasin]}</th></tr>
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>
      <hr>
    `;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = originalContents;
  };




  const handleDeleteFiche = async () => {
    try {
      const response = await fetch("http://localhost:3001/deletefiche", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression des lignes des tables");

      }

      console.log("Lignes supprimées avec succès");
      window.location.reload()
      // Vous pouvez ajouter ici toute logique supplémentaire après la suppression des lignes
    } catch (error) {
      console.error("Erreur lors de la suppression des lignes des tables :", error);
      // Vous pouvez gérer ici les erreurs lors de la suppression des lignes
    }
  };



  return (
    <div class="container-fluid bg-light py-5">
      <h3 style={{ textAlign: 'center' }}>Boulangerie</h3>
      <p style={{ textAlign: 'center' }}>{dateJour}</p>
      <hr style={{border: 'none', borderTop: '3px solid black', margin: '20px 0'}}/>
      <div class="container">
        <form class="mb-3">
          <div class="form-group">
            <label for="recette">Recette :</label>
            <input type="text" class="form-control" id="recette" value={recette} onChange={handleRecetteChange} required />
          </div>
          <div class="form-group">
            <label for="montantPris">Montant Prix Par Livreur :</label>
            <input type="text" class="form-control" id="montantPris" value={montantPris} onChange={handleMontantChange} required />
          </div>
          
        </form>
        <button type="button" class="btn btn-secondary mr-2" onClick={printPage}>Imprimer Fiche</button><br /><br />
        <button type="button" class="btn btn-primary" onClick={handleSubmit}>Enregistrer Caisse Nejah</button> <br />
        {/* 
        <button type="button" class="btn btn-secondary mr-2" onClick={handlePrint}>Imprimer page 1</button>
        <button type="button" class="btn btn-secondary mr-2" onClick={handlePrint2}>Imprimer page 2</button>
        */}

        <div class="row">
          <div class="col-md-3">
            <h3>LIVREUR</h3>
            <table class="table table-bordered" style={{border: '1px solid black'}}>
              
              <tr>
                <th>DES</th>
                <th>QTE</th>
                <th>TOTAL</th>
              </tr>
              {data.map(produit => {
                return <tr>
                  <td>{produit.nom}</td>
                  <td>{produit.total_quantite}</td>
                  <td>{produit.total_prix}</td>
                </tr>;
              })}
              <tr>
                <th>Total Caisse:</th>
                <th colspan="2">{caisse}</th>
              </tr>
              <tr>
                <th>Recette:</th>
                <th colspan="2">{recette}</th>
              </tr>
              <tr>
                <th>Montant Pris Par Nejah:</th>
                <th colspan="2">{montantPris}</th>
              </tr>

              <tr>
                <th>Encien Credit:</th>
                <th colspan="2">{encienCredit}</th>
              </tr>
              <tr>
                <th>Crédit:</th>
                <th colspan="2">{credit}</th>
              </tr>
              <tr>
                <th>Total Credit:</th>
                <th colspan="2">{totalCredit}</th>
              </tr>

            </table >
          </div>
          <br />
<hr style={{border: 'none', borderTop: '3px solid black', margin: '20px 0'}}/>
          <div class="col-md-6">
          <h3> DEPENSES</h3>
            <table class="table table-bordered" style={{border: '1px solid black'}}>
              
              <tr>

                <th>DES</th>
                <th>MONT</th>
              </tr>
              {dataOuvriers.map(ouvrier => {
                return <tr>
                  <td>{ouvrier.nom}</td>
                  <td>{ouvrier.total_montant}</td>
                </tr>

              })}
              <tr>
                <th>Total:</th>
                <th colspan="2">{totalOuvriers}</th>
              </tr>

            </table>
          </div>
        </div>
<hr style={{border: 'none', borderTop: '3px solid black', margin: '20px 0'}}/>
        {Object.keys(magasinsData).map((nomMagasin, index) => (
          <div class="col-md-6" key={nomMagasin}>
            <h3>{nomMagasin.toUpperCase()}</h3>
            <table class="table table-bordered" style={{border: '1px solid black'}}>
                <tr>
                  <th>DES</th>
                  <th>QTE</th>
                  <th>TOTAL</th>
                </tr>

                {magasinsData[nomMagasin].map((produit, index) => (
                  <tr key={index}>
                    <td>{produit.nom}</td>
                    <td>{produit.quantite}</td>
                    <td>{produit.prixtotal}</td>
                  </tr>


                ))}
                <tr>
                  <th>Total:</th>
                  <th colspan="2">{sommeTotal[nomMagasin]}</th>
                </tr>
            
            </table>
            <hr style={{border: 'none', borderTop: '3px solid black', margin: '20px 0'}}/>
                      </div>
        ))}
        <button type="button" class="btn btn-danger" onClick={handleDeleteFiche}>Supprimer tous les tables</button>
      </div>
    </div>

  )
}

export default Fiche;