'use strict';

/**
 * umpire service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::umpire.umpire');