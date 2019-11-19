const mongoose = require('mongoose')
const db = require('./default.js')

const connectDB = async () => {
	try {
		await mongoose.connect(db.mongoURI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		})

		console.log('MongoDB Connected...')
	} catch (err) {
		console.error(err.message)
		// Exit process with failure
		process.exit(1)
	}
}

module.exports = connectDB