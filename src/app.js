const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config');
require(dotenv).config();

// Connect Database
const connectDB = require('./common')
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Config CORS
app.use(cors())

// Import Routers
const authRouter = require('./routers/auth')
app.use('/auth', authRouter)

const indexRouter = require('./routers/index')
app.use(indexRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server started in port: ${config.port}`);
})