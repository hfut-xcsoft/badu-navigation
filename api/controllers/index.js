const Router = require('koa-router');
const categoryController = require('./category');
const subcategoryController = require('./subcategory');
const websiteController = require('./website');
const feedbackController = require('./feedback');

const router = new Router();
const categories = new Router();
const subcategories = new Router();
const websites = new Router();
const feedbacks = new Router();

websites
  .get('/', websiteController.getWebsites)
  .post('/', websiteController.createWebsites)
  .param('website', websiteController.assert)
  .get('/:website', websiteController.getWebsite)
  .put('/:website', websiteController.updateWebsite)
  .delete('/:website', websiteController.removeWebsite);
router.use('/websites', websites.routes());

subcategories
  .get('/', subcategoryController.getSubcategories)
  .param('subcategory', subcategoryController.assert)
  .get('/:subcategory', subcategoryController.getSubcategory)
  .put('/:subcategory', subcategoryController.updateSubcategory)
  .delete('/:subcategory', subcategoryController.removeSubcategory);
router.use('/subcategories', subcategories.routes());

categories
  .get('/', categoryController.getCategories)
  .post('/', categoryController.createCategory)
  .param('category', categoryController.assert)
  .get('/:category', categoryController.getCategory)
  .put('/:category', categoryController.updateCategory)
  .delete('/:category', categoryController.removeCategory)
  .get('/:category/subcategories', subcategoryController.getSubcategories)
  .post('/:category/subcategories', subcategoryController.createSubcategory);
router.use('/categories', categories.routes());

feedbacks
  .get('/', feedbackController.getAllFeedbacks)
  .post('/', feedbackController.createFeedback);
router.use('/feedbacks', feedbacks.routes());


module.exports = router.routes();