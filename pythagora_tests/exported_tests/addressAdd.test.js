describe("Test Address Add", () => {
  const axios = require("axios");
  const { ObjectId } = require("mongodb");
  const getAuthToken = require('./auth');
  let authToken;
  let mongoDocuments;
  const testId = "addressAdd.test.js";

  beforeAll(async () => {
    mongoDocuments = await global.setUpDb(testId);
    try {
      authToken = await getAuthToken('http://localhost:3000', mongoDocuments["users"][0]);
    } catch (err) {}
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test("POST /api/address/add - Add address", async () => {
    const reqBody = {
      "isDefault": false,
      "address": "cvxcv",
      "city": "xcvxcv",
      "state": "xcvxcv",
      "country": "xcvxcv",
      "zipCode": "34234"
    };

    const headers = {
      "content-type": "application/json",
      "authorization": authToken
    };

    const response = await axios.post("http://localhost:3000/api/address/add", reqBody, {headers:Object.assign(headers, authToken)});

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.message).toBe("Address has been added successfully!");

    const newAddressId = response.data.address._id;

    const address = await global.getMongoCollection("addresses").findOne({ _id: new ObjectId(newAddressId) });

    expect(address._id.toString()).toBe(newAddressId);
    expect(address.isDefault).toBe(false);
    expect(address.address).toBe("cvxcv");
    expect(address.city).toBe("xcvxcv");
    expect(address.state).toBe("xcvxcv");
    expect(address.country).toBe("xcvxcv");
    expect(address.zipCode).toBe("34234");
    expect(address.user.toString()).toBe("64256d9c4087833144d71c16");
  });
});
