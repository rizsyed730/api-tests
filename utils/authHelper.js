const request = require('supertest');
const API = 'https://apiforshopsinventorymanagementsystem-qnkc.onrender.com';

async function login(username, password) {
  const res = await request(API).post('/auth/login').send({ username, password });
  if (res.statusCode !== 200) throw new Error('Login failed');
  return res.body.token;
}

module.exports = { login };
