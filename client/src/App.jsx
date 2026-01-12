import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); 
  
  const [salles, setSalles] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [bookingRoom, setBookingRoom] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setView('salles');
      fetch('http://localhost:3000/api/salle').then(res => res.json()).then(data => setSalles(data));
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault(); setErrorMsg('');
    try {
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nom }),
        });
        const data = await res.json();
        if (res.ok) { 
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data)); 
            fetchSalles(); 
            setView('salles'); 
        } else { setErrorMsg(data.error); }
    } catch (err) { setErrorMsg("Erreur serveur"); }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setErrorMsg('');
    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) { 
            setUser(data); 
            localStorage.setItem('user', JSON.stringify(data)); 
            fetchSalles(); 
            setView('salles'); 
        } else { setErrorMsg(data.error); }
    } catch (err) { setErrorMsg("Erreur serveur"); }
  };

  const fetchSalles = () => {
    fetch('http://localhost:3000/api/salle').then(res => res.json()).then(data => setSalles(data));
  };

  const fetchReservations = () => {
    const currentUser = user || JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;

    fetch(`http://localhost:3000/api/my-reservations?user_id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setReservations(data));
  };

  const openBookingModal = (salle) => {
    setBookingRoom(salle);
    setErrorMsg('');
    setDate(''); setStartTime(''); setEndTime('');
  };

  const closeBookingModal = () => {
    setBookingRoom(null);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    const startFull = `${date} ${startTime}:00`;
    const endFull = `${date} ${endTime}:00`;

    const res = await fetch('http://localhost:3000/api/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.id,
            salle_id: bookingRoom.id,
            date_debut: startFull,
            date_fin: endFull
        }),
    });
    const data = await res.json();

    if (res.ok) {
        closeBookingModal(); 
        setSuccessMsg(`✅ Réservation confirmée pour la ${bookingRoom.nom} !`);
        fetchReservations();
        setView('my-reservations');
        setTimeout(() => setSuccessMsg(''), 4000);
    } else {
        setErrorMsg(data.error || "Impossible de réserver");
    }
  };

  const logout = () => {
      setUser(null);
      localStorage.removeItem('user'); 
      setView('login');
  };

  return (
    <div className="app-container">
      
      <nav className="navbar">
        <div className="logo" onClick={() => setView('salles')} style={{cursor:'pointer'}}>EasyBooking</div>
        <div className="user-info">
          {user ? (
            <>
              <button className="btn-logout" onClick={() => {fetchSalles(); setView('salles')}} style={{border:'none', color:'blue'}}>Salles</button>
              <button className="btn-logout" onClick={() => {fetchReservations(); setView('my-reservations')}} style={{border:'none', color:'blue'}}>Mes Réservations</button>
              <span>| {user.nom}</span>
              <button className="btn-logout" onClick={logout}>Déconnexion</button>
            </>
          ) : <span>Espace Client</span>}
        </div>
      </nav>

      <div className="container">
        
        {view === 'login' && (
          <div className="auth-card">
            <h2>Connexion</h2>
            {errorMsg && <p style={{color:'red'}}>{errorMsg}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
              <div className="form-group"><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
              <button type="submit" className="btn-primary">Se connecter</button>
            </form>
            <div className="link-text"><button onClick={() => setView('register')}>Créer un compte</button></div>
          </div>
        )}

        {view === 'register' && (
          <div className="auth-card">
            <h2>Inscription</h2>
            {errorMsg && <p style={{color:'red'}}>{errorMsg}</p>}
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Nom</label><input value={nom} onChange={e=>setNom(e.target.value)} required/></div>
              <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
              <div className="form-group"><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>
              <button type="submit" className="btn-primary">S'inscrire</button>
            </form>
            <div className="link-text"><button onClick={() => setView('login')}>Retour</button></div>
          </div>
        )}

        {view === 'salles' && user && (
          <div className="rooms-grid">
            {salles.map((salle) => (
              <div key={salle.id} className="room-card">
                <div>
                    <div className="room-header">
                        <h3 className="room-title">{salle.nom}</h3>
                        <span className="capacity-badge">{salle.capacite} pers.</span>
                    </div>
                    <p className="room-desc">{salle.observation}</p>
                </div>
                <button className="btn-primary" onClick={() => openBookingModal(salle)}>Réserver</button>
              </div>
            ))}
          </div>
        )}

        {view === 'my-reservations' && user && (
            <div>
                <h1>Mes Réservations</h1>
                {successMsg && <div className="success-message">{successMsg}</div>}

                {reservations.length === 0 ? <p>Aucune réservation.</p> : null}
                {reservations.map(res => (
                    <div key={res.id} className="reservation-card">
                        <div>
                            <h3>{res.nom_salle}</h3>
                            <p>📅 {new Date(res.date_debut).toLocaleDateString()} <br/> ⏰ {new Date(res.date_debut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {new Date(res.date_fin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                        </div>
                        <span style={{color:'green', fontWeight:'bold'}}>Confirmé</span>
                    </div>
                ))}
            </div>
        )}
      </div>

      {bookingRoom && (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target.className === 'modal-overlay') closeBookingModal();
        }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Réserver : {bookingRoom.nom}</h2>
                    <button className="close-btn" onClick={closeBookingModal}>&times;</button>
                </div>
                
                {errorMsg && <div style={{background:'#fee2e2', color:'#ef4444', padding:'10px', borderRadius:'8px', marginBottom:'15px'}}>{errorMsg}</div>}
                
                <form onSubmit={submitBooking}>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div style={{display:'flex', gap:'15px'}}>
                        <div className="form-group" style={{flex:1}}>
                            <label>De</label>
                            <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} />
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label>À</label>
                            <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                        <button type="button" className="btn-cancel" onClick={closeBookingModal} style={{flex:1, padding:'10px', border:'none', borderRadius:'8px', cursor:'pointer'}}>Annuler</button>
                        <button type="submit" className="btn-primary" style={{flex:2}}>Confirmer</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  )
}

export default App