import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";

function ModifierMagasinForm () {
    const { id } = useParams();
    const [quantite,setQuantite] = useState(0);
    const [data,setData]= useState([]);

    const onQuantiteChange = (e) => setQuantite(e.target.value);

    useEffect(() => {
        fetch(`http://localhost:3001/produitsmagasinss/${id}`)
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
      }, [id]);

      const handleSubmitModif = async (id) => {
        const prixUnitaire = data[0].id === parseInt(id) ? data[0].pu : null ;
        console.log(prixUnitaire);
        const nPrixTotal = prixUnitaire * quantite;
        console.log(nPrixTotal);
        const produit = {
            quantite: quantite,
            prixtotal : nPrixTotal,
        };

        try {
            const response = await fetch(`http://localhost:3001/produitsmagasins/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produit)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la modification du produit');
            }
            
            console.log('Quantité du produit modifiée avec succès:', id);
            window.location.back();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };




    return (
        <div>
            <form onSubmit>
                Nouvelle Qunatité: <input value={quantite} onChange={onQuantiteChange} />
                <button type="button" onClick={() =>handleSubmitModif(id)}>Modifier</button>
            </form>
        </div>

    )
}

export default ModifierMagasinForm;