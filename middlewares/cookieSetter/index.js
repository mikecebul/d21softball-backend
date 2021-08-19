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
                signed: true,
                httpOnly: true,
                overwrite: true,
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 2, // 2 Day Age
                // discard the domain property if in development mode to make the cookie work
                domain: "mikecebul.cloud",
              });
            }
          }
        });
      },
    };
  };