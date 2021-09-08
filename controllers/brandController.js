var Brand = require('../models/brand');
var Pant = require('../models/pant');
var Shirt = require('../models/shirt');
var Size = require('../models/size');
var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        brand_count: function(callback) {
            Brand.countDocuments({}, callback);
        },
        /*pant_count: function(callback) {
            Pant.countDocuments({}, callback);
        },
        shirt_count: function(callback) {
            Shirt.countDocuments({}, callback);
        },
        size_count: function(callback) {
            Size.countDocuments({}, callback);
        }*/
    }, function(err, results) {
        res.render('index', { title: 'Inventory App Home', error: err, data: results });
    });
};

// Display list of all brands.
exports.brand_list = function(req, res) {
    res.send('NOT IMPLEMENTED: brand list');
};

// Display detail page for a specific brand.
exports.brand_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: brand detail: ' + req.params.id);
};

// Display brand create form on GET.
exports.brand_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand create GET');
};

// Handle brand create on POST.
exports.brand_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand create POST');
};

// Display brand delete form on GET.
exports.brand_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand delete GET');
};

// Handle brand delete on POST.
exports.brand_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand delete POST');
};

// Display brand update form on GET.
exports.brand_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand update GET');
};

// Handle brand update on POST.
exports.brand_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand update POST');
};
