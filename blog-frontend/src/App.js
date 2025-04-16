import React, { useEffect, useState } from "react";

export default function BlogApp() {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:5000/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });
    const data = await res.json();
    setToken(data.token);
  };

  const handleCreateOrUpdate = async () => {
    if (!token) return alert("Please login first!");

    const url = editingPost
      ? `http://localhost:5000/api/posts/${editingPost._id}`
      : "http://localhost:5000/api/posts";
    const method = editingPost ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      fetchPosts();
      setTitle("");
      setContent("");
      setEditingPost(null);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return alert("Please login first!");

    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) fetchPosts();
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPost(post);
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20 }}>
      <h1>Blog API Frontend</h1>

      {!token ? (
        <button
          onClick={handleLogin}
          style={{
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      ) : (
        <>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          />
          <button
            onClick={handleCreateOrUpdate}
            style={{
              padding: "10px",
              backgroundColor: editingPost ? "orange" : "green",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginRight: 10,
            }}
          >
            {editingPost ? "Update Post" : "Create Post"}
          </button>
          {editingPost && (
            <button
              onClick={() => {
                setEditingPost(null);
                setTitle("");
                setContent("");
              }}
              style={{
                padding: "10px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </>
      )}

      <h2>All Posts</h2>
      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {token && (
            <>
              <button
                onClick={() => handleEdit(post)}
                style={{
                  padding: 5,
                  backgroundColor: "orange",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginRight: 5,
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                style={{
                  padding: 5,
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}


// import { useState, useEffect } from "react";

// export default function BlogApp() {
//   const [posts, setPosts] = useState([]);
//   const [token, setToken] = useState(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [editingPost, setEditingPost] = useState(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     const res = await fetch("http://localhost:5000/api/posts");
//     const data = await res.json();
//     setPosts(data);
//   };

//   const handleLogin = async () => {
//     const res = await fetch("http://localhost:5000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     const data = await res.json();
//     if (data.token) {
//       setToken(data.token);
//     } else {
//       alert("Login failed. Check your credentials.");
//     }
//   };

//   const handleCreateOrUpdate = async () => {
//     if (!token) return alert("Please login first!");

//     const url = editingPost
//       ? `http://localhost:5000/api/posts/${editingPost._id}`
//       : "http://localhost:5000/api/posts";
//     const method = editingPost ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ title, content }),
//     });

//     if (res.ok) {
//       fetchPosts();
//       setTitle("");
//       setContent("");
//       setEditingPost(null);
//     } else {
//       alert("Failed to save post. Make sure it's not duplicate or invalid.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!token) return alert("Please login first!");

//     const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (res.ok) fetchPosts();
//   };

//   const handleEdit = (post) => {
//     setTitle(post.title);
//     setContent(post.content);
//     setEditingPost(post);
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "20px auto", padding: 20 }}>
//       <h1>Blog API Frontend</h1>

//       {!token ? (
//         <div>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{ width: "100%", padding: 8, marginBottom: 10 }}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={{ width: "100%", padding: 8, marginBottom: 10 }}
//           />
//           <button
//             onClick={handleLogin}
//             style={{
//               padding: "10px",
//               backgroundColor: "blue",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Login
//           </button>
//         </div>
//       ) : (
//         <>
//           <input
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             style={{ width: "100%", padding: 8, marginBottom: 10 }}
//           />
//           <textarea
//             placeholder="Content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             style={{ width: "100%", padding: 8, marginBottom: 10 }}
//           />
//           <button
//             onClick={handleCreateOrUpdate}
//             style={{
//               padding: "10px",
//               backgroundColor: editingPost ? "orange" : "green",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               marginRight: 10,
//             }}
//           >
//             {editingPost ? "Update Post" : "Create Post"}
//           </button>
//           {editingPost && (
//             <button
//               onClick={() => {
//                 setEditingPost(null);
//                 setTitle("");
//                 setContent("");
//               }}
//               style={{
//                 padding: "10px",
//                 backgroundColor: "gray",
//                 color: "white",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Cancel
//             </button>
//           )}
//         </>
//       )}

//       <h2>All Posts</h2>
//       {posts.map((post) => (
//         <div
//           key={post._id}
//           style={{
//             border: "1px solid #ddd",
//             padding: 10,
//             marginBottom: 10,
//             borderRadius: 4,
//           }}
//         >
//           <h3>{post.title}</h3>
//           <p>{post.content}</p>
//           {post.author && <p><i>Author: {post.author.email}</i></p>}
//           {token && (
//             <>
//               <button
//                 onClick={() => handleEdit(post)}
//                 style={{
//                   padding: 5,
//                   backgroundColor: "orange",
//                   color: "white",
//                   border: "none",
//                   cursor: "pointer",
//                   marginRight: 5,
//                 }}
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(post._id)}
//                 style={{
//                   padding: 5,
//                   backgroundColor: "red",
//                   color: "white",
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 Delete
//               </button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
