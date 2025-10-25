// import React from 'react';

// export default function CommentList({ comments }) {
//   return (
//     <div className="mt-2 border-t pt-2">
//       {comments.map(c => (
//         <div key={c._id} className="border-b py-1">
//           <p className="text-sm"><strong>{c.authorName}</strong> ({new Date(c.createdAt).toLocaleString()})</p>
//           <p>{c.text}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

import React from 'react';

export default function CommentList({ comments }) {
  return (
    <div className="mt-3">
      {comments.map(c => (
        <div key={c._id} className="card mb-2 shadow-sm">
          <div className="card-body p-2">
            <p className="mb-1 text-muted small">
              <strong>{c.authorName}</strong> ({new Date(c.createdAt).toLocaleString()})
            </p>
            <p className="mb-0">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
