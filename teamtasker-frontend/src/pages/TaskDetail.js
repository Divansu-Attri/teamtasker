/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import CommentList from '../components/CommentList';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [assigneeId, setAssigneeId] = useState('');
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('todo');
  
  let navigate = useNavigate()

  // ✅ Fetch single task
  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
      setAssigneeId(res.data.assigneeId || '');
      setStatus(res.data.status || 'todo');
    } catch (err) {
      alert('Failed to fetch task');
    }
  };

  // ✅ Fetch users for assignment
  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth');
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("user ", users)

  // ✅ Assign user
  const assignUser = async () => {
    try {
      await api.put(`/tasks/${id}`, { assigneeId });
      alert('User assigned successfully');
      fetchTask();
    } catch (err) {
      alert('Failed to assign user');
    }
  };

  // ✅ Update status
  const updateStatus = async () => {
    try {
      await api.put(`/tasks/${id}`, { status });
      alert('Status updated');
      fetchTask();
      navigate(`/projects/${task.projectId}`)
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // ✅ Add comment
  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/comments/task/${id}`, { text: newComment });
      setNewComment('');
      fetchTask();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  useEffect(() => {
    fetchTask();
    fetchUsers();
  }, []);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      {/* Task Info */}
      <h2 className="h3 mb-3">{task.title}</h2>
      <p>{task.description}</p>

      <div className="mb-4">
        <label className="form-label fw-bold">Status:</label>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={updateStatus} className="btn btn-success">
            Update
          </button>
        </div>
      </div>

      {/* Assign User */}
      <div className="mb-4">
        <label className="form-label fw-bold">Assign To:</label>
        <div className="input-group" style={{ maxWidth: '400px' }}>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="form-select"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button onClick={assignUser} className="btn btn-primary">
            Assign
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-3">
        <h5>Comments</h5>
        <CommentList comments={task.comments || []} />
        <div className="input-group mt-2" style={{ maxWidth: '500px' }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="form-control"
            placeholder="Add a comment"
          />
          <button onClick={addComment} className="btn btn-success">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
