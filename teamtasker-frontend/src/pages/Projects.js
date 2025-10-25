import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ProjectCard from '../components/ProjectCard';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      alert('Failed to fetch projects');
      console.error(err);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Delete a project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      alert('Project deleted successfully');
    } catch (err) {
      alert('Failed to delete project');
      console.log("project delete error", err);
    }
  };

  // Start editing a project
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ title: project.title, description: project.description });
  };

  // Update project
  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      alert("Project title cannot be empty");
      return;
    }

    try {
      const res = await api.put(`/projects/${editingProject.id}`, formData);
      setProjects(projects.map(p => p.id === editingProject.id ? res.data : p));
      setEditingProject(null);
      setFormData({ title: '', description: '' });
      alert("Project updated successfully");
    } catch (err) {
      alert("Failed to update project");
      console.error(err);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">+ New Project</Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted">No projects available.</p>
      ) : (
        <div className="row g-4">
          {projects.map(project => (
            <div key={project.id} className="col-12 col-md-6 col-lg-4">
              <ProjectCard 
                project={project} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit Project Form */}
      {editingProject && (
        <div className="card mt-4 p-3 border-warning">
          <h5>Edit Project</h5>
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea 
              className="form-control" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditingProject(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
