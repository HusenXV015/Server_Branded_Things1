const request = require('supertest');
const app = require('../app');
const { signToken } = require('../helpers/jwt');
const { hash } = require('../helpers/bcrypt');
const { sequelize } = require('../models');

let access_token;

beforeAll(async () => {
    const users = require('../data/Users.json');
    users.forEach(el => {
        el.password = hash(el.password);
        el.updatedAt = el.createdAt = new Date();
    });

    const categories = require('../data/Categorys.json');
    categories.forEach(el => {
        el.updatedAt = el.createdAt = new Date();
    });

   const products = require(`../data/Products.json`)
   products.forEach(el =>{
    el.updatedAt = el.createdAt = new Date()
   })

    await sequelize.queryInterface.bulkInsert('Users', users, {});
    await sequelize.queryInterface.bulkInsert('Categories', categories, {});
    await sequelize.queryInterface.bulkInsert(`Products`,products,{})

    const payload = {
        id: 1,
        email: 'admin@example.com',
        role: 'admin'
    };
    access_token = signToken(payload);
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, { truncate: true, cascade: true, restartIdentity: true });
    await sequelize.queryInterface.bulkDelete('Categories', null, { truncate: true, cascade: true, restartIdentity: true });
    await sequelize.queryInterface.bulkDelete('Products', null, { truncate: true, cascade: true, restartIdentity: true });
});

describe('Product and Category Controller Tests', () => {

    describe('Category Controller', () => {
        describe('GET /categorys', () => {
            it('should return all categories', async () => {
                const response = await request(app).get('/categorys');
                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('categorys', expect.any(Array));
            });

            it('should return 404 for a non-existing category', async () => {
                const response = await request(app).get('/categorys/999');
                expect(response.status).toBe(404);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Category not found');
            });
        });

        describe('POST /categorys', () => {
            it('should create a new category', async () => {
                const response = await request(app)
                    .post('/categorys')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({ name: 'New Category' });

                expect(response.status).toBe(201);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Success create Category');
            });

            it('should fail to create category without name', async () => {
                const response = await request(app)
                    .post('/categorys')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({ name: '' });

                expect(response.status).toBe(400);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Validation error');
            });
        });

        describe('DELETE /categorys/:id', () => {
            it('should delete an existing category', async () => {
                const response = await request(app)
                    .delete('/categorys/1')
                    .set('Authorization', `Bearer ${access_token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Success delete Category');
            });

            it('should return 404 for deleting non-existing category', async () => {
                const response = await request(app)
                    .delete('/categorys/999')
                    .set('Authorization', `Bearer ${access_token}`);

                expect(response.status).toBe(404);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Category not found');
            });
        });
    });

    describe('Product Controller', () => {
        describe('GET /products', () => {
            it('should return all products', async () => {
                const response = await request(app).get('/products');
                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('products', expect.any(Array));
            });

            it('should return 404 for a non-existing product', async () => {
                const response = await request(app).get('/products/999');
                expect(response.status).toBe(404);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Product not found');
            });
        });

        describe('POST /products', () => {
            it('should create a new product', async () => {
                const response = await request(app)
                    .post('/products')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({
                        name: 'New Product',
                        price: 10000,
                        stok: 10,
                        CategoryId: 1,
                        imgUrl:`www.ovagames.com`
                    });

                expect(response.status).toBe(201);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Success create Product');
            });

            it('should fail to create product with invalid data', async () => {
                const response = await request(app)
                    .post('/products')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({
                        name: '',
                        price: -1,
                        stok: -5,
                        CategoryId: '',
                        imgUrl:`www.ovagames.com`
                    });

                expect(response.status).toBe(400);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Validation error');
            });
        });

        describe('PUT /products/:id', () => {
            it('should update an existing product', async () => {
                const response = await request(app)
                    .put('/products/1')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({
                        name: 'Updated Product',
                        price: 15000,
                        stok: 15,
                        CategoryId: 1,
                        imgUrl:`www.ovagames.com`
                    });

                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Success update Product');
            });

            it('should return 404 for updating non-existing product', async () => {
                const response = await request(app)
                    .put('/products/999')
                    .set('Authorization', `Bearer ${access_token}`)
                    .send({
                        name: 'Updated Product',
                        price: 15000,
                        stok: 15,
                        CategoryId: 1,
                        imgUrl:`www.ovagames.com`
                    });

                expect(response.status).toBe(404);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Product not found');
            });
        });

        describe('DELETE /products/:id', () => {
            it('should delete an existing product', async () => {
                const response = await request(app)
                    .delete('/products/1')
                    .set('Authorization', `Bearer ${access_token}`);

                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Success delete Product');
            });

            it('should return 404 for deleting non-existing product', async () => {
                const response = await request(app)
                    .delete('/products/999')
                    .set('Authorization', `Bearer ${access_token}`);

                expect(response.status).toBe(404);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Product not found');
            });
        });
    });
    
    describe('Public Site', () => {
        describe('GET /products', () => {
            it('should return all products with public data format', async () => {
                const response = await request(app).get('/products');
    
                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('products', expect.any(Array));
                response.body.products.forEach(product => {
                    expect(product).toHaveProperty('id', expect.any(Number));
                    expect(product).toHaveProperty('name', expect.any(String));
                    expect(product).toHaveProperty('price', expect.any(Number));
                    expect(product).toHaveProperty('stok', expect.any(Number));
                    expect(product).toHaveProperty('CategoryId', expect.any(Number));
                    expect(product).toHaveProperty('createdAt', expect.any(String));
                    expect(product).toHaveProperty('updatedAt', expect.any(String));
                });
            });
    
            it('should return specific product by id', async () => {
                const response = await request(app).get('/products/1');
    
                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('product');
                const product = response.body.product;
                expect(product).toHaveProperty('id', expect.any(Number));
                expect(product).toHaveProperty('name', expect.any(String));
                expect(product).toHaveProperty('price', expect.any(Number));
                expect(product).toHaveProperty('stok', expect.any(Number));
                expect(product).toHaveProperty('CategoryId', expect.any(Number));
                expect(product).toHaveProperty('createdAt', expect.any(String));
                expect(product).toHaveProperty('updatedAt', expect.any(String));
            });
    
            it('should return 404 for a non-existing product', async () => {
                const response = await request(app).get('/products/999');
    
                expect(response.status).toBe(404);
                expect(response.body).toBeInstanceOf(Object);
                expect(response.body).toHaveProperty('message', 'Product not found');
            });
        });
    });
});
