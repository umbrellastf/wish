const { BrowserRouter, Routes, Route } = require('react-router-dom');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { Login } = require('./login.jsx');

const Home = () => {
    return (
        <div></div>
    );
}

const NF = () => {
    return (
        <div>404 NOT FOUND</div>
    );
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NF />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('app')).render(<App />);