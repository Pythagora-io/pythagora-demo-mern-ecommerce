describe('GET /api/address/:id', () => {
    const axios = require('axios');
    const { ObjectId } = require('mongodb');
    const getAuthToken = require('./auth');

    let authToken;
    let mongoDocuments;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb("fetchAddressDetailsById.test.js");

        try {
            authToken = await getAuthToken('http://localhost:3000', mongoDocuments["addresses"][0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('should get address details', async () => {
        const endpoint = "/api/address/64256deb4087833144d71c25";

        const response = await axios.get(`http://localhost:3000${endpoint}`, { headers: Object.assign({ authorization: authToken }) });

        expect(response.status).toBe(200);
        expect(response.data.address.address).toBe("asasdasd");
        expect(response.data.address.city).toBe("asdasd");
        expect(response.data.address.state).toBe("asdasd");
        expect(response.data.address.country).toBe("asdasd");
        expect(response.data.address.zipCode).toBe("12312");

        const preQuery = mongoDocuments["addresses"][0];
        const postQuery = mongoDocuments["addresses"][0];

        const preAddress = new ObjectId(preQuery._id);
        const postAddress = new ObjectId(postQuery._id);

        expect(preAddress).toEqual(postAddress);

        const userId = new ObjectId(preQuery.user);
        const postUserId = new ObjectId(postQuery.user);

        expect(userId).toEqual(postUserId);
        expect(preQuery.isDefault).toBe(postQuery.isDefault);
    });
})