module.exports = ({ env }) => ({
  // ...
  email: {
    provider: "sendmail",
    // providerOptions: {
    //   apiKey: env('SENDGRID_API_KEY'),
    // },
    settings: {
      defaultFrom: "mikecebul@gmail.com",
      defaultReplyTo: "mikecebul@gmail.com",
      testAddress: "mikecebul@gmail.com",
    },
  },
  // ...
});
