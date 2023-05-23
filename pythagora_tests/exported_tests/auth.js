const axios = require('axios');
const cookie = require('cookie');
const { ObjectId } = require('mongodb');
const getMongoCollection = global.getMongoCollection;

async function getAuthToken(appUrl, userDoc) {
    let response;
    try {
        const User = getMongoCollection("users");
        const defaultUserObj = {
          "_id": new ObjectId("644fabc4bca2ee35d6301079"),
          "merchant": null,
          "provider": "Email",
          "role": "ROLE ADMIN",
          "email": "hi@pythagora.com",
          "password": "$2a$10$GmoG4nTqBhvECiuERws6Ieer3IKmG4jovY4vPD32R3IbdlziK6s8.",
          "firstName": "pythagora",
          "lastName": "pythagora",
          "created": new Date("2023-05-01T12:08:36.302Z"),
          "__v": 0,
          "phoneNumber": "008"
        };
        
        if (userDoc) userDoc.password = defaultUserObj.password;
        if (!userDoc) userDoc = defaultUserObj;

        const existingUser = await User.findOne({ email: userDoc.email });
        if (!existingUser) {
            await User.insertOne(userDoc);
        } else {
            await User.updateOne({email: userDoc.email}, {$set: {password: userDoc.password}});
        }

        response = await axios.post(appUrl + '/api/auth/login', {
            email: userDoc.email,
            password: "Brija123!"
        })
        .catch(error => {
            return {Authorization: 'Bearer invalid-token'};
        });

        const token = response.data.token || response.headers['authorization'];

        return token ? {'Authorization': 'Bearer ' + token.replace('Bearer ', ''), 'x-auth-token': token} : {'Cookie': 'token=' + cookie.parse(response.headers['set-cookie'][0]).token }
    } catch (err) {
        return {};
    }
}

module.exports = getAuthToken;