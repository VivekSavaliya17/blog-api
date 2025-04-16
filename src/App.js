import { useState, useEffect } from "react";

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
    const response = await fetch("http://localhost:5000/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password123" })
    });
    const data = await response.json();
    if (data.token) setToken(data.token);
    else alert("Login failed");
  };

  const handleCreateOrUpdatePost = async () => {
    if (!token) return alert("Please log in first");

    const url = editingPost 
      ? `http://localhost:5000/api/posts/${editingPost._id}`
      : "http://localhost:5000/api/posts";

    const method = editingPost ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ title, content })
    });

    if (response.ok) {
      fetchPosts();
      setTitle("");
      setContent("");
      setEditingPost(null);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return alert("Please log in first");

    const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) fetchPosts();
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPost(post);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h1>Blog API Frontend</h1>

      {!token ? (
        <button onClick={handleLogin} style={{ padding: "10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
          Login
        </button>
      ) : (
        <div>
          <input 
            style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }} 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }} 
            placeholder="Content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            onClick={handleCreateOrUpdatePost} 
            style={{ padding: "10px", backgroundColor: editingPost ? "orange" : "green", color: "white", border: "none", cursor: "pointer", marginRight: "10px" }}
          >
            {editingPost ? "Update Post" : "Create Post"}
          </button>
          {editingPost && (
            <button 
              onClick={() => { setEditingPost(null); setTitle(""); setContent(""); }} 
              style={{ padding: "10px", backgroundColor: "gray", color: "white", border: "none", cursor: "pointer" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}

      <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "4px" }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {token && (
            <div>
              <button 
                onClick={() => handleEdit(post)} 
                style={{ padding: "5px", backgroundColor: "orange", color: "white", border: "none", cursor: "pointer", marginRight: "5px" }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(post._id)} 
                style={{ padding: "5px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}