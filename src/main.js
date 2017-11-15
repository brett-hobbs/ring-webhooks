import { sendNewRings } from './runner'

const WebhookUrl = ''
const email = ''
const password = ''

let lastRingId = null
const OneMinute = 60 * 1000

setInterval(
  function(lastRingId) {
    sendNewRings(email, password, WebhookUrl, lastRingId).then(last => {
      lastRingId = last
    })
  },
  OneMinute,
  lastRingId
)
