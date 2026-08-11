import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'

import app from '../src/app.js'
import { connectDb } from '../src/config/db.js'
import User from '../src/models/User.js'

let mongoServer

before(async () => {
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = 'auth-profile-management-test-secret'

  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()

  await connectDb()
})

beforeEach(async () => {
  await User.deleteMany({})
})

after(async () => {
  await mongoose.connection.close()
  if (mongoServer) {
    await mongoServer.stop()
  }
})

test('User Authentication & Profile Management API Flow', async () => {
  // 1. Validation error on registration
  const invalidRegister = await request(app).post('/api/auth/register').send({
    name: 'A',
    email: 'invalid-email',
    password: '123',
  })
  assert.equal(invalidRegister.statusCode, 400)
  assert.equal(invalidRegister.body.success, false)

  // 2. Successful Registration
  const registerRes = await request(app).post('/api/auth/register').send({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Software Developer',
  })
  assert.equal(registerRes.statusCode, 201)
  assert.equal(registerRes.body.success, true)
  assert.ok(registerRes.body.token)
  assert.equal(registerRes.body.user.email, 'jane@example.com')
  assert.equal(registerRes.body.user.name, 'Jane Doe')
  assert.equal(registerRes.body.user.bio, 'Software Developer')

  const token = registerRes.body.token

  // 3. Duplicate Email Registration Prevention
  const duplicateRegister = await request(app).post('/api/auth/register').send({
    name: 'Jane Clone',
    email: 'jane@example.com',
    password: 'password123',
  })
  assert.equal(duplicateRegister.statusCode, 409)
  assert.equal(duplicateRegister.body.success, false)

  // 4. Successful Login
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'jane@example.com',
    password: 'password123',
  })
  assert.equal(loginRes.statusCode, 200)
  assert.equal(loginRes.body.success, true)
  assert.ok(loginRes.body.token)

  // 5. Invalid Credentials Login
  const invalidLogin = await request(app).post('/api/auth/login').send({
    email: 'jane@example.com',
    password: 'wrongpassword',
  })
  assert.equal(invalidLogin.statusCode, 401)

  // 6. Logout API
  const logoutRes = await request(app).post('/api/auth/logout')
  assert.equal(logoutRes.statusCode, 200)
  assert.equal(logoutRes.body.success, true)

  // 7. Get Profile (Protected)
  const unauthProfile = await request(app).get('/api/users/profile')
  assert.equal(unauthProfile.statusCode, 401)

  const profileRes = await request(app)
    .get('/api/users/profile')
    .set('Authorization', `Bearer ${token}`)

  assert.equal(profileRes.statusCode, 200)
  assert.equal(profileRes.body.success, true)
  assert.equal(profileRes.body.user.name, 'Jane Doe')
  assert.equal(profileRes.body.user.email, 'jane@example.com')

  // 8. Update Profile
  const updateRes = await request(app)
    .put('/api/users/profile')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Jane Smith',
      bio: 'Senior Full Stack Engineer',
    })

  assert.equal(updateRes.statusCode, 200)
  assert.equal(updateRes.body.success, true)
  assert.equal(updateRes.body.user.name, 'Jane Smith')
  assert.equal(updateRes.body.user.bio, 'Senior Full Stack Engineer')

  // Verify updated profile persists
  const reGetProfile = await request(app)
    .get('/api/users/profile')
    .set('Authorization', `Bearer ${token}`)

  assert.equal(reGetProfile.body.user.name, 'Jane Smith')

  // 9. Change Password (Fail with wrong current password)
  const badPasswordChange = await request(app)
    .put('/api/users/change-password')
    .set('Authorization', `Bearer ${token}`)
    .send({
      currentPassword: 'wrongpassword',
      newPassword: 'newpassword123',
    })
  assert.equal(badPasswordChange.statusCode, 400)

  // 10. Change Password (Success)
  const passChangeRes = await request(app)
    .put('/api/users/change-password')
    .set('Authorization', `Bearer ${token}`)
    .send({
      currentPassword: 'password123',
      newPassword: 'newpassword123',
    })
  assert.equal(passChangeRes.statusCode, 200)
  assert.equal(passChangeRes.body.success, true)

  // 11. Login with Old Password Fails
  const oldPassLogin = await request(app).post('/api/auth/login').send({
    email: 'jane@example.com',
    password: 'password123',
  })
  assert.equal(oldPassLogin.statusCode, 401)

  // 12. Login with New Password Succeeds
  const newPassLogin = await request(app).post('/api/auth/login').send({
    email: 'jane@example.com',
    password: 'newpassword123',
  })
  assert.equal(newPassLogin.statusCode, 200)
  assert.equal(newPassLogin.body.success, true)
})