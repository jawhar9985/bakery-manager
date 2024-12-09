
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import produitss from "../Produits";
import ReactDOMServer from 'react-dom/server';
function Livreur() {
    const [selection, setSelection] = useState('');
    const [quantite, setQuantite] = useState('');
    const [checkBoxValue,setCheckBoxValue] = useState(false);
    const [prixProduit,setPrixProduit] = useState(0)
    const [data,setData]= useState([])
    const [prixTotal,setPrixTotal] = useState(0)
    const [caisse,setCaisse] = useState(0)
    const [data2,setData2]= useState([])
    const [encienCredit,setEncienCredit] = useState(0)

    useEffect(() => {
      fetch('http://localhost:3001/fichenejah')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des produits');
          }
          return response.json();
        })
        .then(data => {
          setData2(data);
      
  
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

    const handlePrint = () => {
      const date = new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString();
      const content = ReactDOMServer.renderToString(
        <div className="container">
          <p class="text-center">{date}</p>
          <h5 class="text-center">LIVREUR</h5>
          <table className="table" style={{border: '1px solid black'}}>
            <thead>
              <tr>
                <th>DES</th>
                <th>QTE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data2.map(produit => (
                <tr key={produit.id}>
                  <td>{produit.nom}</td>
                  <td>{produit.total_quantite}</td>
                  <td>{produit.total_prix}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="2">Caisse:</th>
                <th>{caisse}</th>
              </tr>
              <tr>
                <th colSpan="2">Encien Credit</th>
                <th>{encienCredit}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      );
  
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = content;
      window.print();
      document.body.innerHTML = originalContents;
  };

    

    const produitsNejah = produitss.find(magasin => magasin.magasin === "nejah");
    const produits = produitsNejah.produits;
    const checkBoxChange = (e) => {
        const value = checkBoxValue === true ? false : true;
        setCheckBoxValue(value);
        console.log(checkBoxValue);
    }
    const handleProduitChange = (e) => {
        setSelection(e.target.value);
        const produitTrouve = produits.find(produit => produit.nom === e.target.value);
        if (produitTrouve) {
            setPrixProduit(produitTrouve.prix);
        } else {
            console.error('Produit non trouvé');
        }
    }
    

    const handleQuantiteChange = (e) =>{
        setQuantite(e.target.value);
    }


   
/*
    const ajouterProduit = (nom,prix,quantite,checkBoxValue) =>{
        const prixTotal = checkBoxValue === true ? - prix * quantite :  prix * quantite;
        setDateTime(new Date())
        const date = dateTime.toLocaleTimeString()
        const new_data = {nom:nom,pu:prix,quantite:quantite,prixTotal:prixTotal,date:date};
        setData([...data, new_data]);

        console.log(data);

    }
*/
    useEffect(() => {
        fetch('http://localhost:3001/produitsnejah')
          .then(response => {
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des produits');
            }
            return response.json();
          })
          .then(data => {
            setData(data);
            setCaisse(data.reduce((somme, produit) => somme + produit.prixtotal, 0));
          })
          .catch(error => {
            console.error('Erreur:', error);
          });
      }, []);

      const handleSubmit = async (event) => {
        event.preventDefault();
        const pt = checkBoxValue === true ? - prixProduit * quantite :  prixProduit * quantite;

        setPrixTotal(pt);
        const produit = {
          nom: selection,
          pu: prixProduit,
          quantite: quantite,
          date: new Date().toLocaleTimeString(),
          prixtotal: pt
        };
        try {
          const response = await fetch('http://localhost:3001/produitsnejah', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(produit)
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

      const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/produitsnejah/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du produit');
            }

            console.log('Produit supprimé avec succès:', id);
            window.location.reload()
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const supprimerProduits = async () => {
        try {
          const response = await fetch('http://localhost:3001/supprimerproduitsnejah', {
            method: 'DELETE',
          });
          if (response.ok) {
            console.log('Toutes les lignes de la table "nejah" ont été supprimées.');
            window.location.reload();
          } else {
            console.error('Erreur lors de la suppression de la facture.');
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la facture :', error);
        }
      };
      

    const calculerCaisse = () => {
        setCaisse(data.reduce((somme, produit) => somme + produit.prixtotal, 0));
    }
    
    const afficheCaisse = caisse === 0 ? <h3></h3>: <h3>{caisse}</h3>;

    
    return (
      <div className="container-fluid bg-light py-5">
      <div className="container">
          <h3 className="mb-4">Livreur</h3>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                  <label htmlFor="retour" className="form-label">Retour:</label>
                  <div className="form-check">
                      <input id="retour" type="checkbox" className="form-check-input" checked={checkBoxValue} onChange={checkBoxChange}  />
                  </div>
              </div>
              <div className="mb-3">
                  <label htmlFor="produits" className="form-label">Produits:</label>
                  <select id="produits" className="form-select" onChange={handleProduitChange} value={selection} required>
                      {produits.map((produit, index) => (
                          <option key={index}>{produit.nom}</option>
                      ))}
                  </select>
              </div>
              <div className="mb-3">
                  <label htmlFor="quantite" className="form-label">Quantité:</label>
                  <input id="quantite" type="number" className="form-control" value={quantite} onChange={handleQuantiteChange} required/>
              </div>
              <div className="mb-3">
                  <button type="submit" className="btn btn-primary">Ajouter produit</button>
              </div>
              <div className="mb-3">
              <button class="btn btn-secondary mr-2" type="button" onClick={handlePrint}>Imprimer</button>
              </div>
              
          </form>
          <table className="table table-bordered table-sm mt-4">
              <thead>
                  <tr>
                      <th>Produit</th>
                      <th>P.U</th>
                      <th>Quantité</th>
                      <th>Prix Total</th>
                      <th>Date de l'ajout</th>
                      <th>Modifier</th>
                      <th>Supprimer</th>
                  </tr>
              </thead>
              <tbody>
                  {data.map((produit) => (
                      <tr key={produit.id}>
                          <td>{produit.nom}</td>
                          <td>{produit.pu}</td>
                          <td>{produit.quantite}</td>
                          <td>{produit.prixtotal}</td>
                          <td>{produit.tempsajout}</td>
                          <td><Link to={`/modifier/${produit.id}`} className="btn btn-warning">Modifier</Link></td>
                          <td><button onClick={() => handleDelete(produit.id)} className="btn btn-danger">Supprimer</button></td>
                      </tr>
                  ))}
              </tbody>
          </table>
          
          <button type="button" className="btn btn-success" onClick={calculerCaisse}>Afficher Caisse</button>
          {afficheCaisse}

          <button type="button" className="btn btn-danger" onClick={supprimerProduits}>Supprimer tous les produits</button>
      </div>
  </div>
    )
}

export default Livreur;