const express = require("express");
const { createPost, updatePost, deletePost, getAllPosts } = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add a GET route to fetch all posts
router.get("/", getAllPosts);

router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
