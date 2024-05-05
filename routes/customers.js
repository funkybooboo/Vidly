const express = require("express");
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");

const router = express.Router();

// GET route to fetch all customers
router.get("/", asyncCatch(async (request, response) => {
    const customers = await Customer
        .find()
        .sort({ name: 1 });
    response.send(customers);
}));

// POST route to create a new customer
router.post("/", [auth, admin], asyncCatch(async (request, response) => {
    // Validate the request body
    const { error } = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    // Create a new customer instance
    const customer = new Customer({
        name: request.body.name,
        isGold: request.body.isGold,
        email: request.body.email
    });
    // Save the customer to the database
    await customer.save();
    response.send(customer);
}));

// PUT route to update an existing customer
router.put("/:id", [auth, admin], asyncCatch(async (request, response) => {
    try {
        // Find the customer by ID
        let customer = await Customer.findById(request.params.id);
        if (!customer) {
            response.status(404).send("The customer with the given ID was not found.");
            return;
        }
        // Validate the request body
        const { error } = validate(request.body);
        if (error) {
            response.status(400).send(error);
            return;
        }
        // Update the customer's details
        customer.name = request.body.name;
        customer.email = request.body.email;
        customer.isGold = request.body.isGold;
        // Save the updated customer
        customer = await customer.save();
        response.send(customer);
    } catch (error) {
        console.log(error.message);
    }
}));

// DELETE route to delete a customer
router.delete("/:id", [auth, admin], asyncCatch(async (request, response) => {
    const customer = await Customer.deleteOne({ _id: request.params.id });
    if (!customer) {
        response.status(404).send("The customer with the given ID was not found.");
        return;
    }
    response.send(customer);
}));

// GET route to fetch a customer by ID
router.get("/:id", asyncCatch(async (request, response) => {
    const customer = await Customer.findById(request.params.id);
    if (!customer) {
        response.status(404).send("The customer with the given ID was not found.");
        return;
    }
    response.send(customer);
}));

module.exports = router;
