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

    test('Post one block successlfully should return status 200 and update balances', async () => {
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock())
        .expect(200)

        await supertest(fastifyServer.server)
        .get('/balance/addr1')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr1: {balance: 10}});
         })
    });

    test('Post three blocks successlfully and update balances successfully', async () => {
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


        //Get balances of all the addresses and verify
        await supertest(fastifyServer.server)
        .get('/balance/addr1')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr1: {balance: 0}});
        })

        await supertest(fastifyServer.server)
        .get('/balance/addr2')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr2: {balance: 4}});
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
            expect(body).toEqual({addr4: {balance: 2}});
        })
        
        await supertest(fastifyServer.server)
        .get('/balance/addr5')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr5: {balance: 2}});
        })

        await supertest(fastifyServer.server)
        .get('/balance/addr6')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({addr6: {balance: 2}});
        })
    });

    test('Post first block should fail with 400 because height is not 1 and balance is not created', async () => {
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock({height: 4}))
        .expect(400)

        await supertest(fastifyServer.server)
        .get('/balance/addr1')
        .expect(404)
    });

    test('Post block should fail with 400 because block ID is not valid', async () => {
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock({id: "fakeid"}))
        .expect(400)
    });

    test('Post second block should fail with 400 because inputs and outputs are not equal', async () => {
        //Create the two blocks 
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock())
        .expect(200)

        // This blocks contains a difference between inputs and ouptus so should fail
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(secondBlockMock({
            transactions: [{
                "id": "tx2",
                "inputs": [{
                "txId": "tx1",
                "index": 0
                }],
                "outputs": [{
                "address": "addr2",
                "value": 28
                }, {
                "address": "addr3",
                "value": 6
                }]
            }]
        }))
        .expect(400)
    });

    test('Post second block should fail with 400 because height is not consecutive', async () => {
        //Create the two blocks 
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock())
        .expect(200)

        // This blocks contains a wrong height so should fail with 400
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(secondBlockMock({
            height: 34
        }))
        .expect(400)
    });


    test('Post second block with inexistent input should fail with 400', async () => {
        //Create the two blocks 
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock())
        .expect(200)

        // This blocks contains a difference between inputs and ouptus so should fail
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(secondBlockMock({
            transactions: [{
                "id": "tx2",
                "inputs": [{
                "txId": "tx5",
                "index": 1
                }],
                "outputs": [{
                "address": "addr2",
                "value": 4
                }, {
                "address": "addr3",
                "value": 6
                }]
            }]
        }))
        .expect(400)
    });

    test('Post block should fail with 400 because body schema is wrong', async () => {
        //Create the two blocks 
        await supertest(fastifyServer.server)
        .post('/blocks')
        .send(firstBlockMock({height: undefined}))
        .expect(400)
    });

})
