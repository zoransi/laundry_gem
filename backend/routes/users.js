const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Registracija korisnika
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, address, phone } = req.body;

        // Provjera postoji li korisnik s istim usernameom ili emailom
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hashiranje lozinke
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Kreiranje novog korisnika
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            address,
            phone
        });

        // Spremanje korisnika u bazu podataka
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Prijava korisnika
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Provjera postoji li korisnik s tim usernameom
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Provjera lozinke
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Dohvat korisnika
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;