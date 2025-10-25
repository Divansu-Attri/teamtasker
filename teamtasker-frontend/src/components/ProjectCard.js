import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="card mb-3 shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text flex-grow-1">{project.description}</p>

        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-sm btn-warning" onClick={() => onEdit(project)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(project.id)}>Delete</button>
          <Link to={`/projects/${project.id}`} className="btn btn-sm btn-primary">View Tasks</Link>
        </div>
      </div>
    </div>
  );
}
