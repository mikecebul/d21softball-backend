'use strict';

/**
 * motel service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::motel.motel');