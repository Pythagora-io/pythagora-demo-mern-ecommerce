describe("Brand list API", () => {
  const axios = require("axios");
  const { ObjectId } = require("mongodb");
  const getAuthToken = require('./auth');
  let authToken;
  let mongoDocuments;

  beforeAll(async () => {
    mongoDocuments = await global.setUpDb("brandListApi.test.js");
    try {
      authToken = await getAuthToken('http://localhost:3000', undefined);
    } catch (err) {}
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test("Retrieve list of brands", async () => {
    const endpoint = "/api/brand/list";
    const headers = {
      "host": "localhost:3000",
      "accept": "application/json, text/plain, */*",
    };

    const response = await axios.get('http://localhost:3000' + endpoint, { headers: Object.assign(headers, authToken) });

    expect(response.status).toBe(200);
    expect(response.data.brands.length).toBe(2);

    response.data.brands.forEach((brand, i) => {
      const expectedBrand = mongoDocuments.brands.find(b => b._id.toString() === brand._id);
      expect(brand.name).toBe(expectedBrand.name);
      expect(brand.description).toBe(expectedBrand.description);
      expect(brand.isActive).toBe(expectedBrand.isActive);
      expect(brand.slug).toBe(expectedBrand.slug);
      expect(brand.__v).toBe(expectedBrand.__v);
    });
  });
});
