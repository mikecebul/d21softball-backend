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
      origin: [
        "https://d21softball.org",
        "https://www.d21softball.org",
        "https://api.d21softball.org",
        "http://api.d21softball.org",
        "http://localhost:3000",
        "http://localhost:1337",
      ], // 'https://mikecebul.cloud', 'https://www.mikecebul.cloud', 'https://api.mikecebul.cloud',
    },
    cookieGetter: {
      enabled: true,
    },
    cookieSetter: {
      enabled: true,
    },
  },
});
