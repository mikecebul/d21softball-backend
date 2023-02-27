'use strict';

/**
 * A set of functions called "actions" for `logout`
 */

module.exports = {
  action: async (ctx, next) => {
    try {
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
    } catch (err) {
      ctx.send({
        message: `An error occured: ${err}`
      });
    }
  }
};
