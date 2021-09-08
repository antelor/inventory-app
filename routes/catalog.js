var express = require('express');
var router = express.Router();

// Require controller modules.
var brand_controller = require('../controllers/brandController');
var pant_controller = require('../controllers/pantController');
var shirt_controller = require('../controllers/shirtController');
var size_controller = require('../controllers/sizeController');

/// BRAND ROUTES ///

// GET catalog home page.
router.get('/', brand_controller.index);

// GET request for creating a brand. NOTE This must come before routes that display brand (uses id).
router.get('/brand/create', brand_controller.brand_create_get);

// POST request for creating brand.
router.post('/brand/create', brand_controller.brand_create_post);

// GET request to delete brand.
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// POST request to delete brand.
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// GET request to update brand.
router.get('/brand/:id/update', brand_controller.brand_update_get);

// POST request to update brand.
router.post('/brand/:id/update', brand_controller.brand_update_post);

// GET request for one brand.
router.get('/brand/:id', brand_controller.brand_detail);

// GET request for list of all brand items.
router.get('/brands', brand_controller.brand_list);

/// PANT ROUTES ///

// GET request for creating pant. NOTE This must come before route for id (i.e. display pant).
router.get('/pant/create', pant_controller.pant_create_get);

// POST request for creating pant.
router.post('/pant/create', pant_controller.pant_create_post);

// GET request to delete pant.
router.get('/pant/:id/delete', pant_controller.pant_delete_get);

// POST request to delete pant.
router.post('/pant/:id/delete', pant_controller.pant_delete_post);

// GET request to update pant.
router.get('/pant/:id/update', pant_controller.pant_update_get);

// POST request to update pant.
router.post('/pant/:id/update', pant_controller.pant_update_post);

// GET request for one pant.
router.get('/pant/:id', pant_controller.pant_detail);

// GET request for list of all pants.
router.get('/pants', pant_controller.pant_list);

/// shirt ROUTES ///

// GET request for creating a shirt. NOTE This must come before route that displays shirt (uses id).
router.get('/shirt/create', shirt_controller.shirt_create_get);

//POST request for creating shirt.
router.post('/shirt/create', shirt_controller.shirt_create_post);

// GET request to delete shirt.
router.get('/shirt/:id/delete', shirt_controller.shirt_delete_get);

// POST request to delete shirt.
router.post('/shirt/:id/delete', shirt_controller.shirt_delete_post);

// GET request to update shirt.
router.get('/shirt/:id/update', shirt_controller.shirt_update_get);

// POST request to update shirt.
router.post('/shirt/:id/update', shirt_controller.shirt_update_post);

// GET request for one shirt.
router.get('/shirt/:id', shirt_controller.shirt_detail);

// GET request for list of all shirt.
router.get('/shirts', shirt_controller.shirt_list);

/// SIZE ROUTES ///

// GET request for creating a size. NOTE This must come before route that displays size (uses id).
router.get('/size/create', size_controller.size_create_get);

// POST request for creating size.
router.post('/size/create', size_controller.size_create_post);

// GET request to delete size.
router.get('/size/:id/delete', size_controller.size_delete_get);

// POST request to delete size.
router.post('/size/:id/delete', size_controller.size_delete_post);

// GET request to update size.
router.get('/size/:id/update', size_controller.size_update_get);

// POST request to update size.
router.post('/size/:id/update', size_controller.size_update_post);

// GET request for one size.
router.get('/size/:id', size_controller.size_detail);

// GET request for list of all size.
router.get('/sizes', size_controller.size_list);

module.exports = router;
