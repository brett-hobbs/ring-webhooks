import { Runner } from './runner'
import config from './config'

const WebhookUrl = config('WEBHOOK_URL')
const email = config('RING_EMAIL')
const password = config('RING_PASSWORD')

const OneMinute = 60 * 1000

const runner = new Runner(email, password)

console.log(email, password)

// Don't send old events
runner.sendNewRings()

setInterval(function() {
  runner.sendNewRings(WebhookUrl).then(count => {
    console.log(`${count} new rings`)
  })
}, OneMinute)
