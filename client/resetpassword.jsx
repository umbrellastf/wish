const React = require('react');
const { useState } = React;
const { Link } = require('react-router-dom');
const { Container, Row, Col, Form, Button, Card, Alert } = require('react-bootstrap');

const ResetPassword = ({
    initialUsername = '',
    showUsername = true,
    showLoginLink = true,
}) => {
    const [form, setForm] = useState({
        username: initialUsername,
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            setSuccess('');
            return;
        }

        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/resetpass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: showUsername ? form.username : initialUsername,
                    pass: form.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Unable to reset password');
                return;
            }

            setForm({
                username: initialUsername,
                password: '',
                confirmPassword: '',
            });
            setSuccess(data.message || 'Password reset successfully');
        } catch (err) {
            setError('Unable to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center">
            <Row>
                <Col>
                    <Card style={{ width: '24rem' }} className="p-3 shadow">
                        <Card.Body>
                            <h3 className="text-center mb-4">Reset Password</h3>

                            <Form onSubmit={handleSubmit}>
                                {showUsername && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="Enter username"
                                            value={form.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter new password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                {error && <Alert variant="danger">{error}</Alert>}
                                {success && <Alert variant="success">{success}</Alert>}

                                <Button type="submit" className="w-100" disabled={isLoading}>
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </Button>

                                {showLoginLink && (
                                    <div className="text-center mt-3">
                                        Remembered it? <Link to="/login">Sign In</Link>
                                    </div>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

module.exports = ResetPassword;
