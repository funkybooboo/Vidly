const express = require("express");
const {Customer, validate} = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncCatch = require("../middleware/asyncCatch");

const router = express.Router();

router.get("/", asyncCatch(async (request, response) => {
    const customers = await Customer
        .find()
        .sort({name: 1});
    response.send(customers);
}));

router.post("/", [auth, admin], asyncCatch(async (request, response) => {
    const {error} = validate(request.body);
    if (error) {
        response.status(400).send(error);
        return;
    }
    const customer = new Customer({
        name: request.body.name,
        isGold: request.body.isGold,
        email: request.body.email
    });
    await customer.save();
    response.send(customer);
}));

router.put("/:id", [auth, admin], asyncCatch(async (request, response) => {
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
        customer.email = request.body.email;
        customer.isGold = request.body.isGold;
        customer = await customer.save();
        response.send(customer);
    } catch (error) {
        console.log(error.message);
    }
}));

router.delete("/:id", [auth, admin], asyncCatch(async (request, response) => {
    const customer = await Customer.deleteOne({_id: request.params.id});
    if (!customer) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(customer);
}));

router.get("/:id", asyncCatch(async (request, response) => {
    const customer = await Customer.findById(request.params.id);
    if (!customer) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    response.send(customer);
}));

module.exports = router;