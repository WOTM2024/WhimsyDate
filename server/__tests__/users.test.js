const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");
const Users = require('../models/users-model');

beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION);
});

afterAll(async () => {
    await Users.deleteMany({});
    await mongoose.connection.close();
});

describe("GET: /users", () => {
    test("200: responds with an array of all users", () => {
        return request(app)
            .get("/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.success).toBe(true);
                expect(body.data).toBeInstanceOf(Array);
                body.data.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                    });
                });
            });
    });

    test("404: ERROR - responds with an error when endpoint does not exist", () => {
        return request(app)
            .get("/notAnEndpoint")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid endpoint, please try again");
            });
    });
});

describe("POST: /users/add", () => {
    test("201: Adds a user and responds with the new user", () => {
        const newUser = { username: "testUser" };
        return request(app)
            .post("/users/add")
            .send(newUser)
            .expect(201)
            .then(({ body }) => {
                expect(body.success).toBe(true);
                expect(body.data).toMatchObject({
                    username: "testUser",
                });
            });
    });

    test("409: ERROR - responds with an error when required fields are missing", () => {
        const missingInfo = {};
        return request(app)
            .post("/users/add")
            .send(missingInfo)
            .expect(409)
            .then(({ body }) => {
                expect(body.success).toBe(false);
                expect(body.error).toBeDefined();
            });
    });
});

describe("DELETE: /users/delete", () => {
    beforeEach(async () => {
        await Users.create({ username: "deleteMe" });
    });

    test("200: Deletes a user and responds with a success message", () => {
        const userToDelete = { username: "DeleteMePlz" };
        return request(app)
            .delete("/users/delete")
            .send(userToDelete)
            .expect(200)
            .then(({ body }) => {
                expect(body.success).toBe(true);
                expect(body.message).toBe(`${userToDelete.username} has been deleted from our records`);
            })
            .then(() => {
                return Users.find({ username: "DeleteMePlz" });
            })
            .then((users) => {
                expect(users.length).toBe(0);
            });
    });

    test("409: ERROR - responds with an error when trying to delete a non-existent user", () => {
        const missingUser = { username: "ImNotHere" };
        return request(app)
            .delete("/users/delete")
            .send(missingUser)
            .expect(409)
            .then(({ body }) => {
                expect(body.success).toBe(false);
                expect(body.error).toBeDefined();
            });
    });
});