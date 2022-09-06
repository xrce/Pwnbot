const { create, Client } = require('@open-wa/wa-automate')

const chat = require('./chat')
const config = require('./config')

const start = async (client = new Client()) => {
    console.clear()
    console.log(color(`//`, 'green'), color(`PwnBot Started\n`, 'white'))

    client.onStateChanged((state) => {
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })

    client.onMessage((async (message) => {
        client.getAmountOfLoadedMessages()
        .then((msg) => {
            if (msg >= 3000) {
                client.cutMsgCache()
            }
        })
        chat(client, message)
    }))
}

create(config(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))