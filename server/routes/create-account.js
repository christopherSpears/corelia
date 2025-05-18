const express = require('express');
const router = express.Router();
const pool = require('../db');
const argon2 = require('argon2');

const randomlyGeneratedPassword = function generateRandomPassword(length = 5){
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let randomPassword = "";
    for (let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomPassword += charset[randomIndex];
    } console.log(`temp password: ${randomPassword}`);
    return randomPassword;
}

const hashPassword = async (randomlyGeneratedPassword) => {
    try {
        return await argon2.hash(randomlyGeneratedPassword, {
            type: argon2.argon2id, //use argon2id
            memoryCost: 2 ** 16, //64MB memory usage
            timeCost: 3, //iteration count
            parallelism: 2 //threads
        });
    } catch (error) {
        console.error('Error hashing password', error);
        throw error;
    }
};

// for preflight requests
router.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204); // Respond with a successful status (No Content)
});

router.post('/', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { email, firstName, lastName, role } = req.body;

    if(!email || !firstName || !lastName || !role){
        return res.status(400).json({ error: "All fields required"});
    }
    
    try{
        const tempPassword = randomlyGeneratedPassword();
        const hashedPassword = await hashPassword(tempPassword);
        await pool.query('INSERT INTO users (email, first_name, last_name, password_hash, role) VALUES ($1, $2, $3, $4, $5)', [email, firstName, lastName, hashedPassword, role]);
        res.status(201).json({ message: "User created successfully!"});
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({error: 'Something went wrong. Try again later.'});
    }
});

module.exports = router;