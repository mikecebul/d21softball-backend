// "use strict";

module.exports = {
  async logout(ctx) {
    ctx.cookies.set('token', "", {
      domain: process.env.NODE_ENV === "development" ? "localhost" : "mikecebul.cloud"
    })
    ctx.send({
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};