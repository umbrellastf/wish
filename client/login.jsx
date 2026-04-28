const React = require('react');
const { useState } = React;
const { Link, useNavigate } = require('react-router-dom');
const { Container, Row, Col, Form, Button, Card } = require('react-bootstrap');

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: ""
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

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Unable to sign in');
                return;
            }

            navigate('/');
        } catch (err) {
            setError('Unable to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Row>
                <Col>
                    <Card style={{ width: "22rem" }} className="p-3 shadow">

                        <Card.Body>

                            <h3 className="text-center mb-4">Login</h3>

                            <Form onSubmit={handleSubmit}>

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

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                {error && <div className="text-danger mb-3">{error}</div>}

                                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </Button>

                                <div className="text-center mt-3">
                                    Need an account? <Link to="/signup">Sign Up</Link>
                                </div>

                            </Form>

                        </Card.Body>

                    </Card>
                </Col>

            </Row>

        </Container>
    );
}

module.exports = {
    Login
}
