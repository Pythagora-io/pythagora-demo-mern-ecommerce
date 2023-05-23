const axios = require("axios");
const { ObjectId } = require("mongodb");
const getAuthToken = require('./auth');

describe("Newsletter Subscription", () => {
  let testId = "newsletterSubscription.test.js";
  let url = "http://localhost:3000/api/newsletter/subscribe";
  let method = "POST";
  let headers = {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json"
  };
  let reqBody = {
    "email": "asdasd@asd.com"
  };
  
  let authToken;
  let mongoDocuments;
  
  beforeAll(async () => {
    mongoDocuments = await global.setUpDb(testId);
    try {
      authToken = await getAuthToken("http://localhost:3000", undefined);
    } catch (err) {}
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test("Subscribe to newsletter", async () => {
    const response = await axios.post(url, reqBody, {headers: Object.assign(headers, authToken)});
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.message).toBe("You have successfully subscribed to the newsletter");
  });
});