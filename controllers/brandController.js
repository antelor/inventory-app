var Brand = require('../models/brand');
var Pant = require('../models/pant');
var Shirt = require('../models/shirt');
var Size = require('../models/size');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function(req, res) {
    async.parallel({
        brand_count: function(callback) {
            Brand.countDocuments({}, callback);
        },
        pant_count: function(callback) {
            Pant.countDocuments({}, callback);
        },
        shirt_count: function(callback) {
            Shirt.countDocuments({}, callback);
        },
        size_count: function(callback) {
            Size.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Inventory App Home', error: err, data: results });
    });
};

// Display list of all brands.
exports.brand_list = function(req, res) {
    Brand.find({}, 'name')
    .exec(function (err, list_brands) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('brand_list', { title: 'Brand List', brand_list: list_brands });
    });
};

// Display detail page for a specific brand.
exports.brand_detail = function(req, res, next) {

    async.parallel({
        brand: function(callback) {
            Brand.findById(req.params.id)
              .exec(callback);
        },

        brand_pants: function(callback) {
            Pant.find({ 'brand': req.params.id })
              .exec(callback);
        },

        brand_shirts: function(callback) {
            Shirt.find({ 'brand': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand==null) { // No results.
            var err = new Error('brand not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('brand_detail', { title: 'Brand Detail', brand: results.brand, brand_pants: results.brand_pants, brand_shirts: results.brand_shirts } );
    });

};

// Display brand create form on GET.
exports.brand_create_get = function(req, res) {
    res.render('brand_form', { title: 'Create Brand', brand: null, errors: [] });
};


// Handle Brand create on POST.
exports.brand_create_post = [
    // Validate and sanitize fields.
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Name must be specified.'),
    body('desc').trim().isLength({ min: 1 }).escape().withMessage('Desc must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('brand_form', { title: 'Create Brand', brand: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Brand object with escaped and trimmed data.
            var brand = new Brand(
                {
                    name: req.body.name,
                    desc: req.body.desc,
                });
            
            brand.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new brand record.
                res.redirect(brand.url);
            });
        }
    }
];

// Display brand delete form on GET.
exports.brand_delete_get = function(req, res, next) {

    async.parallel({
        brand: function(callback) {
            Brand.findById(req.params.id).exec(callback)
        },
        brand_pants: function(callback) {
            Pant.find({ 'brand': req.params.id }).exec(callback)
        },
        brand_shirts: function(callback) {
            Shirt.find({ 'brand': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand==null) { // No results.
            res.redirect('/catalog/brands');
        }
        // Successful, so render.
        res.render('brand_delete', { title: 'Delete brand', brand: results.brand, brand_pants: results.brand_pants, brand_shirts: results.brand_shirts } );
    });

};

// Handle brand delete on POST.
exports.brand_delete_post = function(req, res) {
    
    async.parallel({
        brand: function (callback) {
            Brand.findById(req.body.brandid).exec(callback);
        },
        brand_pants: function(callback) {
            Pant.find({ 'brand': req.params.id }).exec(callback)
        },
        brand_shirts: function(callback) {
            Shirt.find({ 'brand': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        //Success
        if (results.brand_pants.length > 0 || results.brand_shirts.length > 0) {
            //brand has clothes. re-render
            res.render('brand_delete', { title: 'Delete brand', brand: results.brand, brand_pants: results.brand_pants, brand_shirts: results.brand_shirts });
            return;
        }
        else {
            //brand has no clothes. delete and redirect to brand page
            Brand.findByIdAndDelete(req.body.brandid, function deleteBrand(err) {
                if (err) { return next(err) };
                res.redirect('/catalog/brands');
            })
        }
    })
};

// Display brand update form on GET.
exports.brand_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand update GET');
};

// Handle brand update on POST.
exports.brand_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand update POST');
};
