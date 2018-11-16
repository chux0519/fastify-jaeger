const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyJaeger = require('./index')

const VALID_CONFIG = {
  serviceName: 'test',
  sampler: {
    type: 'const',
    param: 1
  }
}

const INVALID_CONFIG = {}

test('{config: VALID_CONFIG}', async t => {
  const fastify = await register(t, { config: VALID_CONFIG })
  t.ok(fastify.tracer)
  t.ok(fastify.opentracing)
  t.end()
})

test('{config: INVALID_CONFIG}', async t => {
  t.rejects(await register(t, { config: INVALID_CONFIG }))
  t.end()
})

async function register (t, options) {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyJaeger, options)
  await fastify.ready()
  return fastify
}
