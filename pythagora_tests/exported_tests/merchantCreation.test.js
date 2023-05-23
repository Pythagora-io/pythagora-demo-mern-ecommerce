describe('Test POST /api/merchant/add', () => {
    const axios = require('axios').default;

    let mongoDocuments;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb('merchantCreation.test.js');
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('Test merchant creation', async () => {
        const reqBody = {
            name: "bnmbnm",
            email: "bnmbn@brija.com",
            phoneNumber: "1234567890",
            brandName: "nmmnbmbnm",
            business: "bnbmbmbnmnbmbnm"
        };

        const res = await axios.post('http://localhost:3000/api/merchant/add', reqBody, {
            headers: {
                'content-type': 'application/json',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGEzMjI3MDM3ZDE2NmZkNTFjZWYyNCIsImlhdCI6MTY4MDE3NTE2NSwiZXhwIjoxNjgwNzc5OTY1fQ.odXwwZprse2gBPEQtvzkwUln7Nxkbfyh9zojtKIxMa8'
            }
        });

        const merchant = res.data.merchant;
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.message).toBe('We received your request! we will reach you on your phone number 1234567890!');
        expect(merchant.name).toBe(reqBody.name);
        expect(merchant.email).toBe(reqBody.email);
        expect(merchant.phoneNumber).toBe(reqBody.phoneNumber);
        expect(merchant.brandName).toBe(reqBody.brandName);
        expect(merchant.business).toBe(reqBody.business);
        expect(merchant.isActive).toBe(false);
        expect(merchant.status).toBe('Waiting Approval');
        expect(merchant.brand).toBe(null);
    });
});
