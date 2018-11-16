const {opentracing, initTracer} = require('jaeger-client')
const fp = require('fastify-plugin')
const Ajv = require('ajv')
const jaegerSchema = require('./jaeger-schema')
const logger = require('simple-json-logger')

function fastifyJaeger (fastify, params, next) {
  const baseConfig = {
    reporter: {logSpans: true}
  }
  const baseOptions = {logger}
  const {config, options} = params
  const ajv = new Ajv()
  const validateJaegerSchema = ajv.compile(jaegerSchema)
  const valid = validateJaegerSchema(config)
  if (!valid) throw new Error('Jaeger config is not valid')

  const tracer = initTracer({...baseConfig, ...config}, {...baseOptions, ...options})
  fastify.decorate('tracer', tracer)
  fastify.decorate('opentracing', opentracing)
  fastify.addHook('onClose', (_, done) => {
    tracer.close(done)
  })
  next()
}

module.exports = fp(fastifyJaeger)
