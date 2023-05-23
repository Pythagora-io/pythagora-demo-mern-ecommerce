describe("POST /api/address/add", () => {
    const axios = require('axios');
    const { ObjectId } = require("mongodb");
    const getAuthToken = require('./auth');

    let mongoDocuments;
    let authToken;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb("addAddressEndpoint.test.js");
        try {
            authToken = await getAuthToken('http://localhost:3000', mongoDocuments['users'][0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("Should add a new address and return it", async () => {
        const endpoint = "/api/address/add";
        const headers = {
            "content-type": "application/json"
        };
        const reqBody = {
            "isDefault": true,
            "address": "asasd",
            "city": "asdasd",
            "state": "asdasd",
            "country": "asdasd",
            "zipCode": "12312"
        };

        const expectedStatusCode = 200;
        const expectedResult = {
            "success": true,
            "message": "Address has been added successfully!",
            "address": {
                "isDefault": true,
                "address": "asasd",
                "city": "asdasd",
                "state": "asdasd",
                "country": "asdasd",
                "zipCode": "12312",
                "user": new ObjectId("64256d9c4087833144d71c16"),
                "created": expect.any(String)
            }
        };

        const response = await axios.post('http://localhost:3000' + endpoint, reqBody, {headers: Object.assign(headers, authToken)});
        expect(response.status).toBe(expectedStatusCode);
        expect(response.data.message).toMatch(expectedResult.message);
        expect(response.data.address.address).toMatch(expectedResult.address.address);
        expect(response.data.address.city).toMatch(expectedResult.address.city);
        expect(response.data.address.state).toMatch(expectedResult.address.state);
        expect(response.data.address.country).toMatch(expectedResult.address.country);
        expect(response.data.address.zipCode).toMatch(expectedResult.address.zipCode);
        expect(new ObjectId(response.data.address._id)).toBeDefined();
    });
});
