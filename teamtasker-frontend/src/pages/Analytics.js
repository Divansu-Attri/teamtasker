import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Analytics() {
  const [tasksPerDay, setTasksPerDay] = useState({});
  const [topUsers, setTopUsers] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [tDay, tUsers, tStatus] = await Promise.all([
          api.get('/analytics/tasks-per-day'),
          api.get('/analytics/top-users'),
          api.get('/analytics/tasks-by-status'),
        ]);
        setTasksPerDay(tDay.data);
        setTopUsers(tUsers.data);
        setTasksByStatus(tStatus.data);
      } catch (err) { console.log(err); }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="h2 mb-4">Analytics Dashboard</h1>

      <div className="row g-4">
        {/* Tasks per Day */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Tasks per Day (Last 7 Days)</h5>
              <ul className="list-group list-group-flush mt-3">
                {Object.entries(tasksPerDay).map(([day, count]) => (
                  <li key={day} className="list-group-item d-flex justify-content-between align-items-center">
                    {day}
                    <span className="badge bg-primary rounded-pill">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Top Users by Tasks Completed</h5>
              <ul className="list-group list-group-flush mt-3">
                {topUsers.map(u => (
                  <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {u.name}
                    <span className="badge bg-success rounded-pill">{u.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tasks by Status */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Tasks by Status</h5>
              <ul className="list-group list-group-flush mt-3">
                {Object.entries(tasksByStatus).map(([status, count]) => (
                  <li key={status} className="list-group-item d-flex justify-content-between align-items-center text-capitalize">
                    {status}
                    <span className="badge bg-warning rounded-pill">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
