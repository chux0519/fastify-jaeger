const initJaegerTracer = require('jaeger-client').initTracer
const fp = require('fastify-plugin')
const Ajv = require('ajv')
const jaegerSchema = require('./jaeger-schema')
const logger = require('simple-json-logger')

function FastifyJaeger (fastify, params, next) {
  const baseConfig = {
    reporter: {logSpans: true}
  }
  const baseOptions = {logger}
  const {config, options} = params
  const ajv = new Ajv()
  const jSchema = ajv.compile(jaegerSchema)
  const valid = jSchema.validate(config)
  if (!valid) throw new Error('Jaeger config is not valid')

  fastify.tracer = initJaegerTracer({...baseConfig, ...config}, {...baseOptions, ...options})
  next()
}

module.exports = fp(FastifyJaeger)
