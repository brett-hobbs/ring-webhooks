import RingAPI from 'doorbot'
import _ from 'lodash'
import { sendWebhook } from './webhook'

export class Runner {
  constructor(email, password, lastId = null) {
    this.email = email
    this.password = password
    this.lastId = lastId
  }

  sendNewRings(webhookUrl) {
    const { email, password, lastId } = this
    const ring = RingAPI({
      email,
      password
    })

    return new Promise(resolve => {
      ring.history((e, history) => {
        const newRings = _.takeWhile(history, item => item.id != lastId)

        const fetchRecording = info => {
          ring.recording(info.id, (e, recording) => {
            if (webhookUrl) {
              sendWebhook(_.merge(info, { recording }), webhookUrl)
            }
          })
        }

        return Promise.all(newRings.map(fetchRecording)).then(() => {
          // Either return the id of the most recent ring or the id passed in.
          this.lastId = _.get(_.first(newRings), 'id') || lastId
          resolve(newRings.length)
        })
      })
    })
  }
}
