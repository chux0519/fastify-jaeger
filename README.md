# fastify-jaeger


[![Greenkeeper badge](https://badges.greenkeeper.io/chux0519/fastify-jaeger.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/chux0519/fastify-jaeger.svg?branch=master)](https://travis-ci.org/chux0519/fastify-jaeger)

Fastify Jaeger tracing plugin, with this you can share the same Jaeger tracer
in your server.

## Install

> npm i fastify-jaeger --save

## Usage

Add this by `register`.

```javascript
const fastify = require('fastify')()

fastify.register(require('fastify-jaeger'), {
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
```

see [examples](./examples) for more.

## Reference

This plugin decorates the `fastify` instance with `tracer` and `opentracing`.
`tracer` is the instance created by `initTracer` of `jaeger-client`. `opentracing`
is the `opentracing` which `jaeger-client` using.

`fastify-jaeger` takes an object as parameter, which has `config` and `options`
property. They are passed into `initTracer`, so for more infomation, see
[jaeger-client](https://github.com/jaegertracing/jaeger-client-node).

## License

MIT