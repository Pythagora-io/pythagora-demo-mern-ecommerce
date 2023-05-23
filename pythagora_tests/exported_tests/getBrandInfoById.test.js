describe('Get brand info by ID', () => {
    const { ObjectId } = require("mongodb");
    const axios = require('axios');
    const getAuthToken = require('./auth');
    let authToken;
    let mongoDocuments;

    beforeAll(async () => {
        const testId = "getBrandInfoById.test.js";
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken('http://localhost:3000', undefined);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('Retrieve brand and check details', async () => {
        const endpoint = "/api/brand/6401bc51d4142501dd514839";
        const headers = {
            "accept": "application/json, text/plain, */*",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGEzMjI3MDM3ZDE2NmZkNTFjZWYyNCIsImlhdCI6MTY4MDE3NTE2NSwiZXhwIjoxNjgwNzc5OTY1fQ.odXwwZprse2gBPEQtvzkwUln7Nxkbfyh9zojtKIxMa8"
        };
        const url = `http://localhost:3000${endpoint}`;

        const response = await axios.get(url, {headers: Object.assign(headers, authToken)});

        expect(response.status).toBe(200);
        expect(response.data.brand.name).toBe("sad");
        expect(response.data.brand.description).toBe("asdddd");
        expect(response.data.brand.isActive).toBe(false);
        expect(response.data.brand.merchant).toBe(null);
        expect(response.data.brand.slug).toBe("sad");

        const preQueryDocs = mongoDocuments.brands[0];
        const postQueryDocs = mongoDocuments.brands[0];

        expect(new ObjectId(response.data.brand._id)).toEqual(new ObjectId(preQueryDocs._id));
        expect(postQueryDocs.isActive).toBe(preQueryDocs.isActive);
        expect(postQueryDocs.merchant).toBe(preQueryDocs.merchant);
        expect(postQueryDocs.name).toBe(preQueryDocs.name);
        expect(postQueryDocs.description).toBe(preQueryDocs.description);
        expect(postQueryDocs.slug).toBe(preQueryDocs.slug);
    });
});