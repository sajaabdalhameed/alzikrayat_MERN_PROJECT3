import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PhotoCard from '../components/PhotoCard.jsx';
import { Loading, ErrorMsg } from '../components/Status.jsx';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    api('/photos').then(setPhotos).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Photo Gallery</h2>
        <div className="btn-group">
          <button className={'btn btn-outline-secondary' + (view === 'grid' ? ' active' : '')} onClick={() => setView('grid')}>Grid View</button>
          <button className={'btn btn-outline-secondary' + (view === 'list' ? ' active' : '')} onClick={() => setView('list')}>List View</button>
        </div>
      </div>
      <ErrorMsg message={error} />
      {loading && <Loading />}
      {!loading && !error && photos.length === 0 && <p className="text-muted">No photos uploaded yet.</p>}
      <div className={'row' + (view === 'list' ? ' list-mode' : '')} id="galleryContainer">
        {photos.map((p) => <PhotoCard key={p._id} photo={p} view={view} />)}
      </div>
    </>
  );
}
 
