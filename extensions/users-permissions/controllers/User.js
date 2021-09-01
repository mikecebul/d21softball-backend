const _ = require("lodash");

module.exports = {
  async updateMe(ctx) {
    const { id } = ctx.state.user;
    const { body: input } = ctx.request;

    try {
      await validateUserUpdateInput(input);
    } catch (err) {
      return ctx.badRequest("ValidationError", err);
    }

    if (_.has(input, "email")) {
      const uniqueEmailCheck = await strapi.admin.services.user.exists({
        id_ne: id,
        email: input.email,
      });

      if (uniqueEmailCheck) {
        return ctx.badRequest("A user with this email address already exists");
      }
    }

    const updatedUser = await strapi.admin.services.user.updateById(id, input);

    if (!updatedUser) {
      return ctx.notFound("User does not exist");
    }

    ctx.body = {
      data: strapi.admin.services.user.sanitizeUser(updatedUser),
    };
  },
};
