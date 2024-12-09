import { useState, useEffect } from "react"


function Ouvriers() {
  const [selection, setSelection] = useState('');
  const [montant, setMontant] = useState('')
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  }

  const handleMontantChange = (e) => {
    setMontant(e.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const produit = {
      nom: selection,
      montant: montant,
      temps: new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString(),

    };
    try {
      const response = await fetch('http://localhost:3001/ajoutouvrier', {
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


  useEffect(() => {
    fetch('http://localhost:3001/ouvriers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setTotal(data.reduce((somme, ouvrier) => { return somme + ouvrier.montant }, 0))
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  }, []);


  const ouvriers = [
    { nom: '' },
    { nom: "Mohamed Halweni" },
    { nom: "Bilel" },
    { nom: "Saber" },
    { nom: "Mayssa" },
    { nom: "Wided" },
    { nom: "Latifa" },
    { nom: "Nour" },
    { nom: "Hana" },
    { nom: "Yassine" },
    { nom: "Mabrouka" },
    { nom: "Dalel" },
    { nom: "Mohamed Lajmi" },
    { nom: "Ahmed Lajmi" },
  ]
  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="selection" className="form-label">Sélectionner Nom Ouvrier :</label>
            <select id="selection" className="form-select" onChange={handleSelectionChange} >
              {ouvriers.map((ouvrier, index) => (
                <option key={index}>{ouvrier.nom}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="designation" className="form-label">Désignation:</label>
            <input id="designation" type="text" className="form-control" value={selection} onChange={handleSelectionChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="montant" className="form-label">Montant:</label>
            <input id="montant" type="number" className="form-control" value={montant} onChange={handleMontantChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
        <table className="table table-bordered table-sm mt-4">
          <thead>
            <tr>
              <th>Nom Ouvrier/Désignation</th>
              <th>Montant</th>
              <th>Temps</th>
            </tr>
          </thead>
          <tbody>
            {data.map((produit, index) => (
              <tr key={index}>
                <td>{produit.nom}</td>
                <td>{produit.montant}</td>
                <td>{produit.temps}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total: {total}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default Ouvriers;