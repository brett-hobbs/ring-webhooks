import _ from 'lodash'
import request from 'request-promise'

export function sendWebhook(webhookPayload, webhookUrl) {
  return sendWebhooks(webhookPayload, [webhookUrl])
}

export function sendWebhooks(webhookPayload, webhookUrls) {
  // TODO Support signing of the payload.
  _.forEach(webhookUrls, webhookUrl => {
    const options = {
      uri: webhookUrl,
      body: webhookPayload,
      json: true
    }

    return request.post(options).catch(err => {
      console.error(`POST failed - ${err}`)
    })
  })
}
