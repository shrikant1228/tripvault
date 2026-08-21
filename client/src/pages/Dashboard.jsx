import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const userRes = await api.get('/auth/me');
        setUser(userRes.data);

        const tripsRes = await api.get('/trips');
        setTrips(tripsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleCreate = async (tripData) => {
    try {
      const res = await api.post('/trips', tripData);
      setTrips([res.data, ...trips]);
      setShowCreate(false);
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await api.put(`/trips/${id}`, updatedData);
      setTrips(trips.map(t => t._id === id ? res.data : t));
      setEditingTrip(null);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handlePhotoUpload = async (tripId, file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post(`/trips/${tripId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTrips(trips.map(t => t._id === tripId ? res.data.trip : t));
      if (selectedTrip && selectedTrip._id === tripId) {
        setSelectedTrip(res.data.trip);
      }
      alert('✅ Photo uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Failed to upload photo');
    }
  };

  const handleUpdateProfile = async (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="container">Loading trips...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>TripVault</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {user && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowEditProfile(true)}>✏️ Edit Bio</button>
              <Link to={`/profile/${user.username}`} className="btn btn-secondary">👤 My Profile</Link>
              <span className="user-greeting">✈️ {user.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="adventure-tagline">“Let the adventure begin!”</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: '#3e2c1b', fontWeight: 500, fontSize: '1.3rem' }}>📌 My Travel Notes</h2>
        <button className="btn-add" onClick={() => setShowCreate(true)}>+ Add Trip</button>
      </div>

      {showCreate && <TripForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />}
      {editingTrip && <TripForm initialData={editingTrip} onSubmit={(data) => handleUpdate(editingTrip._id, data)} onCancel={() => setEditingTrip(null)} />}

      {showEditProfile && user && (
        <EditProfile user={user} onClose={() => setShowEditProfile(false)} onUpdate={handleUpdateProfile} />
      )}

      {selectedTrip && (
        <TripDetail trip={selectedTrip} onClose={() => setSelectedTrip(null)} onUpload={handlePhotoUpload} />
      )}

      {trips.length === 0 ? (
        <div className="empty-state"><div className="icon">📝</div><p>No travel notes yet. Pin your first adventure!</p></div>
      ) : (
        <div className="sticky-scroll">
          {trips.map((trip) => (
            <div key={trip._id} className="sticky-note" onClick={() => setSelectedTrip(trip)}>
              {trip.coverImage && <img src={trip.coverImage} alt={trip.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />}
              <h3>{trip.title}</h3>
              <div className="destination">📍 {trip.destination}</div>
              <div className="dates">{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'}{trip.endDate && ` — ${new Date(trip.endDate).toLocaleDateString()}`}</div>
              <div className="rating">{renderStars(trip.rating)}</div>
              {trip.description && <div className="notes">“{trip.description}”</div>}
              <div className="sticky-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn" onClick={() => setEditingTrip(trip)}>✏️ Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(trip._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Edit Profile ----------
const EditProfile = ({ user, onClose, onUpdate }) => {
  const [bio, setBio] = useState(user?.bio || '');
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.put('/users/profile', { bio, username });
      onUpdate(res.data.user);
      onClose();
      alert('✅ Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#fffcf5', borderRadius: '20px', padding: '2rem', maxWidth: '450px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#3e2c1b' }}>✏️ Edit Profile</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', border: '2px solid #e6dac8', borderRadius: '12px', fontSize: '1rem' }} />
          <textarea placeholder="Tell us about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} rows="4" style={{ width: '100%', padding: '0.8rem', marginTop: '0.8rem', border: '2px solid #e6dac8', borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Trip Detail ----------
const TripDetail = ({ trip, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    await onUpload(trip._id, selectedFile);
    setSelectedFile(null);
    setPreview(null);
    setUploading(false);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#fffcf5', borderRadius: '20px', padding: '2rem', maxWidth: '850px', maxHeight: '90vh', overflow: 'auto', width: '100%', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#3e2c1b' }}>✕</button>

        {trip.coverImage && <img src={trip.coverImage} alt={trip.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} />}

        <h2 style={{ color: '#3e2c1b' }}>{trip.title}</h2>
        <p><strong>📍 Destination:</strong> {trip.destination}</p>
        <p><strong>📅 Dates:</strong> {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'} — {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A'}</p>
        <p><strong>⭐ Rating:</strong> {renderStars(trip.rating)}</p>
        {trip.description && <p><strong>📝 Notes:</strong> {trip.description}</p>}

        <div style={{ margin: '1.5rem 0', padding: '1.5rem', border: '2px dashed #dcc9b0', borderRadius: '16px', background: '#f9f3ea' }}>
          <h4 style={{ color: '#3e2c1b' }}>📸 Add Photo</h4>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem 0' }} />
          {preview && (
            <div style={{ marginTop: '0.8rem' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid #e6dac8' }} />
              <button className="btn btn-primary" onClick={handleUpload} disabled={uploading} style={{ marginTop: '0.5rem' }}>{uploading ? 'Uploading...' : '📤 Upload'}</button>
              <button className="btn btn-secondary" onClick={() => { setSelectedFile(null); setPreview(null); }} style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>Cancel</button>
            </div>
          )}
        </div>

        {trip.photos && trip.photos.length > 0 && (
          <div>
            <h4 style={{ color: '#3e2c1b' }}>📷 Photos ({trip.photos.length})</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.8rem', marginTop: '0.8rem' }}>
              {trip.photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Trip photo ${index + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e6dac8' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Trip Form ----------
const TripForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    destination: initialData.destination || '',
    startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
    endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
    description: initialData.description || '',
    rating: initialData.rating || 5,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, startDate: form.startDate ? new Date(form.startDate) : undefined, endDate: form.endDate ? new Date(form.endDate) : undefined, rating: Number(form.rating) };
    onSubmit(data);
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <h4 style={{ color: '#3e2c1b' }}>{initialData._id ? '✏️ Edit Note' : '📝 New Note'}</h4>
      <input name="title" placeholder="Trip title..." value={form.title} onChange={handleChange} required />
      <input name="destination" placeholder="Destination..." value={form.destination} onChange={handleChange} required />
      <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
      <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
      <textarea name="description" placeholder="Memories..." value={form.description} onChange={handleChange} rows="3" />
      <select name="rating" value={form.rating} onChange={handleChange}>
        {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
      </select>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{initialData._id ? 'Update' : 'Create'}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default Dashboard;