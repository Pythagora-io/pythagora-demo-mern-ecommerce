describe('DELETE /api/address/delete/:addressId', () => {
  const { ObjectId } = require('mongodb');
  const axios = require('axios');
  const getAuthToken = require('./auth');
  let authToken;
  let mongoDocuments;

  beforeAll(async () => {
    const testId = 'deleteAddressById.test.js';
    mongoDocuments = await global.setUpDb(testId);
    try {
      authToken = await getAuthToken('http://localhost:3000', mongoDocuments['addresses'][0]);
    } catch (err) {}
  });

  afterAll(async () => {
    await global.cleanUpDb();
  });

  test('Deletes an address from the database and returns the appropriate success message and status code', async () => {
    const endpoint = '/api/address/delete/64256deb4087833144d71c25';
    const headers = {
      'accept': 'application/json, text/plain, */*',
    };

    const response = await axios.delete(`http://localhost:3000${endpoint}`, {headers:Object.assign(headers, authToken)});
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.message).toBe('Address has been deleted successfully!');
    expect(response.data.address.deletedCount).toBe(1);

    const deletedAddress = mongoDocuments.addresses.find(doc => doc._id.toString() === '64256deb4087833144d71c25');
    const mongoCollection = global.getMongoCollection('addresses');
    const addressInDb = await mongoCollection.findOne({ _id: ObjectId(deletedAddress._id) });
    expect(addressInDb).toBeNull();
  });
});
