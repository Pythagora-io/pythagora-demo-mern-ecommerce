describe("Testing GET /api/order/me", () => {
    const { ObjectId } = require("mongodb");
    const axios = require("axios");
    const getAuthToken = require("./auth");
    let mongoDocuments;
    let authToken;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb("getOrderApi.test.js");
        try {
            authToken = await getAuthToken("http://localhost:3000", mongoDocuments.users[0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("Should return orders and related data", async () => {
        const url = "http://localhost:3000/api/order/me";
        const headers = {
            "accept": "application/json, text/plain, */*"
        };

        const response = await axios.get(url, {
            headers: Object.assign(headers, authToken),
            params: {
                "page": "1",
                "limit": "20"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.orders).toEqual([]);
        expect(response.data.totalPages).toBe(0);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.count).toBe(0);
    });
});