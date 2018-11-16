// from https://github.com/jaegertracing/jaeger-client-node/blob/20a92b30633c70fd5ad63b3b4e3b530c36db5aaa/src/configuration.js#L29-L67
// FIXME: the schema seems a bit wrong, but keep it the same as original for now
const jaegerSchema = {
  id: '/jaeger',
  type: 'object',
  properties: {
    serviceName: { type: 'string' },
    disable: { type: 'boolean' },
    sampler: {
      properties: {
        type: { type: 'string' },
        param: { type: 'number' },
        host: { type: 'string' },
        port: { type: 'number' },
        refreshIntervalMs: { type: 'number' }
      },
      required: ['type', 'param'],
      additionalProperties: false
    },
    reporter: {
      properties: {
        logSpans: { type: 'boolean' },
        agentHost: { type: 'string' },
        agentPort: { type: 'number' },
        collectorEndpoint: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        flushIntervalMs: { type: 'number' }
      },
      additionalProperties: false
    },
    throttler: {
      properties: {
        host: { type: 'string' },
        port: { type: 'number' },
        refreshIntervalMs: { type: 'number' }
      },
      additionalProperties: false
    }
  }
}

module.exports = jaegerSchema
