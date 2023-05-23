describe("GET /shop/brand/bbb-COXtTL-nCh", () => {
  const axios = require("axios");
  let statusCode, response;

  beforeAll(async () => {
    const testId = "getShopBrandInvalidId.test.js";
    await global.setUpDb(testId);
    try {
      response = await axios.get("http://localhost:3000/shop/brand/bbb-COXtTL-nCh", {
        headers: {
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9"
        }
      });
    } catch (err) {
      statusCode = err.response.status;
      response = err.response.data;
    }
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test("Status Code should be 404", async () => {
    expect(statusCode).toBe(404);
  });

  test("Should return proper error message", async () => {
    expect(response).toContain("Cannot GET /shop/brand/bbb-COXtTL-nCh");
  });
});