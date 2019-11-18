const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')

const User = require('./models/user')

connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, userData) => {
        if (err)
            return res.json({ success: false, err })
    })

    return res.status(200).json({ success: true })
})

app.listen(5000, () => {
    console.log('App listening on port 5000!')
})