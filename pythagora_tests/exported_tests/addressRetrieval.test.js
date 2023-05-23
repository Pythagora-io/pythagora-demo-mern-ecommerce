const axios = require("axios");
const { ObjectId } = require("mongodb");
const getAuthToken = require("./auth");

describe("GET /api/address", () => {
  const endpoint = "/api/address";
  const method = "GET";
  const headers = {
    accept: "application/json, text/plain, */*"
  };
  let authToken, mongoDocuments;

  beforeAll(async () => {
    const testId = "addressRetrieval.test.js";
    mongoDocuments = await global.setUpDb(testId);
    try {
      authToken = await getAuthToken('http://localhost:3000', mongoDocuments['users'][0]);
    } catch (err) {}
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test("User can fetch own addresses", async () => {
    const response = await axios.get("http://localhost:3000" + endpoint, {
      headers: Object.assign(headers, authToken)
    });

    expect(response.status).toBe(200);
    expect(response.data.addresses).toEqual([]);
  });
});