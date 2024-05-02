const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const genres = [
    {id: 1, name: "Action"},
    {id: 2, name: "Horror"},
    {id: 3, name: "Romance"}
];

function validateGenre(genre) {

}