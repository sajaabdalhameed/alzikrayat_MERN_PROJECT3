import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, imgUrl } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Loading, ErrorMsg } from '../components/Status.jsx';

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api('/stats'), api('/photos?limit=6')])
      .then(([s, r]) => { setStats(s); setRecent(r); })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <div className="p-5 mb-4 bg-dark text-white rounded-3 text-center">
        <div className="container-fluid py-4">
          <h1 className="display-5 fw-bold">Welcome to Alzikrayat</h1>
          <p className="col-md-8 mx-auto fs-5">
            "Alzikrayat" (ذكريات) means memories. This is a simple place to upload your photos,
            share the story behind each one, and read what other members have to say about them.
          </p>
          <Link to="/photos" className="btn btn-primary btn-lg me-2">Browse the Gallery</Link>
          {user
            ? <Link to="/photos/new" className="btn btn-outline-light btn-lg">Upload a Photo</Link>
            : <Link to="/login" className="btn btn-outline-light btn-lg">Join Now</Link>}
        </div>
      </div>

      <ErrorMsg message={error} />
      {!stats && !error && <Loading />}
      {stats && (
        <div className="row text-center mb-5">
          {[['Registered Members', stats.userCount], ['Photos Shared', stats.photoCount]].map(([label, n]) => (
            <div className="col-md-6 mb-3" key={label}>
              <div className="card shadow-sm h-100"><div className="card-body">
                <h2 className="display-6 fw-bold text-primary">{n}</h2>
                <p className="text-muted mb-0">{label}</p>
              </div></div>
            </div>
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <>
          <h3 className="mb-3">Recently Shared</h3>
          <div className="row mb-5">
            {recent.map((p) => (
              <div className="col-6 col-md-4 col-lg-2 mb-4" key={p._id}>
                <Link to={`/photos/${p._id}`}>
                  <img src={imgUrl(p.fileName)} alt={p.title} className="img-fluid rounded shadow-sm"
                    style={{ height: 140, width: '100%', objectFit: 'cover' }} />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      <section id="about-us" className="mb-5">
        <h3 className="mb-3">About Us</h3>
        <p>
          Alzikrayat is a course project built for the Advanced Web Technologies course at Sudan University of
          Science and Technology (SUST). This edition is built on the MERN stack: a React (Vite) frontend consuming
          a hand-written Express REST API backed by MongoDB and Mongoose.
        </p>
        <p className="mb-0">
          Members can register for a free account, upload photos with a title and description, browse everyone's
          shared memories in the gallery, and leave comments on any photo.
        </p>
      </section>
    </>
  );
}
