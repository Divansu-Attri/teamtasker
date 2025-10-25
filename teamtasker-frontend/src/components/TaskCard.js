import React from 'react';
import { Link } from 'react-router-dom';

export default function TaskCard({ task }) {
  return (
    <div className="card mb-3 shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{task.title}</h5>
        <p className="card-text mb-2">
          Status: <span className="text-capitalize">{task.status}</span>
        </p>
        <Link to={`/tasks/${task.id}`} className="btn btn-outline-primary mt-auto align-self-start">
          View Details
        </Link>
      </div>
    </div>
  );
}
