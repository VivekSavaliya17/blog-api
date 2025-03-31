const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    try {
        const post = new Post({ title, content, author: req.user.id });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Add this function to fetch all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updatePost = async (req, res) => {
    const { title, content } = req.body;
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id)
            return res.status(403).json({ message: "Not authorized" });

        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id)
            return res.status(403).json({ message: "Not authorized" });

        await post.deleteOne();
        res.json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
