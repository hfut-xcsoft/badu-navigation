const HttpError  = require('some-http-error');
const Website = require('../models').Website;
const Statistic = require('../models').Statistic;
const easycopy = require('easy-copy');
const mongoose = require('mongoose');
const utils = require('../commons/utils');

const statisticController = {};

statisticController.addStatistic = async ctx => {
  switch (ctx.request.query.type) {
    case 'click':
      const websiteId = ctx.request.query.id;
      if (!utils.isValidObjectId(websiteId)) {
        throw new HttpError.BadRequestError()
      }
      await Statistic.addClickCount(websiteId);
      ctx.status = 201;
      ctx.body = null;
      break;

    default:
      throw new HttpError.BadRequestError();
      return;
  }
}

module.exports = statisticController;
