describe('GET /api/address', () => {
  const axios = require('axios');
  const { ObjectId } = require('mongodb');
  const getAuthToken = require('./auth');

  let mongoDocuments;
  let authToken;

  beforeAll(async () => {
    mongoDocuments = await global.setUpDb('getUserAddresses.test.js');
    try {
      authToken = await getAuthToken('http://localhost:3000', mongoDocuments['users'][0]);
    } catch (err) {}
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test('Get user addresses', async () => {
    const endpoint = '/api/address';
    const headers = {
      'accept': 'application/json, text/plain, */*',
      ...(authToken && authToken)
    };
    const response = await axios.get('http://localhost:3000' + endpoint, { headers });

    expect(response.status).toBe(200);
    expect(response.data.addresses.length).toBe(1);

    const address = response.data.addresses[0];
    const expectedAddress = mongoDocuments['addresses'][0];

    expect(ObjectId(address._id).toString()).toBe(ObjectId(expectedAddress._id).toString());
    expect(address.isDefault).toBe(expectedAddress.isDefault);
    expect(address.user).toBe(ObjectId(expectedAddress.user).toString());
    expect(address.address).toBe(expectedAddress.address);
    expect(address.city).toBe(expectedAddress.city);
    expect(address.state).toBe(expectedAddress.state);
    expect(address.country).toBe(expectedAddress.country);
    expect(address.zipCode).toBe(expectedAddress.zipCode);
  });
});