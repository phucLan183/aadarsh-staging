const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config');


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

app.listen(config.port, () => {
  console.log(`Server started in port: ${config.port}`);
})