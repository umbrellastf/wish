const React = require('react');
const { useState } = React;
const { Link, useNavigate } = require('react-router-dom');

const { Container, Row, Col, Form, Button, Card } = require('react-bootstrap');

function SignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: form.username,
                    pass: form.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Unable to create account');
                return;
            }

            navigate(data.redirect || '/');
        } catch (err) {
            setError('Unable to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Row>
                <Col>
                    <Card style={{ width: "24rem" }} className="p-3 shadow">
                        <Card.Body>
                            <h3 className="text-center mb-4">Sign Up</h3>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                {error && <div className="text-danger mb-3">{error}</div>}

                                <Button type="submit" className="w-100" disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Create Account'}
                                </Button>

                                <div className="text-center mt-3">
                                    Already have an account? <Link to="/login">Sign In</Link>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

module.exports = SignUp;
