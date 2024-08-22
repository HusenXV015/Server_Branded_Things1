const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { signToken } = require('../helpers/jwt');

let access_token;

beforeAll(async () => {
    const users = require('../data/Users.json');
    users.forEach(el => {
        el.updatedAt = el.createdAt = new Date();
    });
    await sequelize.queryInterface.bulkInsert('Users', users, {});

    const payload = {
        id: 1,
        email: 'admin@mail.com',
        role: 'Admin'
    };
    access_token = signToken(payload);
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, { truncate: true, cascade: true, restartIdentity: true });
});

describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {
        const body = { 
            username: "TestUser", 
            email: 'testuser@mail.com', 
            password: '12345', 
            role: "Staff", 
            phoneNumber: "081234567890", 
            address: "Test Address" 
        };
        const response = await request(app)
            .post('/users/register')
            .send(body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('massage', 'success create new user');
        expect(response.body).toHaveProperty('user', expect.any(Object));
    });

    it('should fail to register user due to missing email', async () => {
        const body = { 
            username: "TestUser", 
            email: '', 
            password: '12345', 
            role: "Staff", 
            phoneNumber: "081234567890", 
            address: "Test Address" 
        };
        const response = await request(app)
            .post('/users/register')
            .send(body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', expect.any(String));
    });
});

describe('POST /users/login', () => {
    it('should login successfully and return access token', async () => {
        const body = { 
            email: 'admin@mail.com', 
            password: '12345' 
        };
        const response = await request(app)
            .post('/users/login')
            .send(body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('access_token', expect.any(String));
    });

    it('should fail to login due to invalid email/password', async () => {
        const body = { 
            email: '', 
            password: 'wrongpassword' 
        };
        const response = await request(app)
            .post('/users/login')
            .send(body);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', expect.any(String));
    });
});
