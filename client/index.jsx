const { BrowserRouter, Routes, Route } = require('react-router-dom');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { Link, useNavigate } = require('react-router-dom');
const { Button } = require('react-bootstrap');
const { Login } = require('./login.jsx');
const SignUp = require('./signup.jsx');
const ResetPassword = require('./resetpassword.jsx');
const User = require('./user.jsx');
const Post = require('./components/post.jsx');
const Account = require('./account.jsx');

const AccountBar = ({ account, setAccount }) => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
        } catch (err) {
        } finally {
            setAccount(null);
            navigate('/');
        }
    };

    return (
        <div className="position-fixed top-0 end-0 p-3 d-flex align-items-center gap-2" style={{ zIndex: 1000 }}>
            {account ? (
                <>
                    <Button as={Link} to="/account" variant="link" size="sm" className="p-0">
                        {account.username}
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </>
            ) : (
                <Button as={Link} to="/login" variant="primary" size="sm">
                    Login
                </Button>
            )}
        </div>
    );
};

const Home = () => {

    const [account, setAccount] = useState(null);

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

    useEffect(() => {
        loadAccount();
    }, []);

    return (
        <div>
            <AccountBar account={account} setAccount={setAccount} />
            <main className="container pt-5 mt-4 d-flex justify-content-center">
                <Post account={account} />
            </main>
        </div>
    );
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/account" element={<Account />} />
                <Route path="/resetpass" element={<ResetPassword />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="*" element={<User />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('app')).render(<App />);
