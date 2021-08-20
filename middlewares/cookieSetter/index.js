// ./middlewares/cookieSetter/index.js
module.exports = (strapi) => {
    return {
      initialize() {
        strapi.app.use(async (ctx, next) => {
          await next();
          const requestURL = ctx.request.url;
          if (requestURL.startsWith('/auth/')) {
            const responseCode = ctx.response.status;
            if (responseCode === 200) {
              const { jwt: jwtToken } = ctx.response.body;
              ctx.cookies.set('token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                domain: process.env.NODE_ENV === "development" ? "localhost" : "mikecebul.cloud",
                overWrite: true,
                maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age
              });
            }
          }
        });
      },
    };
  };