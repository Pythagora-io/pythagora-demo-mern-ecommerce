describe("POST /api/auth/forgot", () => {
    const axios = require("axios");
    const { ObjectId } = require("mongodb");

    let mongoDocuments;

    beforeAll(async () => {
        mongoDocuments = await global.setUpDb("forgotPassword.test.js");
    });

    afterAll(async () => {
        await global.cleanUpDb();
    });

    test("Check if forgot password is successful", async () => {
        const response = await axios.post("http://localhost:3000/api/auth/forgot", {
            email: "zvonimir@pythagora.io"
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.message).toBe("Please check your email for the link to reset your password.");

        const preQueryUser = mongoDocuments.users[0];
        const postQueryUser = await global.getMongoCollection("users").findOne({});

        expect(postQueryUser._id.toString()).toBe(preQueryUser._id.toString());
        expect(postQueryUser.merchant).toEqual(preQueryUser.merchant);
        expect(postQueryUser.provider).toEqual(preQueryUser.provider);
        expect(postQueryUser.role).toEqual(preQueryUser.role);
        expect(postQueryUser.email).toEqual(preQueryUser.email);
        expect(postQueryUser.password).toEqual(preQueryUser.password);
        expect(postQueryUser.firstName).toEqual(preQueryUser.firstName);
        expect(postQueryUser.lastName).toEqual(preQueryUser.lastName);
    });
});
