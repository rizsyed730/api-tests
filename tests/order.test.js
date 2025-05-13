const request = require('supertest');
const api = require('../utils/config');

let token = '';
let productId = '';

beforeAll(async () => {
  const login = await request(api)
    .post('/auth/login')
    .send({ username: 'user01', password: 'secpassword*' });
  token = login.body.token;

  const product = await request(api)
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: ' testProduct', price: 25, productType: 'games', quantity: 100 });

    productId = product.body.productId;
});

afterAll(async () => {
  if (productId) {
    await request(api)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
  }
});

describe('Orders API', () => {
  it('should create a buy order', async () => {
    const res = await request(api)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderType: 'buy', productId, quantity: 10 });
    expect(res.statusCode).toBe(201);
  });

  it('should create a sell order', async () => {
    const res = await request(api)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderType: 'sell', productId, quantity: 5 });
    expect(res.statusCode).toBe(201);
  });

  it('should fail to sell more than stock', async () => {
    const res = await request(api)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderType: 'sell', productId, quantity: 1000 });
    expect(res.statusCode).toBe(400);
  });

  it('should fail to create a buy order without auth', async () => {
    const res = await request(api)
      .post('/orders')
      .send({ orderType: 'sell', productId, quantity: 1 });
    expect(res.statusCode).toBe(401);
  });

  it('should return current stock information', async () => {
    const res = await request(api)
      .get(`/orders/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('currentStock');
  });

  it('should fail return current stock information without auth', async () => {
    const res = await request(api)
      .get(`/orders/product/${productId}`)
    expect(res.statusCode).toBe(401);
  });
});
