describe('API GET /api/address', () => {
    const { ObjectId } = require("mongodb");
    const axios = require("axios");
    const getAuthToken = require("./auth");
    let authToken;
    let mongoDocuments;

    beforeAll(async () => {
        const testId = "getAddressesForAuthenticatedUser.test.js";
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken("http://localhost:3000", mongoDocuments["users"][0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("GET /api/address returns all addresses for authenticated user", async () => {
        const endpoint = "/api/address";
        const headers = {
            "accept": "application/json, text/plain, */*",
        };

        const response = await axios.get(`http://localhost:3000${endpoint}`, {headers: Object.assign(headers, authToken)});

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.addresses)).toBe(true);
        expect(response.data.addresses.length).toBe(1);

        const address = response.data.addresses[0];
        const preQueryAddress = mongoDocuments["addresses"][0];

        expect(address.isDefault).toBe(preQueryAddress.isDefault);
        expect(address.address).toBe(preQueryAddress.address);
        expect(address.city).toBe(preQueryAddress.city);
        expect(address.state).toBe(preQueryAddress.state);
        expect(address.country).toBe(preQueryAddress.country);
        expect(address.zipCode).toBe(preQueryAddress.zipCode);
        expect(new ObjectId(address.user)).toEqual(new ObjectId(preQueryAddress.user));

        const addressesCollection = global.getMongoCollection("addresses");
        const addressesInDb = await addressesCollection.find({user: new ObjectId(preQueryAddress.user)}).toArray();

        expect(addressesInDb.length).toBe(1);
        expect(new ObjectId(addressesInDb[0]._id)).toEqual(new ObjectId(address._id));
    });
});