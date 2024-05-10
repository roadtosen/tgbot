import { token } from './info.js'
import TelegramBot from 'node-telegram-bot-api'
import { gameOptions, againOptions } from './options.js'

const bot = new TelegramBot(token, {
    polling: true
})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'We play a game now, im going to generate a number and you will send it to me')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    console.log(chats[chatId])
    await bot.sendMessage(chatId, 'Ok, you can send me number', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start the bot'},
        {command: '/info', description: 'Additional information'},
        {command: '/game', description: 'Lets play with bot'}
    ])
    
    bot.onText(/\/start/, msg => {
        bot.sendMessage(msg.chat.id, `Welcome, ${msg.from.first_name}`)
    })

    bot.onText(/\/info/, msg => {
        bot.sendMessage(msg.chat.id, `Your name is ${msg.from.first_name}`)
    })

    bot.onText(/\/game/, async msg => {
        const chatId = msg.chat.id
        await startGame(chatId)
    })

    bot.on('callback_query', async query => {
        const data = query.data
        const chatId = query.message.chat.id
        if (data === 'again') {
           return startGame(chatId)
        }
        if (data != chats[chatId]) {
            return bot.sendMessage(chatId, `Try again... Number was ${chats[chatId]}`, againOptions)
        } else { 
            return bot.sendMessage(chatId, `Correct! Number was ${chats[chatId]}`, againOptions)
        }
    })
}

start()