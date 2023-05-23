describe('GET /api/wishlist test', () => {
    const { ObjectId } = require('mongodb');
    const axios = require('axios');
    const getAuthToken = require('./auth');
    let mongoDocuments, authToken;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb('fetchUserWishlist.test.js');
        try {
            authToken = await getAuthToken('http://localhost:3000', mongoDocuments['users'][0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('Fetch wishlist for user', async () => {
        const headers = { 'host': 'localhost:3000', 'accept': 'application/json, text/plain, */*' };
        const response = await axios.get('http://localhost:3000/api/wishlist', { headers: Object.assign(headers, authToken) });

        expect(response.status).toBe(200);
        expect(response.data.wishlist).toEqual([]);
    });
});
