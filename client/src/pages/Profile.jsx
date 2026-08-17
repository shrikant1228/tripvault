import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${username}/profile`);
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="container">Loading profile...</div>;
  if (error) return (
    <div className="container">
      <h2>😕 {error}</h2>
      <Link to="/">Go Home</Link>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="dashboard-header">
        <h1>🌍 {profile.user.name}'s Travel Journal</h1>
        <Link to="/" className="btn btn-secondary">🏠 Home</Link>
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9f3ea', borderRadius: '12px' }}>
        <p><strong>Username:</strong> @{profile.user.username}</p>
        {profile.user.bio && <p><strong>Bio:</strong> {profile.user.bio}</p>}
        <p><strong>Member since:</strong> {new Date(profile.user.createdAt).toLocaleDateString()}</p>
        <p><strong>Total trips:</strong> {profile.trips.length}</p>
      </div>

      {profile.trips.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🗺️</div>
          <p>No trips yet. Start exploring!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {profile.trips.map((trip) => (
            <div key={trip._id} style={{
              background: '#fffcf5',
              border: '1px solid #e6dac8',
              borderRadius: '16px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              {trip.coverImage && (
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
                />
              )}
              <h3 style={{ marginTop: '0.5rem' }}>{trip.title}</h3>
              <p style={{ color: '#7a5f3e' }}>📍 {trip.destination}</p>
              <p style={{ color: '#9b8468', fontSize: '0.9rem' }}>
                {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'}
                {trip.endDate && ` — ${new Date(trip.endDate).toLocaleDateString()}`}
              </p>
              <div style={{ fontSize: '1.1rem' }}>{renderStars(trip.rating)}</div>
              {trip.description && <p style={{ color: '#5f4a32', fontStyle: 'italic' }}>“{trip.description}”</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;