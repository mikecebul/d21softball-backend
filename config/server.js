module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'http://api.mikecebul.cloud',
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', ''),
    },
  },
});
