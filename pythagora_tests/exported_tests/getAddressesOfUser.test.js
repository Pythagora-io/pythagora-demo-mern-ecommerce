describe('GET /api/address', () => {
    const axios = require('axios');
    const { ObjectId } = require('mongodb');
    const getAuthToken = require('./auth');
    let authToken;
    let mongoDocuments;

    beforeAll(async () => {
        const testId = 'getAddressesOfUser.test.js';
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken('http://localhost:3000', mongoDocuments['users'][0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('Address of user should be returned', async () => {
        const headers = {
            'accept': 'application/json, text/plain, */*'
        };

        try {
            const response = await axios.get('http://localhost:3000/api/address', {headers: Object.assign(headers, authToken)});
            if (response.status !== 200) throw new Error('Status code not correct');
    
            expect(response.data.addresses.length).toBe(1);
            expect(response.data.addresses[0].address).toBe('cvxcv');
            expect(response.data.addresses[0].city).toBe('xcvxcv');
            expect(response.data.addresses[0].state).toBe('xcvxcv');
            expect(response.data.addresses[0].country).toBe('xcvxcv');
            expect(response.data.addresses[0].zipCode).toBe('34234');
            expect(response.data.addresses[0].user).toBe(new ObjectId("64256d9c4087833144d71c16").toString());
        } catch (err) {
            throw err;
        }
    });
});