const express = require('express');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const config = require('./config');
require('dotenv').config();
const app = express();

// Connect Database
const connectDB = require('./common')
connectDB()

// Parse json request body
app.use(express.json())

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// Sanitize request data
app.use(xss())
app.use(mongoSanitize())

// gzip compression
app.use(compression())

// Config CORS
app.use(cors())

// // Import Routers
// const authRouter = require('./routers/auth')
// app.use('/auth', authRouter)

const indexRouter = require('./routers')
app.use(indexRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server started in port: ${config.port}`);
})