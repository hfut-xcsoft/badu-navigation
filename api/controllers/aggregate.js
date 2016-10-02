const Category = require('../models').Category;
const Statistic = require('../models').Statistic;

const aggregateController = {};

aggregateController.getAggregate = async ctx => {
  'use strict';
  const day = ctx.request.query.day || 3;

  let groupedWebsites = await Category.getGroupedWebsites();
  const hotWebsites = await Promise.all(groupedWebsites.map(category => {
    const websites = category.subcategories
                      .map(x => x.websites)
                      .reduce((prev, next) => prev.concat(next), [])
                      .map(x => x._id);
    return Statistic.getHotWebsitesInCategory(websites, day);
  }));
  groupedWebsites.forEach((category, index) => {
    const hot = {
      name: '热门',
      slug: 'hot',
      description: category.description,
      websites: hotWebsites[index]
    };
    category.subcategories.unshift(hot);
  });
  ctx.body = groupedWebsites;
};

module.exports = aggregateController;