import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Inline styles (temporary fix)
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      border: '1px solid #e6dac8'
    },
    heading: {
      fontSize: '2rem',
      color: '#3e2c1b',
      textAlign: 'center',
      marginBottom: '0.5rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    input: {
      padding: '12px 16px',
      border: '2px solid #e6dac8',
      borderRadius: '12px',
      fontSize: '1rem',
      background: '#fcf8f2',
      outline: 'none'
    },
    button: {
      padding: '12px',
      background: '#3e2c1b',
      color: '#faf3e0',
      border: 'none',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer'
    },
    error: {
      color: '#b55a4b',
      background: '#fdf0ed',
      padding: '10px',
      borderRadius: '8px',
      textAlign: 'center',
      borderLeft: '4px solid #b55a4b'
    },
    link: {
      textAlign: 'center',
      marginTop: '1.2rem',
      color: '#7a5f3e'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login ✈️</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={styles.link}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;