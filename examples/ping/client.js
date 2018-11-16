const request = require('request-promise')
const { initTracer: initJaegerTracer } = require('jaeger-client')
const {Tags, FORMAT_HTTP_HEADERS} = require('opentracing')
function ping (url) {
  const config = {
    serviceName: 'ping-client',
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
  const method = 'GET'
  const headers = {}
  span.setTag(Tags.HTTP_URL, url)
  span.setTag(Tags.HTTP_METHOD, method)
  span.setTag(Tags.SPAN_KIND, Tags.SPAN_KIND_RPC_CLIENT)
  // Send span context via request headers (parent id etc.)
  tracer.inject(span, FORMAT_HTTP_HEADERS, headers)

  return request({url, method, headers})
    .then(data => {
      span.finish()
      tracer.close()
      return data
    }, e => {
      span.finish()
      tracer.close()
      throw e
    })
}

ping('http://localhost:3000/ping').then(console.log).catch(console.error)
