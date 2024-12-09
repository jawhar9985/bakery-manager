import { useEffect, useState } from "react";


function DepensesSemaine () {
    const [data,setData] = useState([]);
    const [dataG,setDataG] = useState([]);
    const [dateJour,setDateJour]=useState([]);


    setInterval(() => {
      const currentDate = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, locale: 'fr-FR' };
      const date = currentDate.toLocaleString(undefined, options);
      setDateJour(date);
    }, 1000);

    const printPage = () => {
        window.print();
    }

    const handleDeleteDepenses = async () => {
        try {
          const response = await fetch("http://localhost:3001/supprimerdepensessemaine", {
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

    useEffect(() => {
        fetch('http://localhost:3001/depensessemaine')
          .then(response => {
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des produits');
            }
            return response.json();
          })
          .then(data => {
            setData(data);
          })
          .catch(error => {
            console.error('Erreur:', error);
          });
      }, []);
      useEffect(() => {
        fetch('http://localhost:3001/depensessemainegroupe')
          .then(response => {
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des produits');
            }
            return response.json();
          })
          .then(data => {
            setDataG(data);
          })
          .catch(error => {
            console.error('Erreur:', error);
          });
      }, []);

    return (
        <div className="container-fluid bg-light py-5">
      <div className="container">
      <h3 style={{ textAlign: 'center' }}>Boulangerie</h3>
      <p style={{ textAlign: 'center' }}>{dateJour}</p>
            <hr style={{border: 'none', borderTop: '3px solid black', margin: '20px 0'}}/>
            <h3>Dépenses Semaine</h3>
            <table className="table table-bordered table-sm mt-4" style={{border: '1px solid black'}}>
                <thead>
                <tr>
                    <th>DES</th>
                    <th>MONT</th>
                    <th>DATE</th>
                </tr>
                </thead>
                <tbody>
                {data.map(depense=>{
                    return <tr>
                        <td>{depense.nom}</td>
                        <td>{depense.montant}</td>
                        <td>{depense.temps}</td>
                    </tr> ;
                } )}
                </tbody>
            </table>
        </div>
        <div className="container">
        <hr style={{border: 'none', borderTop: '3px solid black', margin: '20px 0'}}/>

            <h3>Dépenses Semaine Groupés</h3>
            <table className="table table-bordered table-sm mt-4" style={{border: '1px solid black'}}>
                <thead>
                <tr>
                    <th>DES</th>
                    <th>MONTANT</th>
                </tr>
                </thead>
                <tbody>
                {dataG.map(depense=>{
                    return <tr>
                        <td>{depense.nom}</td>
                        <td>{depense.montant}</td>
                    </tr> ;
                } )}
                </tbody>
            </table>
            <button className="btn btn-secondary mr-2" onClick={printPage}>Imprimer</button> <br /><br />
            <button className="btn btn-danger" onClick={handleDeleteDepenses}>Supprimer dépenses Semaine</button>
        </div>
        </div>
    )
}

export default DepensesSemaine;

