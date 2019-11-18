const express = require('express')
const app = express()
const connectDB = require('./config/db')


connectDB()

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.listen(5000, () => {
    console.log('App listening on port 5000!')
})