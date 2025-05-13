const request = require('supertest');
const api = require('../utils/config');

let token = '';
let productId = '';

beforeAll(async () => {
  const res = await request(api)
    .post('/auth/login')
    .send({ username: 'user01', password: 'secpassword*' });
  token = res.body.token;
});

afterAll(async () => {
  if (productId) {
    await request(api)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
  }
});

describe('Products API', () => {
  it('should create a product with valid data', async () => {
    const res = await request(api)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'TestProduct', price: 10, productType: 'games', quantity: 5 });
    expect(res.statusCode).toBe(201);
    productId = res.body.productId;
  });

  it('should fail to create product without auth', async () => {
    const res = await request(api)
      .post('/products')
      .send({ name: 'NoAuthProduct', price: 10, productType: 'games', quantity: 5 });
    expect(res.statusCode).toBe(401);
  });

  it('should get list of all products', async () => {
    const res = await request(api).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a product by ID', async () => {
    const res = await request(api).get(`/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('productId');
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(api).get('/products/nonexistentid');
    expect(res.statusCode).toBe(404);
  });

  it('should update an existing product', async () => {
    const res = await request(api)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'UpdatedProduct', price: 12, productType: 'games', quantity: 6 });
    expect(res.statusCode).toBe(200);
  });

  it('should return 401 when updating without auth', async () => {
    const res = await request(api)
      .put(`/products/${productId}`)
      .send({ name: 'FailProduct', price: 10, productType: 'games', quantity: 1 });
    expect(res.statusCode).toBe(401);
  });

  it('should delete a product', async () => {
    const res = await request(api)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 when deleting a non-existent product', async () => {
    const res = await request(api)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
