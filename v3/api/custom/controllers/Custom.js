// "use strict";

module.exports = {
  async logout(ctx) {
    ctx.cookies.set("token", "", {
      domain:
        process.env.NODE_ENV === "development"
          ? "localhost"
          : "d21softball.org",
    });
    ctx.send({
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};
