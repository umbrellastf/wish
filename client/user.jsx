const React = require('react');
const { useState, useEffect } = React;
const { useLocation } = require('react-router-dom');
const { Container, Alert } = require('react-bootstrap');
const Post = require('./components/post.jsx');

const User = () => {
    const location = useLocation();
    const [notFound, setNotFound] = useState(false);
    const [account, setAccount] = useState(null);
    const username = decodeURIComponent(location.pathname.replace(/^\/+/, '').split('/')[0] || '');

    useEffect(() => {
        setNotFound(false);

        const loadAccount = async () => {
            try {
                const response = await fetch('/api/account');

                if (!response.ok) {
                    setAccount(null);
                    return;
                }

                const data = await response.json();
                setAccount(data.account);
            } catch (err) {
                setAccount(null);
            }
        };

        loadAccount();
    }, [username]);

    if (!username || notFound) {
        return (
            <Container className="pt-5 mt-4">
                <Alert variant="danger">404 Not Found</Alert>
            </Container>
        );
    }

    return (
        <Container className="pt-5 mt-4 d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: '56rem' }}>
                <h2 className="mb-3">{username}</h2>
                <Post
                    account={account}
                    postsUrl={`/api/users/${encodeURIComponent(username)}/posts`}
                    showComposer={false}
                    emptyMessage="No posts yet."
                    onNotFound={() => setNotFound(true)}
                />
            </div>
        </Container>
    );
}

module.exports = User;
