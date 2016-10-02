const feedbackController = {};
const HttpError  = require('some-http-error');
const Feedback = require('../models').Feedback;
const easycopy = require('easy-copy');

feedbackController.getAllFeedbacks = async (ctx, next) => {
  ctx.body = await Feedback.getFeedbacksByQuery();
};

feedbackController.createFeedback = async (ctx, next) => {
  const body = easycopy(ctx.request.body, ['content', 'email']);
  if (!body.content || !body.email) {
    throw new HttpError.BadRequestError('请将内容填写完整');
  }
  await new Feedback(body).create();
  ctx.body = true;
  ctx.status = 201;
};

module.exports = feedbackController;