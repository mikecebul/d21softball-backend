"use strict";

const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(process.env.STRIPE_SK);

/**
 * Given a dollar amount, return the amount in cents
 * @param {number} number
 */
const fromDecimalToInt = (number) => parseInt(number * 100);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Only returns orders that beliongs to logged in user
   * @param {any} ctx
   */
  async find(ctx) {
    const { user } = ctx.state;
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.order.search({
        ...ctx.query,
        user: user.id,
      });
    } else {
      entities = await strapi.services.order.find({
        ...ctx.query,
        user: user.id,
      });
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.order })
    );
  },
  /**
   * Returns one order, as long as it belongs to the user
   * @param {any} ctx
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const entity = await strapi.services.order.findOne({ id, user: user.id });
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
  /**
   * Creates an order an sets up the Stripe Checkout session for ther frontend
   * @param {any} ctx
   */
  async create(ctx) {
    const BASE_URL = ctx.request.headers.origin || "http://localhost:3000";
    const { tournament, email, teamId } = ctx.request.body;
    const { user } = ctx.state;
    let team

    if (!tournament) {
      return ctx.throw(400, "Please specify a product");
    }

    let realProduct;
    if (tournament) {
      realProduct = await strapi.services.tournament.findOne({
        id: tournament.id,
      });
    }

    if (!realProduct) {
      return ctx.throw(404, "No product with such id");
    }

    if (realProduct.teams) {
      team = realProduct.teams.find(team => team.id === teamId)
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user ? user.email : email,
      mode: "payment",
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&tournament_id=${realProduct.id}&team_id=${teamId}`,
      cancel_url: BASE_URL,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: realProduct.name,
              description: team ? team.team : "",
            },
            unit_amount: fromDecimalToInt(realProduct.price),
          },
          quantity: 1,
        },
      ],
    });


    const newOrder = await strapi.services.order.create({
      user: user ? user.id : null,
      tournament: realProduct.id,
      team: teamId,
      total: realProduct.price,
      status: "unpaid",
      checkout_session: session.id,
    });
    return { id: session.id };
  },

  /**
   * Given a checkout session, verifies payment and updates order
   * @param {any} ctx
   */
  async confirm(ctx) {
    const { checkout_session, tournament_id, team_id } = ctx.request.body;
    if (!checkout_session) {
      ctx.throw(400, "The checkout_session is missing");
    }
    const session = await stripe.checkout.sessions.retrieve(checkout_session);

    if (session.payment_status === "paid") {
      const updateOrder = await strapi.services.order.update(
        {
          checkout_session,
        },
        {
          status: "paid",
        }
      );

      //  Update Team isPaid as paid
      const tournament = await strapi.services.tournament.findOne({ id: tournament_id })
      const parsedTeamId = parseInt(team_id);
      if (parsedTeamId !== -1) {
        const team = tournament.teams.find(team => team.id === parsedTeamId)
        team.isPaid = true;
        await strapi.services.tournament.update({ id: tournament.id }, { teams: tournament.teams });
      }

      return sanitizeEntity(updateOrder, { model: strapi.models.order });
    } else {
      ctx.throw(400, "The payment wasn't successful, please call support");
    }
  },
};
