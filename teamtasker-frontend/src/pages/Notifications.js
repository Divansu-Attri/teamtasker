import React, { useEffect, useState } from 'react';
import api from '../api/api';
import NotificationItem from '../components/NotificationItem';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <div className="container my-5">
      <h1 className="h2 mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-muted">No notifications</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {notifications.map(n => (
            <NotificationItem key={n.id} notification={n} markRead={markRead} />
          ))}
        </div>
      )}
    </div>
  );
}
