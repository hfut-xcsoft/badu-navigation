const router = require('koa-router')();
const categoryControlelr = require('./category');
const feedbackController = require('./feedback');


router
  .get('/categories', categoryControlelr.getCategories)
  .post('/categories', categoryControlelr.createCategory);

router
  .param('category', categoryControlelr.assert)
  .get('/categories/:category', categoryControlelr.getCategory)
  .put('/categories/:category', categoryControlelr.updateCategory)
  .delete('/categories/:category', categoryControlelr.removeCategory);



router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.post('/feedbacks', feedbackController.createFeedback);

module.exports = router.routes();