const express = require("express");
const router = require("express").Router();
const {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const Joi = require("joi");

const dBClient = new DynamoDBClient({ region: "us-east-2" });

const rentalSchema = Joi.object({
  rentalID: Joi.string().required(),
  userID: Joi.string().required(),
  movieID: Joi.string().required(),
  rentalDate: Joi.string().required(),
  status: Joi.string().valid("rented", "returned").required(),
});

router.post("/rent", async (req, res) => {
  const { error } = rentalSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { rentalID, userID, movieID, rentalDate, status } = req.body;

  const params = {
    TableName: "Rentals",
    Item: {
      RentalID: { S: rentalID },
      UserID: { S: userID },
      MovieID: { S: movieID },
      RentalDate: { S: rentalDate },
      Status: { S: status },
    },
  };
});
