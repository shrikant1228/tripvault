import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;