import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { ErrorMsg } from '../components/Status.jsx';

export default function AddPhoto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file) return setError('Please select a valid image file and provide a title.');
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('photoFile', file);
    setLoading(true); setError('');
    try { await api('/photos', { method: 'POST', form }); navigate('/photos'); }
    catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="row justify-content-center"><div className="col-md-6">
      <div className="card shadow-sm"><div className="card-body p-4">
        <h3 className="mb-4">Add New Photo</h3>
        <ErrorMsg message={error} />
        <form onSubmit={handleSubmit}>
          <div className="mb-3"><label className="form-label">Title</label>
            <input className="form-control" maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="mb-3"><label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="mb-3"><label className="form-label">Photo File</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setFile(e.target.files[0])} /></div>
          <button className="btn btn-success w-100" disabled={loading}>{loading ? 'Uploading...' : 'Upload Photo'}</button>
        </form>
      </div></div>
    </div></div>
  );
}
