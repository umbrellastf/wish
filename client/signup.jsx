const React = require('react');
const { useState } = React;

const { Container, Row, Col, Form, Button, Card } = require('react-bootstrap');

function Signup() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        console.log('Signup:', form);
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

                                <Button type="submit" className="w-100">
                                    Create Account
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

module.exports = Signup;