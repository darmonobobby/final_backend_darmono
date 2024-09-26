const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

beforeEach(async () => {
    await request(app)
      .post('/api/v1/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'duplicate@mail.com',
        password: 'rahasia',
        name: 'Duplicate User',
        username: 'duplicateuser',
        phoneNumber: '08111113',
      });
  });

afterAll(() => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      sequelize.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("EndPoint /api/v1/register", () => {
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

  //Test Multiple Error
  //Empty Body
  it('Should return an error when no body is sent', async () => {
    const response = await request(app)
      .post('/api/v1/register')
      .set('Content-Type', 'application/json')
      .send({});

    expect(response.statusCode).toEqual(expect.any(Number));
    expect(response.statusCode).toBeGreaterThanOrEqual(400); 
    expect(response.statusCode).toBeLessThan(600); 
    expect(response.body.message).toEqual(expect.any(String)); 
    expect(response.body.error).toEqual(expect.any(String)); 
  });

  // Missing Fields
  it('Should return an error when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/v1/register')
      .set('Content-Type', 'application/json')
      .send({
        password: 'rahasia', 
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
      expect(response.body.error).toEqual(expect.any(String)); 
  });


  // Test for duplicate email
  it('Should return an error for duplicate email', async () => {
    const response = await request(app)
      .post('/api/v1/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'duplicate@mail.com',
        password: 'rahasia',
        name: 'Another User',
        username: 'anotheruser',
        phoneNumber: '08111114',
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
      expect(response.body.error).toEqual(expect.any(String)); 
  });

   // Test for duplicate username
   it('Should return an error for duplicate username', async () => {
    const response = await request(app)
      .post('/api/v1/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'another@mail.com',
        password: 'rahasia',
        name: 'Another User',
        username: 'duplicateuser',
        phoneNumber: '08111114',
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
      expect(response.body.error).toEqual(expect.any(String)); 
  });

   // Test for duplicate phoneNumber
   it('Should return an error for duplicate phoneNumber', async () => {
    const response = await request(app)
      .post('/api/v1/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'another@mail.com',
        password: 'rahasia',
        name: 'Another User',
        username: 'anotheruser',
        phoneNumber: '08111113',
      });

      expect(response.statusCode).toEqual(expect.any(Number));
      expect(response.statusCode).toBeGreaterThanOrEqual(400); 
      expect(response.statusCode).toBeLessThan(600); 
      expect(response.body.message).toEqual(expect.any(String)); 
      expect(response.body.error).toEqual(expect.any(String)); 
  });
});
