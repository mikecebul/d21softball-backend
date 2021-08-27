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

    const { tournament, camp } = ctx.request.body;

    if (!tournament && !camp) {
      return ctx.throw(400, "Please specify a product");
    }

    const realTournament = await strapi.services.tournament?.findOne({ id: tournament?.id })
    const realCamp = await strapi.services.camp?.findOne({ id: camp?.id })

    if (!realTournament && !realCamp) {
      return ctx.throw(404, "No product with such id");
    }

    const realProduct = { tournament: realTournament, camp: realCamp }
    console.log(realProduct);

    const { user } = ctx.state;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      mode: "payment",
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: BASE_URL,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: realProduct.tournament?.name || realProduct.camp?.name,
            },
            unit_amount: fromDecimalToInt(realProduct.tournament?.price || realProduct.camp?.price),
          },
          quantity: 1,
        },
      ],
    });
    // Create the order
    console.log({
      user: user.id,
      ...(realProduct.tournament.id ? {tournament: realProduct.tournament.id} : {camp: realProduct.camp.id}),
      total: realProduct.tournament?.price || realProduct.camp?.price,
      status: "unpaid",
      checkout_session: session.id,
    })
    const newOrder = await strapi.services.order.create({
      user: user.id,
      ...(realProduct.tournament.id ? {tournament: realProduct.tournament.id} : {camp: realProduct.camp.id}),
      total: realProduct.tournament?.price || realProduct.camp?.price,
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
    const { checkout_session } = ctx.request.body

    const session = await stripe.checkout.sessions.retrieve(checkout_session)

    if(session.payment_status === 'paid') {
      const updateOrder = await strapi.services.order.update({
        checkout_session
      },
      {
        status: 'paid'
      })

      return sanitizeEntity(updateOrder, { model: strapi.models.order })
    } else {
      ctx.throw(400, "The payment wasn't successful, please call support")
    }
  }
};
