const feedbackController = {};
const HttpError  = require('some-http-error');
const Feedback = require('../models').Feedback;

feedbackController.getAllFeedbacks = async (ctx, next) => {
  ctx.body = await Feedback.getFeedbacksByQuery();
};

feedbackController.createFeedback = async (ctx, next) => {
  const body = ctx.request.body;
  if (!body.content) {
    throw new HttpError.BadRequestError('请填写反馈内容');
  }
  ctx.body = await new Feedback(body).create();
  ctx.status = 201;
};

module.exports = feedbackController;