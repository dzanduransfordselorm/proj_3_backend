const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const Joi = require("joi");
const { Sequelize } = require("sequelize");

const dBClient = new DynamoDBClient({ region: "us-east-2" });

const convertDynamoDBItem = require("../helper");

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const date = new Date().toString();

  const params = {
    TableName: "Users",
    Item: {
      UserID: { S: email },
      Name: { S: name },
      Email: { S: email },
      Password: { S: hashedPassword },
      JoinDate: { S: date },
    },
  };

  const check = {
    TableName: "Users",
    Key: { UserID: { S: email } },
  };

  try {
    const { Item } = await dBClient.send(new GetItemCommand(check));
    if (Item) return res.status(400).send("User already exists");

    await dBClient.send(new PutItemCommand(params));
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const params = {
    TableName: "Users",
    Key: { UserID: { S: email } },
  };

  try {
    const { Item } = await dBClient.send(new GetItemCommand(params));
    if (!Item) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(password, Item.Password.S);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = jwt.sign({ UserID: Item.UserID.S }, "jwtPrivateKey");
    res.send(token);
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

router.get("/students", async (req, res) => {
  const params = { TableName: "Students" };

  try {
    const data = await dBClient.send(new ScanCommand(params));
    const outputData = data.Items.map(convertDynamoDBItem);
    res.status(200).send(outputData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching users: " + error.message);
  }
});

router.get("/health-check", (req, res) => {
  try {
    if ((originalUrl = "/api/health-check")) {
      res.status(200).json({ msg: "Backend is healthy💪🏻" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Backend is sick🤢" });
  }
});

router.post("/test-db-connection", async (req, res) => {
  const { host, password, username, database, engine, port } = req.body.inputs;

  try {
    // Create a new Sequelize instance
    const sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect: engine, // Explicitly specify the dialect here
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });

    // Try to authenticate the connection
    await sequelize.authenticate();
    console.log(`Database connected on ${new Date()}`);
    res.status(200).json({ msg: `Database connected on ${new Date()}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "DB connection error", error: error.message });
  }
});

module.exports = router;
