import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { UsersModule } from '../../src/users/users.module';
import { users } from './users-default';

describe('Users E2E', () => {

  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              SECRET_KEY: 'test-secret-key',
              EXPIRES_IN: '60m',
            }),
          ],
          isGlobal: true,
        }),
        UsersModule, 
        MongooseModule.forRoot(uri),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoServer.getUri());
    }

    await mongoose.connection.db?.collection('users').deleteMany({});
    await mongoose.connection.db.collection('users').insertMany(users);    
  
  });

  it('should create a user', async () => {

    const user = {
      email: 'jean12@gmail.com',
      username: 'jean12',
      password: '1234',
      role: 'admin',
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201);

  });

  it('should find all users', async () => {

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body.length).toBe(3);

    const allUsersWithoutPassword = response.body.every(user => !('password' in user));

    expect(allUsersWithoutPassword).toBe(true);

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'jean@gmail.com',
          username: 'jean',
          role: 'admin',
        }),
        expect.objectContaining({
          email: 'carlos@gmail.com',
          username: 'carlos',
          role: 'guest',
        }),
        expect.objectContaining({
          email: 'ricardo@gmail.com',
          username: 'ricardo',
          role: 'guest',
        }),
      ])
    );

  });

  it('should find user by id', async () => {

    const response = await request(app.getHttpServer())
      .get('/users/64b43c6d5b6e3c8f1a2d3e4f')
      .expect(200);

      expect(response).toBeDefined();
      expect(response.body.username).toEqual('jean');

  });

  it('should user not found', async () => {

    const response = await request(app.getHttpServer())
      .get('/users/64b43c6d5b6e3c8f1a2d3e4e')
      .expect(404);

    expect(response).toBeDefined();
    expect(response.body.message).toEqual('User 64b43c6d5b6e3c8f1a2d3e4e not found.');

  });

  it('should update a user', async () => {

    const _id = users[0]._id;
    let foundUser = await mongoose.connection.db?.collection('users').findOne({ _id: _id });

    expect(foundUser.username).toEqual('jean');
    expect(foundUser.email).toEqual('jean@gmail.com');
    expect(foundUser.password).toEqual('$2b$10$.wbjAJ/6t2trWkIPxl4i/OqKzSuktjzzraaSOoejXlmT8YEhSlln6');
    expect(foundUser.role).toEqual('admin');

    const user = {
      email: 'jean13@gmail.com',
      username: 'jean13',
      password: 'jean',
      role: 'guest',
    };

    await request(app.getHttpServer())
      .patch('/users/64b43c6d5b6e3c8f1a2d3e4f')
      .send(user)
      .expect(200);

    foundUser = await mongoose.connection.db?.collection('users').findOne({ _id: _id });

    expect(foundUser.username).toEqual('jean13');
    expect(foundUser.email).toEqual('jean13@gmail.com');
    expect(foundUser.password).not.toEqual('$2b$10$eE4KrI3zFmbMBk7tJ7E4Ce1gT0C9Mi4mkp3v0ZbsQwOtylc8W4rWq');
    expect(foundUser.role).toEqual('guest');

  });

  it('should delete user by id', async () => {

    await request(app.getHttpServer())
      .delete('/users/64b43c6d5b6e3c8f1a2d3e4f')
      .expect(204);

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body.length).toBe(2);

  });

  it('login user', async () => {

    const user = {
      username: 'jean',
      password: '1234',
    };

    const response = await request(app.getHttpServer())
      .post('/users/auth')
      .send(user)
      .expect(200);

    expect(response).toBeDefined();
    expect(response.body.token).toBeTruthy();

  });

});
