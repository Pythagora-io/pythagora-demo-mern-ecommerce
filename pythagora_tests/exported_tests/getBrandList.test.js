describe('GET /api/brand/list', () => {
    const axios = require('axios');
    const { ObjectId } = require('mongodb');
    const getAuthToken = require('./auth');
    let mongoDocuments;
    let authToken;
    const testId = 'getBrandList.test.js';
    const APP_URL = 'http://localhost:3000';
    const headers = {
        accept: 'application/json, text/plain, */*'
    };

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken(APP_URL, undefined);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('Get list of brands', async () => {
        const response = await axios.get(`${APP_URL}/api/brand/list`, { headers: Object.assign(headers, authToken) });

        expect(response.status).toBe(200);
        expect(response.data.brands.length).toBe(3);

        expect(response.data.brands[0].name).toBe(mongoDocuments.brands[0].name);
        expect(response.data.brands[0].slug).toBe(mongoDocuments.brands[0].slug);

        expect(response.data.brands[1].name).toBe(mongoDocuments.brands[1].name);
        expect(response.data.brands[1].slug).toBe(mongoDocuments.brands[1].slug);

        expect(response.data.brands[2].name).toBe(mongoDocuments.brands[2].name);
        expect(response.data.brands[2].slug).toBe(mongoDocuments.brands[2].slug);
    });
});
