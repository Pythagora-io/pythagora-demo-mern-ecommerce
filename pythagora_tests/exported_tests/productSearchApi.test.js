const axios = require('axios');
const { ObjectId } = require('mongodb');

describe('Product search API test', () => {
    const endpoint = '/api/product/list/search/asd';
    const method = 'GET';
    const headers = { accept: 'application/json, text/plain, */*' };
    const testId = 'productSearchApi.test.js';
    let mongoDocuments;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb(testId);
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('Successfully search for products', async () => {
        const response = await axios.get(`http://localhost:3000${endpoint}`, { headers });

        expect(response.status).toBe(200);
        expect(response.data.products).toEqual([]);

        const queryData = {
            mongoResponse: [],
            mongoQuery: {
                name: {
                    $regex: new RegExp("/asd/"),
                    $options: 'is',
                },
                isActive: true,
            },
            mongoOptions: {
                projection: {
                    name: 1,
                    slug: 1,
                    imageUrl: 1,
                    price: 1,
                    _id: 0,
                },
            },
            mongoOperation: 'find',
            collection: 'products',
        };

        const expectedResult = await global
            .getMongoCollection(queryData.collection)
            .find(queryData.mongoQuery, queryData.mongoOptions)
            .toArray();

        expect(response.data.products).toEqual(expectedResult);
    });
});