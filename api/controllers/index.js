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
const adminController = require('./admin');
const adminRequired = require('../middlewares/auth').adminRequired;

const router = new Router();
const categories = new Router();
const subcategories = new Router();
const websites = new Router();
const feedbacks = new Router();
const submits = new Router();
const statistics = new Router();
const admins = new Router();

websites
  .get('/', websiteController.getWebsites)
  .post('/', websiteController.createWebsites)
  .param('website', websiteController.assert)
  .get('/:website', websiteController.getWebsite)
  .put('/:website', websiteController.updateWebsite)
  .delete('/:website', websiteController.removeWebsite);
router.use('/websites', adminRequired, websites.routes());

subcategories
  .get('/', subcategoryController.getSubcategories)
  .post('/', subcategoryController.createSubcategory)
  .param('subcategory', subcategoryController.assert)
  .get('/:subcategory', subcategoryController.getSubcategory)
  .put('/:subcategory', subcategoryController.updateSubcategory)
  .delete('/:subcategory', subcategoryController.removeSubcategory);
router.use('/subcategories', adminRequired, subcategories.routes());

categories
  .get('/', categoryController.getCategories)
  .post('/', categoryController.createCategory)
  .param('category', categoryController.assert)
  .get('/:category', categoryController.getCategory)
  .put('/:category', categoryController.updateCategory)
  .delete('/:category', categoryController.removeCategory);
router.use('/categories', adminRequired, categories.routes());

feedbacks
  .get('/', adminRequired, feedbackController.getAllFeedbacks)
  .post('/', feedbackController.createFeedback);
router.use('/feedbacks', feedbacks.routes());

submits
  .get('/', adminRequired, submitController.getAllSubmits)
  .post('/', submitController.createSubmit)
  .put('/:submit', adminRequired, submitController.updateSubmitStatus);
router.use('/submits', submits.routes());

statistics
  .post('/', statisticController.addStatistic);
router.use('/statistics', statistics.routes());

admins
  .post('/authorization', adminController.authority)
  .put('/password', adminRequired, adminController.resetPassword);
router.use('/admins', admins.routes());

router.get('/', aggregateController.getAggregate);
router.post('/uploads', adminRequired,
  multer({ storage: multer.diskStorage(uploadController.storagePicture)}).single('picture'),
  uploadController.handleResult);

module.exports = router.routes();