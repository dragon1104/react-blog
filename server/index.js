const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const { auth } = require('./middleware/auth')

const User = require('./models/user')


connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


//=================================
//            User
//=================================

app.get("/api/users/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.post('/api/user/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, doc) => {

        if (err) return res.json({ success: false, err })

        res.status(200).json({ success: true, userData: doc })
    })

})

app.post('/api/user/login', (req, res) => {
    const { email, password } = req.body
    //find the email
    User.findOne({ email }, (err, user) => {
        if (!user)
            return res.json({ loginSuccess: false, message: "Auth failed, email not found" })

        // console.log('user = ', user)

        //comparePassword
        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "wrong password" })
            }
        })

        //generateToken
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err)
            res
                .cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                })
        })
    })
})

app.get("/api/user/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).send({
            success: true
        })
    })
})

app.listen(5000, () => {
    console.log('App listening on port 5000!')
})