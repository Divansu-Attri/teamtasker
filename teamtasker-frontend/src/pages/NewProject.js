import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title, description });
      navigate('/'); // redirect to projects page
    } catch (err) {
      alert('Failed to create project');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">New Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Project Name</label>
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Project</button>
      </form>
    </div>
  );
}
