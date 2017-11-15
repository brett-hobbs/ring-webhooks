import nock from 'nock'
import request from 'request-promise'
import { fakeHistory } from './test_data/sample_history'
import { sendNewRings } from './runner'

function mockRingCalls(fakeHistory) {
  nock('https://api.ring.com')
    .post('/clients_api/session')
    .reply(200, {
      profile: {
        authentication_token: 'TOKEN'
      }
    })
  nock('https://api.ring.com')
    .get('/clients_api/doorbots/history')
    .query({ auth_token: 'TOKEN', api_version: 9 })
    .reply(200, fakeHistory)
  nock('https://api.ring.com')
    .get('/clients_api/dings/1/recording')
    .query({ auth_token: 'TOKEN', api_version: 9 })
    .reply(200, '', {
      location: 'aws.amazon.com/temp.mp4'
    })
}

test('No rings', () => {
  mockRingCalls([])
  return sendNewRings('username', 'password', 'webhook.url', null).then(result => expect(result).toBe(null))
})

test('No rings with lastId', () => {
  const lastId = 123456
  mockRingCalls([])
  return sendNewRings('username', 'password', 'webhook.url', lastId).then(result => expect(result).toBe(lastId))
})

test('New new rings', () => {
  const lastId = '6489929745876933000'
  mockRingCalls(fakeHistory)
  request.post = jest.fn().mockReturnValue(Promise.resolve())
  return sendNewRings('username', 'password', 'webhook.url', lastId).then(result => {
    expect(request.post.mock.calls.length).toBe(0)
    expect(result).toBe(lastId)
  })
})

test('New rings', () => {
  mockRingCalls(fakeHistory)
  request.post = jest.fn().mockReturnValue(Promise.resolve())
  return sendNewRings('username', 'password', 'webhook.url', null).then(result => {
    expect(request.post.mock.calls.length).toBe(3)
    expect(result).toBe('6489929745876933000')
  })
})
