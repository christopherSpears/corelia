const express = require('express');
const router = express.Router();
const pool = require('../db');

// for preflight requests
router.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204); // Respond with a successful status (No Content)
});

// get all roles
router.get('/', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    try {
        const result = await pool.query("SELECT role FROM user_permissions ORDER BY role");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
