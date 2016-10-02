const Router = require('koa-router');
const multer = require('koa-multer');
const categoryController = require('./category');
const subcategoryController = require('./subcategory');
const websiteController = require('./website');
const feedbackController = require('./feedback');
const submitController = require('./submit');
const statisticController = require('./statistic');
const aggregateController = require('./aggregate');
const uploadController = require('./upload');

const router = new Router();
const categories = new Router();
const subcategories = new Router();
const websites = new Router();
const feedbacks = new Router();
const submits = new Router();
const statistics = new Router();

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
  .post('/', subcategoryController.createSubcategory)
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
  .delete('/:category', categoryController.removeCategory);
router.use('/categories', categories.routes());

feedbacks
  .get('/', feedbackController.getAllFeedbacks)
  .post('/', feedbackController.createFeedback);
router.use('/feedbacks', feedbacks.routes());

submits
  .get('/', submitController.getAllSubmits)
  .post('/', submitController.createSubmit)
  .put('/:submit', submitController.updateSubmitStatus);
router.use('/submits', submits.routes());

statistics
  .post('/', statisticController.addStatistic);
router.use('/statistics', statistics.routes());

router.get('/', aggregateController.getAggregate);
router.post('/uploads',
  multer({ storage: multer.diskStorage(uploadController.storagePicture)}).single('picture'),
  uploadController.handleResult);

module.exports = router.routes();