import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
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

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="container">Loading trips...</div>;

  return (
    <div className="container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>TripVault</h1>
        {user && <span className="user-greeting">✈️ {user.name}</span>}
      </div>

      {/* Tagline */}
      <div className="adventure-tagline">“Let the adventure begin!”</div>

      {/* Header with Add Trip button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: '#3e2c1b', fontWeight: 500, fontSize: '1.3rem' }}>📌 My Travel Notes</h2>
        <button className="btn-add" onClick={() => setShowCreate(true)}>+ Add Trip</button>
      </div>

      {/* Create Trip Form */}
      {showCreate && (
        <TripForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {/* Edit Trip Form */}
      {editingTrip && (
        <TripForm
          initialData={editingTrip}
          onSubmit={(data) => handleUpdate(editingTrip._id, data)}
          onCancel={() => setEditingTrip(null)}
        />
      )}

      {/* Horizontal Scroll of Sticky Notes */}
      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📝</div>
          <p>No travel notes yet. Pin your first adventure!</p>
        </div>
      ) : (
        <div className="sticky-scroll">
          {trips.map((trip) => (
            <div key={trip._id} className="sticky-note">
              <h3>{trip.title}</h3>
              <div className="destination">📍 {trip.destination}</div>
              <div className="dates">
                {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'}
                {trip.endDate && ` — ${new Date(trip.endDate).toLocaleDateString()}`}
              </div>
              <div className="rating">{renderStars(trip.rating)}</div>
              {trip.description && <div className="notes">“{trip.description}”</div>}
              <div className="sticky-actions">
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

// ---------- Trip Form Component ----------
const TripForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    destination: initialData.destination || '',
    startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
    endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
    description: initialData.description || '',
    rating: initialData.rating || 5,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      rating: Number(form.rating),
    };
    onSubmit(data);
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <h4 style={{ color: '#3e2c1b' }}>{initialData._id ? '✏️ Edit Note' : '📝 New Note'}</h4>
      <input
        name="title"
        placeholder="Trip title..."
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="destination"
        placeholder="Destination..."
        value={form.destination}
        onChange={handleChange}
        required
      />
      <input
        name="startDate"
        type="date"
        value={form.startDate}
        onChange={handleChange}
      />
      <input
        name="endDate"
        type="date"
        value={form.endDate}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Memories..."
        value={form.description}
        onChange={handleChange}
        rows="3"
      />
      <select name="rating" value={form.rating} onChange={handleChange}>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>{r} ⭐</option>
        ))}
      </select>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData._id ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Dashboard;