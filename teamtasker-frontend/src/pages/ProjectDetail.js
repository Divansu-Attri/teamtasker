import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  // new task fields
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('Todo');

  // edit state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  // ✅ Fetch project and tasks
  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setTasks(res.data.tasks || []);
    } catch (err) {
      alert('Failed to fetch project');
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // ✅ Add new task (with title, description, status)
  const addTask = async () => {
    if (!newTaskTitle.trim()) return alert('Title required');

    try {
      const res = await api.post(`/tasks/project/${id}`, {
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus.toLowerCase().replace(' ', '_'), // convert to backend-friendly
      });

      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskStatus('Todo');
    } catch (err) {
      alert('Failed to add task');
    }
  };

  // ✅ Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // ✅ Start editing
  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  };

  // ✅ Cancel editing
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle('');
  };

  // ✅ Update task title
  const updateTask = async (taskId) => {
    if (!editedTitle.trim()) return;
    try {
      const res = await api.put(`/tasks/${taskId}`, { title: editedTitle });
      setTasks(tasks.map((t) => (t.id === taskId ? res.data : t)));
      cancelEdit();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  // ✅ Toggle status (cycle through Todo → In Progress → Done)
  const toggleStatus = async (task) => {
    try {
      const statusOrder = ['todo', 'in_progress', 'done'];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

      const res = await api.put(`/tasks/${task.id}`, { status: nextStatus });
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // ✅ View task details
  const viewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      <h1 className="h2 mb-2">{project.title}</h1>
      <p>{project.description}</p>

      {/* Add new task */}
      <div className="card p-3 my-4 shadow-sm">
        <h5>Add New Task</h5>

        <div className="mb-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task Title"
            className="form-control"
          />
        </div>

        <div className="mb-2">
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task Description"
            className="form-control"
            rows="2"
          />
        </div>

        {/* <div className="mb-3">
          <select
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
            className="form-select"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div> */}

        <button onClick={addTask} className="btn btn-success">
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="row g-4 mt-2">
        {tasks.length === 0 && <p>No tasks yet.</p>}
        {tasks.map((task) => (
          <div key={task.id} className="col-12 col-md-6">
            <div className="card shadow-sm p-3">
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="form-control mb-2"
                  />
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => updateTask(task.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h5
                    className={`card-title ${
                      task.status === 'done'
                        ? 'text-decoration-line-through text-muted'
                        : ''
                    }`}
                  >
                    {task.title}
                  </h5>
                  {task.description && (
                    <p className="text-muted small mb-2">{task.description}</p>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="btn-group">

                       <button
                        onClick={() => viewTask(task.id)}
                        className="btn btn-outline-info btn-sm mx-1"
                      >
                        View
                      </button>
                     
                      <button
                        onClick={() => startEdit(task)}
                        className="btn btn-outline-primary btn-sm mx-1"
                      >
                        Edit
                      </button>
                     
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="btn btn-outline-danger btn-sm mx-1"
                      >
                        Delete
                      </button>
                       {/* <button
                        onClick={() => toggleStatus(task)}
                        className="btn btn-outline-success btn-sm"
                      >
                        Done
                      </button> */}
                    </div>
                    <small className="text-muted text-uppercase">
                      {task.status.replace('_', ' ')}
                    </small>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
