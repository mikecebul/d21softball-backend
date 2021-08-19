// "use strict";

module.exports = {
  async logout(ctx) {
    ctx.cookies.set('token', "", {domain: "mikecebul.cloud"})
    ctx.send({
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};