import React from 'react';
import ReactDOM from 'react-dom/client';
import Livreur from './pages/Livreur';
import ModifierForm from './pages/ModifierForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Fiche from './pages/Fiche';
import Ouvriers from './pages/Ouvriers';
import Magasins from './pages/Magasins';
import Header from './pages/Header';
import ModifierMagasinForm from './pages/ModifierMagasinForm';
import DepensesSemaine from './pages/DepensesSemaine';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Router forceRefresh={true}>
      <Header />
      <Routes>
        <Route path="/" element={<Livreur />} />
        <Route path="/modifier/:id" element = {<ModifierForm />} />
        <Route path="/fiche" element = {<Fiche />} />
        <Route path="/ouvriers" element = {<Ouvriers />} />
        <Route path="/depensessemaine" element = {<DepensesSemaine />} />
        <Route path="/magasins/:magasin" element ={<Magasins />} />
        <Route path="/modifiermagasins/:id" element ={<ModifierMagasinForm />} />
      </Routes>
    </Router>

);


