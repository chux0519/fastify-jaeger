const {get} = require('./util')
const { initTracer: initJaegerTracer } = require('jaeger-client')

const config = {
  serviceName: 'reverse-client',
  sampler: {
    type: 'const',
    param: 1
  },
  reporter: {
    logSpans: true
  }
}
const options = {
  logger: {
    info (msg) {
      console.log('INFO ', msg)
    },
    error (msg) {
      console.log('ERROR ', msg)
    }
  }
}
const tracer = initJaegerTracer(config, options)
const span = tracer.startSpan('send-ping')

get('http://localhost:3000/reverse?toUpper=1&str=fastify', tracer, span)
  .then(console.log)
  .then(() => tracer.close())
  .catch(console.error)
