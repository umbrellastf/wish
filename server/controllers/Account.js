const Account = require('../models/Account');

const logout = (req, res) => {
    req.session.destroy(() => res.sendStatus(200));
};

const getAccount = (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    return res.json({ account: req.session.account });
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.password}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({});
    });
};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();

        req.session.account = Account.toAPI(newAccount);

        return res.json({ redirect: '/' });
    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }

        return res.status(500).json({ error: 'An error occured!' });
    }
};

const resetPassword = async (req, res) => {
    const username = `${req.body.username || ''}`.trim();
    const pass = `${req.body.pass || ''}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        const account = await Account.findOne({ username }).exec();

        if (!account) {
            return res.status(404).json({ error: 'Account not found!' });
        }

        account.password = await Account.generateHash(pass);
        await account.save();

        if (req.session.account && req.session.account._id.toString() === account._id.toString()) {
            req.session.account = Account.toAPI(account);
        }

        return res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured!' });
    }
};

module.exports = {
    login,
    logout,
    getAccount,
    signup,
    resetPassword,
};
