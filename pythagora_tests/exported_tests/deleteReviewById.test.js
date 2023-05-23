const axios = require('axios');
const { ObjectId } = require('mongodb');
const getAuthToken = require('./auth');

describe('DELETE /api/review/delete/:id', () => {
    const testId = 'deleteReviewById.test.js';
    const url = 'http://localhost:3000/api/review/delete/642568953ffaba2cd6f198af';
    let mongoDocuments;
    let authToken;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken('http://localhost:3000', mongoDocuments['reviews'][0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('should delete review with given id', async () => {
        const headers = {
            'accept': 'application/json, text/plain, */*',
        };
        const response = await axios.delete(url, { headers: Object.assign(headers, authToken) });
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.message).toBe('review has been deleted successfully!');
        expect(response.data.review.deletedCount).toBe(1);

        const dbReview = mongoDocuments['reviews'][0];
        const reviewInDb = await global.getMongoCollection('reviews').findOne({ _id: new ObjectId(dbReview._id) });
        expect(reviewInDb).toBeNull();
    });
});