const fastify = require('fastify')()

fastify.register(require('../../index'), {
  config: {
    serviceName: 'ping-server',
    sampler: {
      type: 'const',
      param: 1
    },
    reporter: {
      logSpans: true
    }
  },
  options: {
    // using npm package `simple-json-logger` by default
    // change with whatever you prefer
    logger: {
      info (msg) {
        console.log('INFO ', msg)
      },
      error (msg) {
        console.log('ERROR', msg)
      }
    }
  }
})

fastify.get('/ping', async function (req, reply) {
  const { Tags, FORMAT_HTTP_HEADERS } = this.opentracing
  const parentSpanContext = this.tracer.extract(FORMAT_HTTP_HEADERS, req.headers)
  const span = this.tracer.startSpan('ping', {
    childOf: parentSpanContext,
    tags: {[Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER}
  })
  const msg = 'pong'
  span.log({event: 'ping', value: msg})
  span.finish()
  return msg
})

fastify.listen(3000, err => {
  if (err) throw err
})
