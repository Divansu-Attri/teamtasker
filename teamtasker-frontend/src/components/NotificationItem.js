import React from 'react';

export default function NotificationItem({ notification, markRead }) {

  // Backend se message generate karna
  let message = '';
  if(notification.type === 'task_assigned') {
    message = (
      <span>
        📌 You have been <strong>assigned a new task</strong> in project 
      </span>
    );
  } else {
    message = <span>🔔 Notification: <strong>{notification.type}</strong></span>;
  }

  return (
    <div className={`card mb-2 shadow-sm ${notification.read ? 'bg-light' : 'bg-warning text-dark'}`}>
      <div className="card-body p-3 d-flex justify-content-between align-items-center">
        <div>{message}</div>
        {!notification.read && (
          <button 
            onClick={() => markRead(notification.id)} 
            className="btn btn-sm btn-outline-primary"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}
