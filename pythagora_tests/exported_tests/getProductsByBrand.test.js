describe('/api/product/list/brand/bbb', () => {
  const axios = require('axios');
  const { ObjectId } = require('mongodb');
  let mongoDocuments;

  beforeAll(async () => {
    mongoDocuments = await global.setUpDb("getProductsByBrand.test.js");
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test('GET request returns products of the given brand', async () => {
    const response = await axios.get('http://localhost:3000/api/product/list/brand/bbb');
    expect(response.status).toBe(200);

    expect(response.data.products.length).toBe(1);

    const product = response.data.products[0];

    expect(product.taxable).toBe(false);
    expect(product.isActive).toBe(true);

    const brandFromResponse = product.brand;
    const mongoBrandDocs = mongoDocuments['brands'];
    const expectedBrand = mongoBrandDocs.find(doc => doc._id.toString() === '6401da466b0ef823b47beb3a');

    expect(brandFromResponse._id).toEqual(expectedBrand._id.toString());
    expect(brandFromResponse.name).toBe(expectedBrand.name);

    expect(product.sku).toBe('asdasda');
    expect(product.name).toBe('asdasdasd');
    expect(product.description).toBe('asdasd');
    expect(product.quantity).toBe(132);
    expect(product.price).toBe(12);
    expect(product.imageUrl).toBe('https://igmern.s3.amazonaws.com/photo-1481349518771-20055b2a7b24.jpeg');
    expect(product.imageKey).toBe('photo-1481349518771-20055b2a7b24.jpeg');
    expect(product.slug).toBe('asdasd');

    const preMongoDocs = mongoDocuments['products'];
    const mongoDocIndex = preMongoDocs.findIndex(
      doc => doc._id.toString() === product._id
    );

    expect(mongoDocIndex).not.toBe(-1);

    const oneProduct = new ObjectId('63ed3108b81ccc28a4d9eaf2');
    expect(response.data.page).toBe(1);
    expect(response.data.pages).toBe(1);
    expect(response.data.totalProducts).toBe(1);
  });
});
