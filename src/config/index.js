const dotenv = require('dotenv');

const envFound = dotenv.config()
if (envFound.error) {
  throw new Error(" Couldn't find .env file ")
}

module.exports = {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.DATABASE_URL,
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_TOKEN,
  resetToken: process.env.RESET_TOKEN,
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  client_url: process.env.CLIENT_URL
}