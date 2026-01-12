import { useState,  } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [salles, setSalles] = useState([]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
        const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom: nom }),
        });
        const data = await res.json();
        
        if (res.ok) {
        setUser(data); 
        fetchSalles();
        setView('salles');
        } else {
        setErrorMsg(data.error || "Erreur lors de l'inscription");
        }
    } catch (err) { setErrorMsg("Erreur serveur"); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
        const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (res.ok) {
        setUser(data); 
        setView('salles'); 
        fetchSalles(); 
        } else {
        setErrorMsg(data.error || "Erreur de connexion");
        }
    } catch (err) { setErrorMsg("Erreur serveur"); }
  };

  const fetchSalles = () => {
    fetch('http://localhost:3000/api/salle')
      .then(res => res.json())
      .then(data => setSalles(data))
      .catch(err => console.error(err));
  };

  return (
    <div className="app-container">
      
      <nav className="navbar">
        <div className="logo">EasyBooking</div>
        <div className="user-info">
          {user ? (
            <>
              <span>{user.nom}</span>
              <button className="btn-logout" onClick={() => {setUser(null); setView('login')}}>
                Déconnexion
              </button>
            </>
          ) : (
            <span style={{color: '#6b7280'}}>Espace Client</span>
          )}
        </div>
      </nav>

      <div className="container">
        
        {view === 'login' && (
          <div className="auth-card">
            <h2>Bienvenue</h2>
            {errorMsg && <div style={{color:'#ef4444', marginBottom:'1rem', background:'#fee2e2', padding:'0.5rem', borderRadius:'6px'}}>{errorMsg}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email professionnel</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nom@entreprise.com"/>
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"/>
              </div>
              <button type="submit" className="btn-primary">Se connecter</button>
            </form>
            
            <div className="link-text">
              Pas encore de compte ? <button onClick={() => setView('register')}>Créer un compte</button>
            </div>
          </div>
        )}

        {view === 'register' && (
          <div className="auth-card">
            <h2>Création de compte</h2>
            {errorMsg && <div style={{color:'#ef4444', marginBottom:'1rem', background:'#fee2e2', padding:'0.5rem', borderRadius:'6px'}}>{errorMsg}</div>}
            
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nom complet</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)} required placeholder="Ex: Jean Dupont"/>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nom@entreprise.com"/>
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"/>
              </div>
              <button type="submit" className="btn-primary">S'inscrire</button>
            </form>
            
            <div className="link-text">
              Déjà inscrit ? <button onClick={() => setView('login')}>Se connecter</button>
            </div>
          </div>
        )}

        {view === 'salles' && user && (
          <div>
            <h1 style={{marginBottom:'2rem', color: '#1f2937'}}>Nos espaces de travail</h1>
            
            <div className="rooms-grid">
              {salles.map((salle) => (
                <div key={salle.id} className="room-card">
                  <div>
                    <div className="room-header">
                        <h3 className="room-title">{salle.nom}</h3>
                        <span className="capacity-badge">{salle.capacite} pers.</span>
                    </div>
                    
                    <p className="room-desc">{salle.observation}</p>
                    
                    <div style={{marginBottom: '1.5rem'}}>
                        {salle.est_active ? 
                            <div className="status active">
                                <span style={{fontSize:'1.2em'}}>●</span> Disponible
                            </div> : 
                            <div className="status" style={{color:'#ef4444'}}>
                                <span style={{fontSize:'1.2em'}}>●</span> Indisponible
                            </div>
                        }
                    </div>
                  </div>

                  <button className="btn-primary">
                    Réserver ce créneau
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App