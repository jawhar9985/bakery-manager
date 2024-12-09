import { Link } from "react-router-dom";
import produitss from "../Produits.js"
import './fiche.css';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">LIVREUR</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
  {produitss.map(produit => {
    return (
      <li className="nav-item" key={produit.id}>
        <Link className="nav-link btn btn-primary mx-1" to={`/magasins/${produit.magasin}`}>
          {produit.magasin}
        </Link>
      </li>
    );
  })}
</ul>

        </div>
      </div>
    </nav>
  );
}

export default Header;
