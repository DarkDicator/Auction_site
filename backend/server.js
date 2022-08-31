require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (e) => console.error(e))
db.once('open', () => console.log("Connected to Database"))

const auctionRoute = require('./api/auction.route.js')

app.use(express.json())
app.use(cors())
app.use('/api/v1/auction', auctionRoute)


app.listen(5000, () => {
    console.log("Server has started")
})


