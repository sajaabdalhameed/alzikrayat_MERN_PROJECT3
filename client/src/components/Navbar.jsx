import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useState, useEffect } from 'react'; // ضيفنا دي

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // حالة الوضع الليلي
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // عشان أول ما الموقع يفتح يقرا الوضع المحفوظ
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Alzikrayat</Link>
        <div className="d-flex flex-wrap w-100 justify-content-between">
          <ul className="navbar-nav flex-row gap-3">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/photos">Gallery</Link></li>
            {user && <li className="nav-item"><Link className="nav-link" to="/photos/new">Add Photo</Link></li>}
          </ul>
          <ul className="navbar-nav flex-row gap-3 align-items-center">
            {/* زرار الوضع الليلي */}
            <li className="nav-item">
              <button className="btn btn-sm btn-outline-light" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </li>
            
            {user ? (
              <>
                <li className="nav-item"><span className="nav-link text-white">Hi {user.firstName}</span></li>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><span className="nav-link text-white">Please Login</span></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}