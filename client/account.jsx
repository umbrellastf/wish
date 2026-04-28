const React = require('react');
const { useState, useEffect } = React;
const { Link, useNavigate } = require('react-router-dom');
const { Container, Card, Button, Alert } = require('react-bootstrap');
const ResetPassword = require('./resetpassword.jsx');

const Account = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
            } finally {
                setIsLoading(false);
            }
        };

        loadAccount();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
        } catch (err) {
        } finally {
            navigate('/');
        }
    };

    if (isLoading) {
        return (
            <Container className="pt-5 mt-4">
                <Alert variant="secondary">Loading account...</Alert>
            </Container>
        );
    }

    if (!account) {
        return (
            <Container className="pt-5 mt-4">
                <Alert variant="danger">Please log in to view your account.</Alert>
                <Button as={Link} to="/login">Login</Button>
            </Container>
        );
    }

    return (
        <Container className="pt-5 mt-4 d-flex flex-column align-items-center gap-3">
            <Card className="shadow-sm" style={{ width: '24rem' }}>
                <Card.Body>
                    <h3 className="mb-3">Account</h3>
                    <div className="mb-3">
                        <div className="text-muted small">Username</div>
                        <Link to={`/${encodeURIComponent(account.username)}`} className="fw-bold">
                            {account.username}
                        </Link>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </Card.Body>
            </Card>

            <ResetPassword
                initialUsername={account.username}
                showUsername={false}
                showLoginLink={false}
            />
        </Container>
    );
};

module.exports = Account;
