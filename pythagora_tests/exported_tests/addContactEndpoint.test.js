const axios = require('axios');
const { ObjectId } = require('mongodb');
const getAuthToken = require('./auth');

describe('POST /api/contact/add', () => {
    const endpoint = "/api/contact/add";
    const method = "POST";
    const headers = {
        "Content-Type": "application/json"
    };
    const reqBody = {
        name: "cvbcvb",
        email: "cvb@xcv.com",
        message: "wefdbsefbsfgbsfgb"
    };
    const statusCode = 200;
    const expectedResponse = {
        success: true,
        message: "We received your message, we will reach you on your email address cvb@xcv.com!",
        contact: {
            _id: null,
            name: "cvbcvb",
            email: "cvb@xcv.com",
            message: "wefdbsefbsfgbsfgb"
        }
    };
    let authToken;
    let mongoDocuments;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb("addContactEndpoint.test.js");
        try {
            authToken = await getAuthToken("http://localhost:3000");
        } catch (err) {}
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("Add contact with valid data", async () => {
        const response = await axios.post(`http://localhost:3000${endpoint}`, reqBody, { headers: Object.assign(headers, authToken) });

        expect(response.status).toBe(statusCode);
        expect(response.data.success).toBe(expectedResponse.success);
        expect(response.data.message).toBe(expectedResponse.message);
        expect(response.data.contact.name).toBe(expectedResponse.contact.name);
        expect(response.data.contact.email).toBe(expectedResponse.contact.email);
        expect(response.data.contact.message).toBe(expectedResponse.contact.message);

        const contactList = await global.getMongoCollection("contacts")
            .find({ email: "cvb@xcv.com" })
            .toArray();
        expect(contactList.length).toBe(1);
        expect(contactList[0].name).toBe(expectedResponse.contact.name);
        expect(contactList[0].email).toBe(expectedResponse.contact.email);
        expect(contactList[0].message).toBe(expectedResponse.contact.message);
    });
});