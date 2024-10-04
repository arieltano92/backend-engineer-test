import { expect, afterEach, test, describe, afterAll } from "bun:test";
import fastifyServer from "../../src";
import { createBalance } from "../helpers/balances";
import { clearDB } from "../helpers/common";
import supertest from 'supertest'
import { firstBlockMock, secondBlockMock, thirdBlockMock } from "../mocks/blocks";

describe('Test post blocks service', () => {

    afterEach(async ()=>{
        await clearDB()
    })

    test('Post three blocks and rollback to the first should update balances successfully', async () => {
        //Create the three blocks
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock())
        .expect(200)

        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(secondBlockMock())
        .expect(200)

        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(thirdBlockMock())
        .expect(200)

        //Rollback to first block
        await supertest(fastifyServer.server)
        .post('/rollback?height=1')
        .expect(200)


        //Get balances of all the addresses and verify. The only one with balance should be addr1=10
        await supertest(fastifyServer.server)
        .get('/balance/addr1')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr1: {balance: 10}});
        })

        await supertest(fastifyServer.server)
        .get('/balance/addr2')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr2: {balance: 0}});
        })

        await supertest(fastifyServer.server)
        .get('/balance/addr3')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr3: {balance: 0}});
        })
        
        await supertest(fastifyServer.server)
        .get('/balance/addr4')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr4: {balance: 0}});
        })
        
        await supertest(fastifyServer.server)
        .get('/balance/addr5')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr5: {balance: 0}});
        })

        await supertest(fastifyServer.server)
        .get('/balance/addr6')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr6: {balance: 0}});
        })
    });


    test('Post rollback should fail with 400 because height param is wrong', async () => {
        //Rollback to first block
        await supertest(fastifyServer.server)
        .post('/rollback?fakeparam=1')
        .expect(400)
    });
})
