const React = require('react');
const { useState, useEffect } = React;
const { Link } = require('react-router-dom');
const { Button, Form, Card, Alert } = require('react-bootstrap');

const Post = ({
    account,
    postsUrl = '/api/posts',
    showComposer = true,
    emptyMessage = '',
    onNotFound = () => {},
}) => {
    const [content, setContent] = useState('');
    const [onlyfans, setOnlyfans] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState('');
    const [payingId, setPayingId] = useState('');

    const loadPosts = async () => {
        try {
            const response = await fetch(postsUrl);

            if (!response.ok) {
                if (response.status === 404) {
                    onNotFound();
                }

                setPosts([]);
                return;
            }

            const data = await response.json();
            setPosts(data.posts || []);
        } catch (err) {
            setPosts([]);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [account, postsUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!account) {
            setError('Please log in before posting');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, onlyfans }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Unable to create post');
                return;
            }

            setContent('');
            setOnlyfans(false);
            setPosts([data.post, ...posts]);
        } catch (err) {
            setError('Unable to create post');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        setError('');
        setDeletingId(postId);

        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Unable to delete post');
                return;
            }

            setPosts(posts.filter(post => post._id !== postId));
        } catch (err) {
            setError('Unable to delete post');
        } finally {
            setDeletingId('');
        }
    };

    const handlePay = async (postId) => {
        if (!account) {
            setError('Please log in before paying');
            return;
        }

        setError('');
        setPayingId(postId);

        try {
            const response = await fetch(`/api/posts/${postId}/pay`, {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Unable to pay for post');
                return;
            }

            setPosts(posts.map(post => post._id === postId ? data.post : post));
        } catch (err) {
            setError('Unable to pay for post');
        } finally {
            setPayingId('');
        }
    };

    const formatDate = (createdDate) => {
        if (!createdDate) {
            return '';
        }

        return new Date(createdDate).toLocaleString();
    };

    return (
        <Card className="shadow-sm w-100" style={{ maxWidth: '56rem' }}>
            <Card.Body>
                {showComposer && (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                rows={4}
                                placeholder="Write your post..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Check
                            className="mb-3"
                            type="checkbox"
                            label="Onlyfans post"
                            checked={onlyfans}
                            onChange={(e) => setOnlyfans(e.target.checked)}
                        />

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Button type="submit" disabled={!content.trim() || isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Form>
                )}

                {!showComposer && error && <Alert variant="danger">{error}</Alert>}

                {posts.length > 0 && (
                    <div className={showComposer ? 'mt-4' : ''}>
                        {posts.map((post, index) => (
                            <Card key={post._id || index} className="mb-2">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                        <div>
                                            <div className="fw-bold">
                                                <Link to={`/${encodeURIComponent(post.username)}`}>
                                                    {post.username}
                                                </Link>
                                            </div>
                                            {post.onlyfans && (
                                                <div className="text-muted small">
                                                    Onlyfans post
                                                </div>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2">
                                            {post.canPay && (
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => handlePay(post._id)}
                                                    disabled={payingId === post._id}
                                                >
                                                    {payingId === post._id ? 'Paying...' : 'Pay'}
                                                </Button>
                                            )}
                                            {post.canDelete && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(post._id)}
                                                    disabled={deletingId === post._id}
                                                >
                                                    {deletingId === post._id ? 'Deleting...' : 'Delete'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div>{post.content}</div>
                                    {post.isLocked && (
                                        <div className="border rounded p-3 bg-light">
                                            You do not have access to this post yet.
                                        </div>
                                    )}
                                    <div className="text-muted small mt-2">
                                        {formatDate(post.createdDate)}
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

                {posts.length === 0 && emptyMessage && (
                    <div className="text-muted">{emptyMessage}</div>
                )}
            </Card.Body>
        </Card>
    );
};

module.exports = Post;
