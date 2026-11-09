import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, imgUrl } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function PhotoCard({ photo, view }) {
  const { user } = useAuth();
  const isList = view === 'list';
  
  // Initialize state with the likes from the photo object
  const [likes, setLikes] = useState(photo.likes || []);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigating to details when clicking the like button
    if (!user) return alert('Please login to like photos.');
    
    setIsLiking(true);
    try {
      const data = await api(`/photos/${photo._id}/like`, { method: 'PUT' });
      setLikes(data.likes); // Update state with the new array from backend
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const hasLiked = user && likes.includes(user._id);

  return (
    <div className={isList ? 'col-12 mb-3' : 'col-md-4 mb-4'}>
      <div className={'card h-100 gallery-card' + (isList ? ' flex-row' : '')}>
        <img src={imgUrl(photo.fileName)} alt={photo.title}
          className={isList ? 'gallery-thumb-list' : 'gallery-thumb'} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{photo.title}</h5>
          <p className="card-text text-muted mb-2">By {photo.userId.firstName} {photo.userId.lastName}</p>
          
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <Link to={`/photos/${photo._id}`} className="btn btn-outline-primary btn-sm">View Details</Link>
            
            {/* Like Button */}
            <button 
              onClick={handleLike} 
              disabled={isLiking}
              className={`btn btn-sm ${hasLiked ? 'btn-danger' : 'btn-outline-danger'}`}
            >
              {hasLiked ? '❤️' : '🤍'} {likes.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}