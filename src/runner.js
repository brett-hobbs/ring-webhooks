import RingAPI from 'doorbot'
import async from 'async'
import _ from 'lodash'
import { sendWebhook } from './webhook'

function sendNewRings(email, password, webhookUrl, lastId) {
  console.log('LAST ', lastId)
  const ring = RingAPI({
    email,
    password
  })

  return new Promise(resolve => {
    ring.history((e, history) => {
      const newRings = _.takeWhile(history, item => item.id != lastId)

      const fetchRecording = info => {
        ring.recording(info.id, (e, recording) => {
          return sendWebhook(_.merge(info, { recording }), webhookUrl)
        })
      }

      return async.eachLimit(newRings, 10, fetchRecording, () => {
        // Either return the id of the most recent ring or the id passed in.
        resolve(_.get(_.first(newRings), 'id') || lastId)
      })
    })
  })
}

module.exports = {
  sendNewRings
}
