describe("GET /api/address/:id", () => {
  const axios = require("axios");
  const { ObjectId } = require("mongodb");
  const getAuthToken = require("./auth");

  let authToken;
  let mongoDocuments;

  beforeAll(async () => {
    mongoDocuments = await global.setUpDb("getAddressById.test.js");
    try {
      authToken = await getAuthToken("http://localhost:3000", undefined);
    } catch (err) {}
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test("should return address by id", async () => {
    const headers = { "Accept": "application/json, text/plain, */*", "authorization": authToken};
    const response = await axios.get("http://localhost:3000/api/address/64256deb4087833144d71c25", { headers: Object.assign(headers, authToken) });

    expect(response.status).toBe(200);
    expect(response.data.address._id).toBe("64256deb4087833144d71c25");
    expect(response.data.address.isDefault).toBe(true);
    expect(response.data.address.address).toBe("asasd");
    expect(response.data.address.city).toBe("asdasd");
    expect(response.data.address.state).toBe("asdasd");
    expect(response.data.address.country).toBe("asdasd");
    expect(response.data.address.zipCode).toBe("12312");
    expect(response.data.address.user).toBe("64256d9c4087833144d71c16");

    const preQueryDoc = mongoDocuments["addresses"][0];
    const postQueryDoc = await global.getMongoCollection("addresses").findOne({ "_id": ObjectId("64256deb4087833144d71c25") });

    expect(postQueryDoc).toMatchObject(preQueryDoc);
  });
});
