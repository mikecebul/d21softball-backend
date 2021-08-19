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
      origin: ['https://mikecebul.cloud', 'https://www.mikecebul.cloud', 'https://api.mikecebul.cloud', "https://auth--masa-d21.netlify.app"],
    },
    cookieGetter: {
      enabled: true
    },
    cookieSetter: {
      enabled: true
    }
  },
})