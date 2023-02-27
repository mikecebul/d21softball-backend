module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: "https://api.d21softball.org",
  proxy: true,
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "b87a7dedf2150ac2ac7cb41b7ce48ad1"),
    },
  },
});
