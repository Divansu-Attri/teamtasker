import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">TeamTasker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Projects</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/analytics">Analytics</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notifications">Notifications</Link>
            </li>
          </ul>
          {state.token && (
            <button onClick={logout} className="btn btn-outline-light">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}
