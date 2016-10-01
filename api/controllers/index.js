const Router = require('koa-router');
const categoryController = require('./category');
const feedbackController = require('./feedback');

const router = new Router();
const categories = new Router();
const feedbacks = new Router();

categories
  .get('/', categoryController.getCategories)
  .post('/', categoryController.createCategory)
  .param('category', categoryController.assert)
  .get('/:category', categoryController.getCategory)
  .put('/:category', categoryController.updateCategory)
  .delete('/:category', categoryController.removeCategory);
router.use('/categories', categories.routes());

feedbacks
  .get('/', feedbackController.getAllFeedbacks)
  .post('/', feedbackController.createFeedback);
router.use('/feedbacks', feedbacks.routes());


module.exports = router.routes();