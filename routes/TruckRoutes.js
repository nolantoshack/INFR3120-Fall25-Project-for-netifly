const express = require('express');
const router = express.Router();

// GET /trucks/create - Render the truck creation form
router.get('/trucks/create', (req, res) => {
    // Renders views/create.ejs (assuming it handles truck creation now)
    res.render('create', { 
        title: 'Register New Truck/Unit', 
        activePage: 'trucks-create' 
    });
});

// GET /trucks - Placeholder for the View Trucks page
router.get('/trucks', (req, res) => {

    res.send('<h1>Trucks/Units List Page</h1><p>Work in progress. This route will render the list of trucks.</p>');
});

// GET /trucks/:id - Placeholder for the Edit Truck page
router.get('/trucks/:id', (req, res) => {
    // Placeholder logic - this would normally fetch the truck data and render the edit view
    const mockTruckData = { id: req.params.id, title: 'Mock Truck Title', description: 'Mock Description', severity: 'Medium' };
    res.render('edit', { 
        // NOTE: The template variable is kept as 'incident' to avoid breaking the existing EJS structure in edit.ejs
        incident: mockTruckData, 
        title: 'Edit Truck/Unit'
    });
});

