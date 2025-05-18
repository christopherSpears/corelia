const express = require('express');
const router = express.Router();
const pool = require('../db');
const argon2 = require('argon2');

// for preflight requests
router.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204); // Respond with a successful status (No Content)
});

const hashPassword = async (password) => {
    try {
        return await argon2.hash(password, {
            type: argon2.argon2id, //use argon2id
            memoryCost: 2 ** 16, //64MB memory usage
            timeCost: 3, //iteration count
            parallelism: 2 //threads
        });
    } catch (error) {
        console.error('Error hashing password: ', error);
        throw error;
    }
};

router.post('/', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { email, oldPassword, newPassword } = req.body;

    if(!email || !oldPassword || !newPassword){
        console.log('Internal error: field was empty on submit');
        return res.status(400).json({ error: "All fields required"});
    }

    //make sure old password is correct
    try{
        const result = await pool.query('SELECT email, password_hash FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0){
            console.log('User not found');
            return res.status(404).json({error: 'User not found or password incorrect'});
        }

        const isMatch = await argon2.verify(result.rows[0].password_hash, oldPassword);
        if (!isMatch){
            console.log('Password incorrect');
            return res.status(401).json({error: 'User not found or password incorrect'});
        }
        //change password in db
        const hashedPassword = await hashPassword(newPassword);
        await pool.query('UPDATE users SET password_hash = $1, password_reset_required = $2, modified = NOW() WHERE email = $3', [hashedPassword, false, email]);
        res.status(201).json({ message: "Password updated successfully!"});
        } catch (error) {
            console.error('Internal error:', error);
            res.status(500).json({error: 'Something went wrong. Try again later.'});
        }
});



module.exports = router;