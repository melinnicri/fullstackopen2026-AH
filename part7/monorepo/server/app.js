const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const { userExtractor } = require('./utils/middleware')

app.use(cors())
app.use(express.json())

app.use(userExtractor)

app.use('/api/blogs', blogRouter)

module.exports = app