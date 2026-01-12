import { useEffect, useState } from 'react'
import './App.css' // Garde le CSS par défaut de Vite pour l'instant

function App() {
  const [salle, setsalle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appel à ton API locale
    fetch('http://localhost:3000/api/salle')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then((data) => {
        setsalle(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du fetch:", error);
        setError("Impossible de charger les salles. Le serveur est-il allumé ?");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>EasyBooking - Réservation de Salles</h1>
      
      {loading && <p>Chargement des données...</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {salle.map((salle) => (
          <div key={salle.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ margin: '0 0 10px 0' }}>{salle.nom}</h2>
            <p><strong>Capacité :</strong> {salle.capacite} personnes</p>
            <p>{salle.observation}</p>
            <button style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
              Réserver
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App