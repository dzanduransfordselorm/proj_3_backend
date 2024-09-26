const express = require("express");
const router = express.Router();
const {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const Joi = require("joi");

const dBClient = new DynamoDBClient({ region: "us-east-2" });

const movieSchema = Joi.object({
  movieID: Joi.string().required(),
  title: Joi.string().required(),
  genre: Joi.string().required(),
  releaseYear: Joi.number().integer().required(),
  director: Joi.string().required(),
  rating: Joi.number().required(),
});

router.post("/add", async (req, res) => {
  const { error } = movieSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { movieID, title, genre, releaseYear, director, rating } = req.body;

  const params = {
    TableName: "Movies",
    Item: {
      MovieID: { S: movieID },
      Title: { S: title },
      Genre: { S: genre },
      ReleaseYear: { N: releaseYear.toString() },
      Director: { S: director },
      Rating: { N: rating.toString() },
    },
  };

  try {
    await dBClient.send(new PutItemCommand(params));
    res.status(201).send("Movie added successfully");
  } catch (error) {
    res.status(500).send("Error adding movie: " + error.message);
  }
});

router.get("/list", async (req, res) => {
  const params = {
    TableName: "Movies",
  };

  try {
    const data = await dBClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (error) {
    res.status(500).send("Error fetching movies: " + error.message);
  }
});

module.exports = router;
