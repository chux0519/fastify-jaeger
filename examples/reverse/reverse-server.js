const fastify = require('fastify')()
const {get} = require('./util')

fastify.register(require('../../index'), {
  config: {
    serviceName: 'reverse-server',
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

fastify.get('/reverse', async function (req, reply) {
  const { Tags, FORMAT_HTTP_HEADERS } = this.opentracing
  const parentSpanContext = this.tracer.extract(FORMAT_HTTP_HEADERS, req.headers)
  const span = this.tracer.startSpan('reverse', {
    childOf: parentSpanContext,
    tags: {[Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER}
  })
  const {str, toUpper} = req.query
  let ret = str.split('').reverse().join('')
  span.log({event: 'do-reverse', value: ret})
  if (toUpper) {
    ret = await get(`http://localhost:3001/upper?str=${ret}`, this.tracer, span)
  }
  return ret
})

fastify.listen(3000, err => {
  if (err) throw err
})
