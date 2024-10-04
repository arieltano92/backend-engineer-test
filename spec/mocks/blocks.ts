export function firstBlockMock(override: any = undefined){
    return {
        "id":"d1582b9e2cac15e170c39ef2e85855ffd7e6a820550a8ca16a2f016d366503dc",
        "height": 1,
        "transactions": [{
            "id": "tx1",
            "inputs": [],
            "outputs": [{
            "address": "addr1",
            "value": 10
            }]
        }],
        ...override
    }
}

export function secondBlockMock(override: any = undefined){
    return {
        "id":"c4701d0bfd7179e1db6e33e947e6c718bbc4a1ae927300cd1e3bda91a930cba5",
        "height": 2,
        "transactions": [{
            "id": "tx2",
            "inputs": [{
            "txId": "tx1",
            "index": 0
            }],
            "outputs": [{
            "address": "addr2",
            "value": 4
            }, {
            "address": "addr3",
            "value": 6
            }]
        }],
        ...override
    }
}

export function thirdBlockMock(override: any = undefined){
    return {
        "id":"4e5f22a2abacfaf2dcaaeb1652aec4eb65028d0f831fa435e6b1ee931c6799ec",
        "height": 3,
        "transactions": [{
            "id": "tx3",
            "inputs": [{
            "txId": "tx2",
            "index": 1
            }],
            "outputs": [{
            "address": "addr4",
            "value": 2
            }, {
            "address": "addr5",
            "value": 2
            }, {
            "address": "addr6",
            "value": 2
            }]
        }],
        ...override
    }
} 