describe('Product list by brand integration tests', () => {
    const axios = require("axios");
    const { ObjectId } = require("mongodb");
    let mongoDocuments;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb("productListByBrandIntegration.test.js");
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test('GET /api/product/list/brand/bbb-COXtTL-nCh returns correct products', async () => {
        const endpoint = "http://localhost:3000/api/product/list/brand/bbb-COXtTL-nCh";
        const headers = {
            "accept": "application/json, text/plain, */*",
        };

        const response = await axios.get(endpoint, {headers});
        expect(response.status).toBe(200);
        expect(response.data.products).toEqual([]);
        expect(response.data.page).toBe(1);
        expect(response.data.pages).toBe(0);
        expect(response.data.totalProducts).toBe(0);

        const brand = await global.getMongoCollection("brands").findOne({slug: 'bbb-COXtTL-nCh', isActive: true});
        const foundBrand = mongoDocuments["brands"][0];
        expect(brand._id).toEqual(new ObjectId(foundBrand._id));
        expect(brand.name).toEqual(foundBrand.name);
        expect(brand.slug).toEqual(foundBrand.slug);
        expect(brand.description).toEqual(foundBrand.description);

        const products = await global.getMongoCollection("products")
            .find({ brand: new ObjectId(foundBrand._id), isActive: true })
            .toArray();
        expect(products.length).toEqual(0);
    });
});