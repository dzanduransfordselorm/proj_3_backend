const express = require("express");
const app = express();
const AWS = require("@aws-sdk/client-dynamodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

//initialize DB client
const dBClient = new AWS.DynamoDBClient({ region: "us-east-2" });

app.use(cors());
//allow json to be parsed in the request and response
app.use(express.json());

app.use("/api", userRoutes);
//app.use("/api/movies", movieRoutes);
// app.use("/api/rentals", rentalRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
