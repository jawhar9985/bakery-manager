import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReactDOMServer from 'react-dom/server';
import produitss from "../Produits";


function Magasins() {
  const { magasin } = useParams();
  const [selection, setSelection] = useState('');
  const [quantite, setQuantite] = useState('');
  const [checkBoxValue,setCheckBoxValue] = useState(false);
  const [prixProduit,setPrixProduit] = useState(0)
  const [data,setData]= useState([])
  const [prixTotal,setPrixTotal] = useState(0)
  const [caisse,setCaisse] = useState(0)

  const produitsMagasins = produitss.find(magasinn=> magasinn.magasin === magasin);
  const produits = produitsMagasins.produits;

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

  useEffect(() => {
      fetch(`http://localhost:3001/produitsmagasins/${magasin}`)
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
    }, [magasin]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      const pt = checkBoxValue === true ? - prixProduit * quantite :  prixProduit * quantite;

      setPrixTotal(pt);
      const produit = {
      magasin:magasin,
        nom: selection,
        pu: prixProduit,
        quantite: quantite,
        date: new Date().toLocaleTimeString(),
        prixtotal: pt
      };
      try {
        const response = await fetch("http://localhost:3001/ajoutproduitmagasin", {
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
          const response = await fetch(`http://localhost:3001/produitsmagasins/${id}`, {
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


  

  const handlePrint = () => {
    const date = new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString();
    const content = ReactDOMServer.renderToString(
      <div className="container">
        <p class="text-center">{date}</p>
        <h5 class="text-center">Magasin: {magasin.toUpperCase()}</h5>
        <table className="table" style={{border: '1px solid black'}}>
          <thead>
            <tr>
              <th>DES</th>
              <th>QTE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.map(produit => (
              <tr key={produit.id}>
                <td>{produit.nom}</td>
                <td>{produit.quantite}</td>
                <td>{produit.prixtotal}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">Net à payer:</th>
              <th>{caisse}</th>
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


  return (
    <div className="container-fluid bg-light py-5">
    <div className="container">
        <h3 className="mb-4">{magasin.toUpperCase()}</h3>
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
        </form>
        <table className="table table-bordered table-sm mt-4">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>P.U</th>
                    <th>Quantité</th>
                    <th>Prix Total</th>
                    <th>Temps de l'ajout</th>
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
                        <td><Link to={`/modifiermagasins/${produit.id}`} className="btn btn-warning">Modifier</Link></td>
                        <td><button type="button" onClick={() => handleDelete(produit.id)} className="btn btn-danger">Supprimer</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <h3>Total Caisse {caisse}</h3>
        <button class="btn btn-secondary mr-2" type="button" onClick={handlePrint}>Imprimer</button>
    </div>
</div>
  );
}

export default Magasins;
