const express = require('express');
const router = express.Router();
const Superadmin = require('../models/Superadmin.model')

// Route to create a new Superadmin
router.post('/superadmins', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create a new Superadmin document
    const newSuperadmin = new Superadmin({
      name,
      email,
      password,
      role,
    });

    // Save the newSuperadmin to the database
    const savedSuperadmin = await newSuperadmin.save();

    res.status(201).json(savedSuperadmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
