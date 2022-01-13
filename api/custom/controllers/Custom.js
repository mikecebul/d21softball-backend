// "use strict";

module.exports = {
  async logout(ctx) {
<<<<<<< HEAD
    ctx.cookies.set('token', "", {
      domain: process.env.NODE_ENV === "development" ? "localhost" : "d21softball.org"
    })
=======
    ctx.cookies.set("token", "", {
      domain:
        process.env.NODE_ENV === "development"
          ? "localhost"
          : "d21softball.org",
    });
>>>>>>> cc43141e538031b27601dad53ebafe348eb533b8
    ctx.send({
      authorized: true,
      message: "Successfully destroyed session",
    });
  },
};
