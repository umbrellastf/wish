const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/api/account', controllers.Account.getAccount);

    app.post('/api/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/api/logout', mid.requiresLogin, controllers.Account.logout);

    app.post('/api/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.post('/api/resetpass', mid.requiresLogin, controllers.Account.resetPassword);

    app.get('/api/posts', controllers.Post.getPosts);

    app.get('/api/users/:username/posts', controllers.Post.getUserPosts);

    app.post('/api/posts', mid.requiresLogin, controllers.Post.createPost);

    app.post('/api/posts/:id/pay', mid.requiresLogin, controllers.Post.payPost);

    app.delete('/api/posts/:id', mid.requiresLogin, controllers.Post.deletePost);
};

module.exports = router;
