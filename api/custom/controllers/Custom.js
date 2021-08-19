"use strict";

module.exports = {
  async logout(ctx) {
    ctx.cookies.set("token", null, {signed: true, overwrite: true, maxAge: -1, domain: "mikecebul.cloud"})
    ctx.send({
      responseCode: ctx.response.body,
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};