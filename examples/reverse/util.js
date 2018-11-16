const request = require('request-promise')
const {Tags, FORMAT_HTTP_HEADERS} = require('opentracing')
function get (url, tracer, span) {
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
      return data
    }, e => {
      span.finish()
      throw e
    })
}

module.exports = {
  get
}
