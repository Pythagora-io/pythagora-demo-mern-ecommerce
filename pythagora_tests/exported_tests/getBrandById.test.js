describe("GET /api/brand/:id", () => {
    const { ObjectId } = require("mongodb");
    const axios = require("axios");
    const getAuthToken = require("./auth");
    const testId = "getBrandById.test.js";
    let mongoDocuments;
    let authToken;
    
    beforeAll(async () => {
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken("http://localhost:3000", undefined);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("Get brand by id", async () => {
        const endpoint = "/api/brand/640b2018b31c7d4d5d154298";
        const headers = {
            "accept": "application/json, text/plain, */*",
        };
        let finalHeaders = authToken ? Object.assign(headers, authToken) : headers;
        const response = await axios.get(`http://localhost:3000${endpoint}`, { headers: finalHeaders });
        
        expect(response.status).toBe(200);
        expect(ObjectId(response.data.brand._id)).toEqual(ObjectId("640b2018b31c7d4d5d154298"));
        expect(response.data.brand.isActive).toBe(false);
        expect(response.data.brand.name).toBe("asdasd");
        expect(response.data.brand.description).toBe("asdasda");
    });
});