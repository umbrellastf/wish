const Post = require('../models/Post');
const Account = require('../models/Account');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('owner', 'username')
            .sort({ createdDate: -1 })
            .exec();

        return res.json({
            posts: posts.map(post => Post.toAPI(post, req.session.account)),
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unable to load posts' });
    }
};

const getUserPosts = async (req, res) => {
    const username = `${req.params.username || ''}`.trim();

    try {
        const account = await Account.findOne({ username }).exec();

        if (!account) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.find({ owner: account._id })
            .populate('owner', 'username')
            .sort({ createdDate: -1 })
            .exec();

        return res.json({
            user: Account.toAPI(account),
            posts: posts.map(post => Post.toAPI(post, req.session.account)),
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unable to load user posts' });
    }
};

const createPost = async (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'You must be logged in to post' });
    }

    const content = `${req.body.content || ''}`.trim();

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const post = new Post({
            content,
            owner: req.session.account._id,
            onlyfans: req.body.onlyfans === true,
        });

        await post.save();
        await post.populate('owner', 'username');

        return res.status(201).json({ post: Post.toAPI(post, req.session.account) });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unable to create post' });
    }
};

const deletePost = async (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'You must be logged in to delete posts' });
    }

    try {
        const post = await Post.findById(req.params.id).exec();

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.owner.toString() !== req.session.account._id.toString()) {
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        await Post.deleteOne({ _id: post._id }).exec();

        return res.json({ message: 'Post deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unable to delete post' });
    }
};

const payPost = async (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'You must be logged in to pay' });
    }

    try {
        const post = await Post.findById(req.params.id)
            .populate('owner', 'username')
            .exec();

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.fans.some(fan => fan.toString() === req.session.account._id.toString())) {
            post.fans.push(req.session.account._id);
            await post.save();
        }

        return res.json({ post: Post.toAPI(post, req.session.account) });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Unable to pay for post' });
    }
};

module.exports = {
    getPosts,
    getUserPosts,
    createPost,
    deletePost,
    payPost,
};
