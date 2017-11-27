import { Runner } from './runner'

// Set these variables
const WebhookUrl = ''
const email = ''
const password = ''

const OneMinute = 60 * 1000

const runner = new Runner(email, password)

// Don't send old events
runner.sendNewRings()

setInterval(function() {
  runner.sendNewRings(WebhookUrl)
}, OneMinute)
