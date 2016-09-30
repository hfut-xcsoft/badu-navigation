const router = require('koa-router')();
const feedbackController = require('./feedback');

router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.post('/feedbacks', feedbackController.createFeedback);

module.exports = router.routes();