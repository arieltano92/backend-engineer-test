import { expect, afterEach, test, describe, afterAll } from "bun:test";
import fastifyServer from "../../src";
import { createBalance } from "../helpers/balances";
import { clearDB } from "../helpers/common";
import supertest from 'supertest'


describe('Test get balance service', () => {

    afterEach(async ()=>{
        await clearDB()
    })

    test('Get balance from an existent address should return status 200 with balance', async () => {
        await createBalance({address: 'addr1', value: 3});
        await supertest(fastifyServer.server)
        .get('/balance/addr1')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr1: {balance: 3}});
         })
    });

    test('Get balance should return 400 because address param lenght is invalid', async () => {
        await createBalance({address: 'addr1', value: 3});
        await supertest(fastifyServer.server)
        .get('/balance/a')
        .expect(400)
    });

    test('Get balance from an address that doesnt exist should return 404', async () => {
        await supertest(fastifyServer.server)
        .get('/balance/addre284')
        .expect(404)
    });

})
