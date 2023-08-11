import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';

describe('Authentication System Test', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('register', () => {
        it('should return an AuthInterface', async () => {
            const payload = {email: 'test@test.test', password: "test12345", passwordConfirm: "test12345"}
            const response = await request(app.getHttpServer()).post('/auth/register')
                .send(payload)
                .expect(201)

            const {accessToken, user} = response.body
            expect(accessToken).toBeDefined()
            expect(user.id).toBeDefined()
            expect(user.email).toEqual(payload.email)
        })

        it('should return an error if password are not identical', () => {
            const email: string = 'test@test.test'
            return request(app.getHttpServer()).post('/auth/register')
                .send({email, password: "test12345", passwordConfirm: "test123456"})
                .expect(400)
                .then((res) => {
                    const {message, statusCode} = res.body
                    expect(message).toEqual('Password are not identical')
                    expect(statusCode).toEqual(400)
                })
        })

        it('should return an error if try to register 2 identical user', async () => {
            const payload = {email: 'test@test.test', password: "test12345", passwordConfirm: "test12345"}
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(payload)
                .expect(201)

            const request2 = await request(app.getHttpServer()).post('/auth/register')
                .send(payload)
                .expect(400)

            expect(request2.body.message).toBeDefined()
            expect(request2.body.message).toEqual('User is already exist')

            expect(request2.body.statusCode).toBeDefined()
            expect(request2.body.statusCode).toEqual(400)
        })

        it('should be error if data empty', async () => {
            await request(app.getHttpServer())
                .post('/auth/register')
                .expect(400)
        })

        it('should be error if email incorrect', async () => {
            const payload = {email: 'test', password: '12345678', passwordConfirm: '12345678'}
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(payload)
                .expect(400)
        })

        it('should be error if password short', async () => {
            const payload = {email: 'test@test.test', password: '123', passwordConfirm: '123'}
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(payload)
                .expect(400)
        })
    })

    describe('login', () => {
        it('should return auth response if user exist', async () => {
            const payload = {email: 'test@test.test', password: "test12345", passwordConfirm: "test12345"}
            await request(app.getHttpServer()).post('/auth/register')
                .send(payload)
                .expect(201)

            delete payload.passwordConfirm
            const loginResponse = await request(app.getHttpServer()).post('/auth/login')
                .send(payload)
                .expect(201)

            const {accessToken, user} = loginResponse.body
            expect(accessToken).toBeDefined()
            expect(user.id).toBeDefined()
            expect(user.email).toEqual(payload.email)
        })

        it('should be error if user does not exist', async () => {
            const payload = {email: 'test@test.test', password: 'test12345'}
            await request(app.getHttpServer())
                .post('/auth/login')
                .send(payload)
                .expect(404)
        })
    })

    describe('me', () => {
        it('should return error if no token', async () => {
            await request(app.getHttpServer())
                .get('/auth/me')
                .expect(401)
        })

        it('should be error if token incorrect', async () => {
            await request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', 'Bearer 12312312381jgiogj09jio')
                .expect(401)
        })

        it('should return user if user logged in', async () => {
            const payload = {email: 'test@test.test', password: "test1234", passwordConfirm: 'test1234'}
            const registerResponse = await request(app.getHttpServer()).post('/auth/register')
                .send(payload)
                .expect(201)

            expect(registerResponse.body.accessToken).toBeDefined()

            const currentUser = await request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${registerResponse.body.accessToken}`)
                .expect(200)

            const {id, email} = currentUser.body
            expect(id).toBeDefined()
            expect(email).toEqual(payload.email)
        })
    })
})
