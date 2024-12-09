import { Link } from "react-router-dom";
import ReactDOMServer from 'react-dom/server';
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
            
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/amin">AMIN</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/mohamedlivreur">MOHAMED</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/jalel">JALEL</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/nakhla">NAKHLA</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/tiss">TISS</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/agareb">AGAREB</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/saber">SABER</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/magasins/manzelchaker">MANZEL CHAKER</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/ouvriers">Dépenses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/depensessemaine">Dépenses Semaine</Link>
            </li>


            <li className="nav-item">
              <Link className="nav-link btn btn-primary mx-1" to="/fiche">Fiche</Link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
