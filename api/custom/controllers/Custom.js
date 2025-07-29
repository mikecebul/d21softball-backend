// "use strict";

const { env } = require("strapi-utils");

module.exports = {
  async logout(ctx) {
    ctx.cookies.set("token", "", {
      domain:
        process.env.NODE_ENV === "development"
          ? "localhost"
          : env("PRODUCTION_URL", "d21softball.org"),
    });
    ctx.send({
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};
