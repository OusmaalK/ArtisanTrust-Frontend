import React, { useState } from 'react';

// ✅ URL CORRECTE
const API_URL = 'https://khalidou.pythonanywhere.com/test-match';

const ResultTable = ({ results, scenario }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">
                2. Résultats d'Appariement (Critère Principal : {scenario || 'Non spécifié'})
            </h2>
            
            <div className="space-y-6">
                {results.map((artisan, index) => {
                    const isTopMatch = index === 0;
                    
                    // Style conditionnel basé sur le score
                    const cardClass = isTopMatch
                        ? "bg-green-50 border-green-600 ring-2 ring-green-300 shadow-xl"
                        : "bg-white border-blue-400 shadow-lg";

                    return (
                        <div key={index} className={`p-5 rounded-xl border-l-4 transition-all duration-300 ${cardClass}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`text-xl font-bold ${isTopMatch ? 'text-green-800' : 'text-blue-700'}`}>
                                        <span className="mr-2 text-2xl font-extrabold">{index + 1}.</span> {artisan.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Avis Yelp: {artisan.review_count} | Note Yelp: {artisan.yelp_rating} / 5.0
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-center">
                                    <div className={`text-3xl font-extrabold p-2 rounded-full w-16 h-16 flex items-center justify-center shadow-md ${isTopMatch ? 'bg-green-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                                        {Math.round(artisan.cas_score)}%
                                    </div>
                                    <p className="text-xs font-medium mt-1 text-gray-500">Score CAS</p>
                                </div>
                            </div>

                            {/* Preuves Contextuelles */}
                            {artisan.proofs && artisan.proofs.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs font-semibold text-gray-600 mb-2">
                                        Preuves Contextuelles IA :
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {artisan.proofs.slice(0, 3).map((proof, i) => (
                                            <li key={i} className="italic truncate">{proof}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-4 text-right">
                                <a href={artisan.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-150">
                                    Voir sur Yelp &rarr;
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function App() {
    const [description, setDescription] = useState("URGENT, ma toilette fuit partout, j'ai besoin d'un plombier très rapide et capable de gérer le stress.");
    const [location, setLocation] = useState('Paris, FR');
    const [category, setCategory] = useState('plumbers');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scenario, setScenario] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);
        setScenario('');

        try {
            console.log("🔄 TEST DIRECT - Backend avec CORS activé");
            console.log("📤 Données envoyées:", { description, category, location });
            
            // ✅ SOLUTION FINALE: REQUÊTE DIRECTE
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // ❌ NE PAS utiliser mode: 'cors' - laisse le navigateur gérer
                body: JSON.stringify({
                    description: description,
                    category: category,
                    location: location,
                }),
            });

            console.log("📡 Statut de la réponse:", response.status);
            console.log("🔍 Headers CORS:", {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("📝 Réponse d'erreur détaillée:", errorText);
                throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
            }

            const rawData = await response.json();
            
            // 🔍 DEBUG DÉTAILLÉ
            console.log("=== DONNÉES BRUTES API ===", rawData);
            
            if (rawData.results && rawData.results.length > 0) {
                console.log("=== ANALYSE DU PREMIER ARTISAN ===");
                const firstArtisan = rawData.results[0];
                console.log("Nom:", firstArtisan.name);
                console.log("Rating Yelp:", firstArtisan.yelp_rating);
                console.log("Nombre d'avis:", firstArtisan.review_count);
                console.log("Score CAS:", firstArtisan.cas_score);
                console.log("Preuves:", firstArtisan.proofs);
                console.log("Scénario:", firstArtisan.scenario_term);
                
                // Vérification de tous les artisans
                console.log("=== TOUS LES ARTISANS ===");
                rawData.results.forEach((artisan, idx) => {
                    console.log(`Artisan ${idx}: ${artisan.name} | Rating: ${artisan.yelp_rating} | Avis: ${artisan.review_count} | CAS: ${artisan.cas_score}%`);
                });
            } else {
                console.warn("⚠️ Aucun résultat trouvé dans la réponse");
            }

            // VALIDATION DES DONNÉES
            if (rawData.status === 'success' && rawData.results) {
                console.log("✅ Données valides reçues, nombre de résultats:", rawData.results.length);
                setResults(rawData.results);
                
                if (rawData.results.length > 0) {
                    setScenario(rawData.results[0].scenario_term || 'Urgence');
                    
                    // Vérification finale des données affichées
                    console.log("=== DONNÉES QUI SERONT AFFICHÉES ===");
                    rawData.results.forEach((artisan, idx) => {
                        const displayRating = artisan.yelp_rating || 'Non disponible';
                        const displayReviews = artisan.review_count || 0;
                        const displayScore = artisan.cas_score || 0;
                        console.log(`Affichage ${idx}: ${artisan.name} | Rating: ${displayRating} | Avis: ${displayReviews} | CAS: ${displayScore}%`);
                    });
                }
            } else {
                throw new Error("Structure de réponse invalide: " + JSON.stringify(rawData));
            }

        } catch (err) {
            console.error("💥 Erreur complète:", err);
            
            // Message d'erreur plus explicite
            if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
                setError(`Erreur CORS: Le backend ne permet pas les requêtes depuis Vercel. Vérifiez que CORS est bien configuré sur PythonAnywhere.`);
            } else {
                setError(`Erreur: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour tester CORS séparément
    const testCors = async () => {
        try {
            console.log("🧪 Test CORS séparé...");
            const testResponse = await fetch('https://khalidou.pythonanywhere.com/', {
                method: 'GET',
            });
            console.log("🧪 Test CORS statut:", testResponse.status);
            console.log("🧪 Test CORS headers:", {
                origin: testResponse.headers.get('Access-Control-Allow-Origin'),
                methods: testResponse.headers.get('Access-Control-Allow-Methods')
            });
        } catch (err) {
            console.error("🧪 Test CORS échoué:", err);
        }
    };

    // Exécuter le test CORS au chargement
    React.useEffect(() => {
        testCors();
    }, []);

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-10 border border-gray-100">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
                        🛠️ ArtisanTrust CORS FINAL - Moteur d'Adéquation Contextuelle
                    </h1>
                    <p className="text-lg text-gray-600">
                        Votre besoin, le bon artisan. Propulsé par l'IA et l'API Yelp.
                    </p>
                </header>
            
                <form onSubmit={handleSubmit} className="space-y-6 p-4 border border-blue-200 bg-blue-50 rounded-xl">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">1. Décrivez Votre Besoin</h2>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Décrivez votre besoin (Urgence, style de travail souhaité, etc.):
                        </label>
                        <textarea
                            id="description"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            placeholder="Ex: URGENT burst pipe! I need someone who is super CALM and fast. Ou: Rénovation complète, je veux quelqu'un de méticuleux et communicatif."
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie (Terme Yelp, ex: plumbers) :
                            </label>
                            <input 
                                type="text"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Ville, Pays (Ex: Paris, FR) :
                            </label>
                            <input 
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md shadow-blue-500/50 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Test CORS en cours...
                            </>
                        ) : 'Trouver l\'Artisan Adapté'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                        <strong>Erreur :</strong> {error}
                        <br />
                        <small>Vérifiez que CORS est bien configuré sur PythonAnywhere</small>
                    </div>
                )}
                
                {results && results.length > 0 && (
                    <ResultTable results={results} scenario={scenario} />
                )}

                {results && results.length === 0 && !loading && (
                    <div className="mt-6 p-4 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-lg text-center">
                        Aucun artisan trouvé pour cette recherche.
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;