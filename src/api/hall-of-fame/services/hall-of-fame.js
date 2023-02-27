'use strict';

/**
 * hall-of-fame service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hall-of-fame.hall-of-fame');