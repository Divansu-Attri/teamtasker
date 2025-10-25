import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      dispatch({ type: 'LOGIN', payload: res.data });
      navigate('/');
    } catch (err) {
      console.log("signup error: ", err)
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Signup</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter your name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Signup</button>
          </form>
          <p className="mt-3 text-center text-muted">
            Already have an account? <Link to="/login" className="text-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
