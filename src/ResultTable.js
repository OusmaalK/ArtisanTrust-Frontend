import React from 'react';

const ResultTable = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  // S'assurer que le terme du scénario est disponible pour l'affichage,
  // en utilisant un fallback si le premier résultat n'a pas l'information
  const scenarioTerm = (results[0] && results[0].scenario_term) 
    ? results[0].scenario_term 
    : "Adéquation Contextuelle";

  return (
    <div className="results-container">
      <h2>Résultats triés par CAS Score</h2>
      <table>
        <thead>
          <tr>
            <th>Classement</th>
            <th>Nom de l'Artisan</th>
            <th>Note Yelp (Base)</th>
            <th>🔥 CAS Score (IA)</th>
            <th>Preuves IA / Justification</th>
          </tr>
        </thead>
        <tbody>
          {results.map((artisan, index) => (
            <tr key={index} className={index === 0 ? 'top-result' : ''}>
              <td>{index + 1}</td>
              <td>{artisan.name}</td>
              {/* Utilisation de .toFixed(1) pour afficher une décimale pour la note */}
              <td>{artisan.yelp_rating ? artisan.yelp_rating.toFixed(1) : 'N/A'} / 5.0</td>
              <td 
                // Mise en évidence du score élevé
                style={{ 
                  fontWeight: 'bold', 
                  color: artisan.cas_score > 80 ? '#28a745' : '#dc3545' 
                }}
              >
                {/* Utilisation de .toFixed(1) pour afficher une décimale pour le score CAS */}
                {artisan.cas_score ? artisan.cas_score.toFixed(1) : '0.0'} %
              </td>
              <td>
                {/* CORRECTION : On utilise String() pour s'assurer que .proofs est une chaîne 
                   avant d'appeler .replace(), évitant ainsi le TypeError.
                */}
                {String(artisan.proofs || '')
                  .replace(/\\u0026/g, '&')
                  .replace(/\\u003e/g, '>')
                  .replace(/\\u003c/g, '<')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="scenario-info">
        Scénario classifié: **{scenarioTerm}**
      </p>
    </div>
  );
};

export default ResultTable;