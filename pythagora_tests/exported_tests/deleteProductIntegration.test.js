const axios = require("axios");
const { ObjectId } = require("mongodb");
const getAuthToken = require("./auth");

describe("Delete Product Integration Test", () => {
    let mongoDocuments, authToken;
    const productId = "63ed276765b04225d4bd3e4b";
    const testId = "deleteProductIntegration.test.js";
    const url = "http://localhost:3000/api/product/delete/" + productId;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb(testId);

        try {
            authToken = await getAuthToken(
                "http://localhost:3000",
                mongoDocuments["users"][0]
            );
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("DELETE Product", async () => {
        const headers = {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8"
        };
        const expectedResponse = {
            success: true,
            message: "Product has been deleted successfully!",
            product: {
                n: 1,
                ok: 1,
                deletedCount: 1
            }
        };

        const response = await axios.delete(url, {
            headers: Object.assign(headers, authToken)
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(expectedResponse.success);
        expect(response.data.message).toBe(expectedResponse.message);
        expect(response.data.product.n).toBe(expectedResponse.product.n);
        expect(response.data.product.ok).toBe(expectedResponse.product.ok);
        expect(response.data.product.deletedCount).toBe(expectedResponse.product.deletedCount);

        const productsCollection = global.getMongoCollection("products");
        const product = await productsCollection.findOne({_id: new ObjectId(productId)});
        expect(product).toBeNull();
    });
});
