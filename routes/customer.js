const express = require("express");
const {Customer, validate} = require("../models/customer");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const customers = await Customer
            .find()
            .sort({name: 1});
        response.send(customers);
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/", async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    try {
        const customer = new Customer({
            name: request.body.name,
            isGold: request.body.isGold,
            phone: request.body.phone
        });
        await customer.save();
        response.send(customer);
    } catch (error) {
        console.log(error.message);
    }
});

router.put("/:id", async (request, response) => {
    try {
        let customer = await Customer.findById(request.params.id);
        if (!customer) {
            response.status(404).send("The genre with the given ID was not found.");
            return;
        }
        const {error} = validate(request.body);
        if (error) {
            response.status(400).send(error);
            return;
        }
        customer.name = request.body.name;
        customer.phone = request.body.phone;
        customer.isGold = request.body.isGold;
        customer = await customer.save();
        response.send(customer);
    } catch (error) {
        console.log(error.message);
    }
});

router.delete("/:id", async (request, response) => {
    const customer = await Customer.deleteOne({_id: request.params.id});
    if (!customer) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(customer);
});

router.get("/:id", async (request, response) => {
    const customer = await Customer.findById(request.params.id);
    if (!customer) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    request.send(customer);
});

module.exports = router;