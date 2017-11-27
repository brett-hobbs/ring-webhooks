import nock from 'nock'
import request from 'request-promise'
import { fakeHistory } from './test_data/sample_history'
import { Runner } from './runner'

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

let runner

beforeEach(() => {})

test('No rings', () => {
  mockRingCalls([])
  runner = new Runner('email', 'password')
  return runner.sendNewRings('webhook.url').then(result => expect(result).toBe(0))
})

test('New new rings', () => {
  const lastId = '6489929745876933000'
  mockRingCalls(fakeHistory)
  runner = new Runner('email', 'password', lastId)
  request.post = jest.fn().mockReturnValue(Promise.resolve())
  return runner.sendNewRings('webhook.url').then(result => {
    expect(request.post.mock.calls.length).toBe(0)
    expect(result).toBe(0)
  })
})

test('New rings', () => {
  mockRingCalls(fakeHistory)
  runner = new Runner('email', 'password')
  request.post = jest.fn().mockReturnValue(Promise.resolve())
  return runner.sendNewRings('webhook.url').then(result => {
    expect(request.post.mock.calls.length).toBe(3)
    expect(result).toBe(3)
  })
})
