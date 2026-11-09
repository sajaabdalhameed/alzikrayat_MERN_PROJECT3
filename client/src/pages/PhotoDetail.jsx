import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api, imgUrl } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { Loading, ErrorMsg } from '../components/Status.jsx';

// Connect to the Socket.io server for real-time comments
const socket = io('http://localhost:5000');

export default function PhotoDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const [likes, setLikes] = useState([]);
  const [isLiking, setIsLiking] = useState(false);

  // Fetch photo data and set up socket listener
  useEffect(() => {
    api(`/photos/${id}`)
      .then((d) => { 
        setPhoto(d.photo); 
        setComments(d.comments); 
        setLikes(d.photo.likes || []);
      })
      .catch((e) => setError(e.message));

    // Listen for new comments from other users
    socket.on('newComment', (newComment) => {
      if (newComment.photoId === id) {
        setComments((prev) =>
          prev.some((c) => c._id === newComment._id) ? prev : [...prev, newComment]
        );
      }
    });

    // Cleanup listener when component unmounts
    return () => socket.off('newComment');
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this photo?')) return;
    try { 
      await api(`/photos/${id}`, { method: 'DELETE' }); 
      navigate('/photos'); 
    } catch (e) { 
      setError(e.message); 
    }
  };

  const handleLike = async () => {
    if (!user) return alert('Please login to like.');
    setIsLiking(true);
    try {
      const data = await api(`/photos/${id}/like`, { method: 'PUT' });
      setLikes(data.likes);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsLiking(false); 
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return setError('Comment text is required.');
    setPosting(true); setError('');
    try {
      const created = await api(`/photos/${id}/comments`, { method: 'POST', body: { comment: text } });
      // Show the new comment immediately from the API response (skip if the socket already added it)
      setComments((prev) =>
        prev.some((c) => c._id === created._id) ? prev : [...prev, created]
      );
      setText('');
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setPosting(false); 
    }
  };

  if (!photo) return error ? <ErrorMsg message={error} /> : <Loading />;
  
  const isOwner = user && user._id === photo.userId._id;
  const hasLiked = user && likes.includes(user._id);

  return (
    <div className="row">
      {/* Image Section */}
      <div className="col-md-7">
        <img src={imgUrl(photo.fileName)} className="img-fluid rounded shadow-sm" alt={photo.title} />
      </div>

      {/* Details Section */}
      <div className="col-md-5">
        <h2>{photo.title}</h2>
        <p className="text-muted">
          By {photo.userId.firstName} {photo.userId.lastName} on {new Date(photo.dateTime).toLocaleString()}
        </p>
        <p style={{ whiteSpace: 'pre-line' }}>{photo.description}</p>
        
        {/* Action Buttons */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {isOwner && <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete Photo</button>}
          
          <button onClick={handleLike} disabled={isLiking} className={`btn btn-sm ${hasLiked ? 'btn-danger' : 'btn-outline-danger'}`}>
            {hasLiked ? '❤️ Liked' : '🤍 Like'} ({likes.length})
          </button>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }} 
            className="btn btn-sm btn-outline-secondary"
          >
            🔗 Copy Link
          </button>

          <a 
            href={imgUrl(photo.fileName)} 
            download={`${photo.title}.jpg`} 
            className="btn btn-sm btn-outline-success"
          >
            ⬇️ Download
          </a>
        </div>

        <hr />
        
        {/* Comments Section */}
        <h5>Comments <span className="text-success fs-6">(Live 🔴)</span></h5>
        <ErrorMsg message={error} />
        
        <div className="mb-3" style={{ maxHeight: 250, overflowY: 'auto' }}>
          {comments.length === 0
            ? <p className="text-muted">No comments yet.</p>
            : comments.map((c) => (
                <div className="border-bottom py-2" key={c._id}>
                  <strong>{c.userId.firstName}:</strong> {c.comment}
                </div>
              ))}
        </div>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleComment}>
            <textarea 
              className="form-control mb-2" 
              rows="2" 
              placeholder="Add a comment..."
              value={text} 
              onChange={(e) => setText(e.target.value)} 
            />
            <button className="btn btn-primary btn-sm" disabled={posting}>
              {posting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p><Link to="/login">Login</Link> to add a comment.</p>
        )}
      </div>
    </div>
  );
} 
