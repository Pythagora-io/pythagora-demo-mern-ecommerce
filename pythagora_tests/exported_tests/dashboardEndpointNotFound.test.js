const axios = require("axios");
const {ObjectId} = require("mongodb");
const getAuthToken = require("./auth");

describe("Test ID: dashboardEndpointNotFound.test.js", () => {
    let mongoDocuments;
    let authToken;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb("dashboardEndpointNotFound");
        try {
            authToken = await getAuthToken("http://localhost:3000", undefined);
        } catch (err) { }
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("GET /dashboard should return status code 404", async () => {
        const url = "http://localhost:3000/dashboard";
        let headers = {
            "host": "localhost:3000",
            "connection": "keep-alive",
        };

        try {
            await axios.get(url, { headers: Object.assign(headers, authToken) });
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });
});
