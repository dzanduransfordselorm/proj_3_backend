const AWS = require("@aws-sdk/client-dynamodb");
const dynamodb = new AWS.DynamoDB();

// Helper function to convert DynamoDB JSON to standard JSON
const convertDynamoDBItem = (item) => {
  const result = {};

  for (const [key, value] of Object.entries(item)) {
    const type = Object.keys(value)[0];
    switch (type) {
      case "S":
        result[key] = value.S;
        break;
      case "N":
        result[key] = parseFloat(value.N); // Convert number strings to floats
        break;
      case "BOOL":
        result[key] = value.BOOL;
        break;
      case "M":
        result[key] = convertDynamoDBItem(value.M); // Recursively handle maps
        break;
      case "L":
        result[key] = value.L.map(convertDynamoDBItem); // Recursively handle lists
        break;
      case "SS":
        result[key] = value.SS; // String Set
        break;
      case "NS":
        result[key] = value.NS.map(parseFloat); // Number Set
        break;
      case "BS":
        result[key] = value.BS; // Binary Set
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  return result;
};

// Example usage
const dynamoDBData = [
  {
    Student: { S: "Riley Davis" },
    Attendance: { N: "97.22" },
    Score: { N: "99.9" },
    "Q-Comp": { S: "High" },
    "A-Comp": { S: "High" },
    Compliance: { S: "High Compliance" },
    Rank: { S: "1" },
    "Personal Email": { S: "wamwangimathenge@gmail.com" },
    "Quiz Submitted": { N: "17" },
    Cohort: { S: "CE3" },
    Email: { S: "riley.davis@example.org" },
  },
];

const standardJSONData = dynamoDBData.map(convertDynamoDBItem);
console.log(standardJSONData);
module.exports = convertDynamoDBItem;
