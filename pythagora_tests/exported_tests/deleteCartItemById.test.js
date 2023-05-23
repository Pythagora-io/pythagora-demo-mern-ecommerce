const axios = require("axios");
const { ObjectId } = require("mongodb");

describe("Test DELETE /api/cart/delete/:id", () => {
    const endpoint = "/api/cart/delete/6425737e7e5b7c3b28c5bc29";
    const method = "DELETE";
    const headers = {
        "accept": "*/*"
    };
    const testId = "deleteCartItemById.test.js";
    const url = "http://localhost:3000";
    const getAuthToken = require('./auth');
    let authToken;
    let mongoDocuments;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken(url, undefined);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("Unauthorized", async () => {
        const response = await axios.delete(
            `${url}${endpoint}`,
            { headers }
        ).catch((error) => error.response);

        expect(response.status).toBe(401);
        expect(response.data).toBe("Unauthorized");
    });
});
