'use strict'
const dotenv = require('dotenv')

const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') {
  dotenv.load()
}

const config = {
  ENV,
  PORT: process.env.PORT,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  RING_EMAIL: process.env.RING_EMAIL,
  RING_PASSWORD: process.env.RING_PASSWORD
}

module.exports = key => {
  if (!key) {
    return config
  }

  return config[key]
}
