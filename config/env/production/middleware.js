module.exports = ({}) => ({
  load: {
    before: [
      "cookieGetter",
      "responseTime",
      "logger",
      "cors",
      "responses",
      "gzip",
    ],
    after: ["parser", "router", "cookieSetter"],
  },
  //...
  settings: {
    cors: {
      enabled: true,
      origin: ['https://mikecebul.cloud', 'https://www.mikecebul.cloud', 'https://api.mikecebul.cloud', 'http://localhost:3000', 'http://localhost:1337'],
    },
    cookieGetter: {
      enabled: true
    },
    cookieSetter: {
      enabled: true
    }
  },
})