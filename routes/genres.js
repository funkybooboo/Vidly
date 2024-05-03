const express = require("express");
const Joi = require("joi");

const router = express.Router();

const genres = [
    {id: 1, name: "Action"},
    {id: 2, name: "Horror"},
    {id: 3, name: "Romance"}
];

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.valid(genre, schema);
}

router.get("/", (request, response) => {
    response.send(genres);
});

router.post("/", (reqest, response) => {
    const {error} = validateGenre(reqest.body);
    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    }
    const genre = {
        id: genres.length + 1,
        name: reqest.body.name
    };
    genres.push(genre);
    response.send(genre);
});

router.put("/:id", (request, response) => {
    const genre = genres.find(genre => genre.id === parseInt(request.params.id));
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    const {error} = validateGenre(request.body);
    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    }
    genre.name = request.body.name;
    response.send(genre);
});

router.delete("/:id", (request, response) => {
    const genre = genres.find(genre => genre.id === parseInt(request.params.id));
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    response.send(genre);
});

router.get("/:id", (request, response) => {
    const genre = genres.find(genre => genre.id === parseInt(request.params.id));
    if (!genre) {
        response.status(404).send("The genre with the given ID was not found.");
        return;
    }
    request.send(genre);
});

module.exports = router;