describe('DELETE /api/category/delete/:id', () => {
    const axios = require('axios');
    const { ObjectId } = require('mongodb');
    const getAuthToken = require('./auth');
    let authToken, mongoDocuments;

    beforeAll(async () => {
        let testId = "deleteCategoryById.test.js";
        mongoDocuments = await global.setUpDb(testId);
        try {
            authToken = await getAuthToken('http://localhost:3000', mongoDocuments['users'][0]);
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('Delete category successfully', async () => {
        const categoryId = ObjectId("63e16c7ad3b14d19dafb2da3")
        const headers = {
            accept: 'application/json',
            authorization: authToken,
        };

        try {
            const response = await axios.delete(`http://localhost:3000/api/category/delete/${categoryId}`, { headers: Object.assign(headers, authToken) });
            const categoryCollection = global.getMongoCollection('categories');
            const foundCategory = await categoryCollection.findOne({ _id: categoryId });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.message).toBe("Category has been deleted successfully!");

            expect(foundCategory).toBeNull();
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    });
});