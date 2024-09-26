const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

afterAll(() => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      sequelize.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("EndPoint /register", () => {
  it("Should be able to register", async () => {
    const response = await request(app)
      .post("/api/v1/register")
      .set("Content-Type", "application/json")
      .send({ email: "testreg@mail.com", password: "rahasia", name: "Test Nama", username: "usertest", phoneNumber: "08111112"  });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Success creating new user");
    expect(response.body.data.id).toEqual(expect.any(Number));
    expect(response.body.data.name).toBe("Test Nama");
    expect(response.body.data.username).toBe("usertest");
    expect(response.body.data.email).toBe("testreg@mail.com");
    expect(response.body.data.role).toBe("customer");
    expect(response.body.data.phoneNumber).toBe("08111112");
    expect(response.body.data.address).toBeNull();
  });
});
