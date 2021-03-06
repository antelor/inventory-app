var Shirt = require('../models/shirt');
var Brand = require('../models/brand');
var Size = require('../models/size');
var async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all shirts.
exports.shirt_list = function(req, res) {
    Shirt.find({}, 'name stock')
    .populate('brand')
    .populate('size')
    .exec(function (err, list_shirts) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('shirt_list', { title: 'Shirts List', shirt_list: list_shirts });
    });
};

// Display detail page for a specific shirt.
exports.shirt_detail = function(req, res, next) {

    async.series({
        shirt: function(callback) {
            Shirt.findById(req.params.id)
              .populate('brand')
              .populate('size')
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.shirt==null) { // No results.
            var err = new Error('shirt not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('shirt_detail', { title: results.shirt.name, shirt: results.shirt } );
    });

};

// Display shirt create form on GET.
exports.shirt_create_get = function (req, res, next) {
    async.parallel({
        brands: function (callback) {
            Brand.find(callback);
        },
        sizes: function (callback) {
            Size.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('shirt_form', { title: 'Create Shirt', errors: err, shirt:null, brands:results.brands, sizes:results.sizes });
    })
};

// Handle shirt create on POST.
exports.shirt_create_post = [

    (req, res, next) => {
        // Convert the brand to an array.
        if(!(req.body.brand instanceof Array)){
            if(typeof req.body.brand ==='undefined')
            req.body.brand = [];
            else
            req.body.brand = new Array(req.body.brand);
        }

        // Convert the size to an array.
        if(!(req.body.size instanceof Array)){
            if(typeof req.body.size ==='undefined')
            req.body.size = [];
            else
            req.body.size = new Array(req.body.size);
        }
        next();
    },

    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('desc', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('stock').isNumeric().withMessage('Only numbers allowed in stock field'),
    body('brand.*').escape(),
    body('size.*').escape(),

    // Process request after validation and sanitization.

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a shirt object with escaped and trimmed data.
        var shirt = new Shirt(

          { name: req.body.name,
            desc: req.body.desc,
            brand: req.body.brand,
            stock: parseInt(req.body.stock),
            size: req.body.size
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                brands: function (callback) {
                    Brand.find(callback);
                },

                sizes: function (callback) {
                    Size.find(callback);
                },

            }, function(err, results) {
                if (err) { return next(err); }

                res.render('shirt_form', { title: 'Create shirt',authors:results.authors, brands:results.brands, sizes:results.sizes, shirt: shirt, errors: errors.array() });
            });

            return;
        }

        else {
            // Data from form is valid. Save shirt.

            shirt.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new shirt record.

                   res.redirect(shirt.url);
                });
        }
    }
];

// Display shirt delete form on GET.
exports.shirt_delete_get = function(req, res) {
    async.parallel({
        shirt: function (callback) {
            Shirt.findById(req.params.id).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.shirt == null) {
            //No results
            res.redirect('/catalog/shirts');
        }
        //Successful, so render
        res.render('shirt_delete', { title: 'Delete shirt', shirt: results.shirt });
    });
};

// Handle shirt delete on POST.
exports.shirt_delete_post = function(req, res) {
    async.parallel({
        shirt: function (callback) {
            Shirt.findById(req.body.shirtid).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        //Success
        Shirt.findByIdAndDelete(req.body.shirtid, function deleteShirt(err) {
            if (err) { return next(err); }
            res.redirect('/catalog/shirts');
        });
    });
};


// Display shirt update form on GET.
exports.shirt_update_get = function(req, res, next) {

    // Get shirt, brands and sizes for form.
    async.parallel({
        shirt: function(callback) {
            Shirt.findById(req.params.id).populate('brand').populate('size').exec(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        },
        sizes: function(callback) {
            Size.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.shirt==null) { // No results.
                var err = new Error('shirt not found');
                err.status = 404;
                return next(err);
            }
            // Success.
        
            // Mark our selected brands as checked.
            for (var all_b_iter = 0; all_b_iter < results.brands.length; all_b_iter++) {
                for (var shirt_b_iter = 0; shirt_b_iter < results.shirt.brand.length; shirt_b_iter++) {
                    if (results.brands[all_b_iter]._id.toString()===results.shirt.brand[shirt_b_iter]._id.toString()) {
                        results.brands[all_b_iter].checked = true;
                    }
                }
            }

            // Mark our selected size as checked.
            for (var all_s_iter = 0; all_s_iter < results.sizes.length; all_s_iter++) {
                    if (results.sizes[all_s_iter]._id.toString()===results.shirt.size._id.toString()) {
                        results.sizes[all_s_iter].checked = true;
                    }
            };
        
            res.render('shirt_form', { title: 'Update shirt', brands: results.brands, sizes: results.sizes, shirt: results.shirt, errors: err });
        });

};

// Handle shirt update on POST.
exports.shirt_update_post = [

    // Convert the genre to an array
    (req, res, next) => {
        if(!(req.body.brand instanceof Array)){
            if(typeof req.body.brand==='undefined')
            req.body.brand=[];
            else
            req.body.brand=new Array(req.body.brand);
        }
        next();
    },

    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('desc', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('stock').isNumeric().withMessage('Only numbers allowed in stock field'),
    body('brand.*').escape(),
    body('size.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a shirt object with escaped/trimmed data and old id.
        var shirt = new Shirt(
          { name: req.body.name,
            desc: req.body.desc,
            stock: req.body.stock,
            brand: (typeof req.body.brand === 'undefined') ? [] : req.body.brand,
            size: req.body.size,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                brands: function(callback) {
                    Brand.find(callback);
                },
                sizes: function(callback) {
                    Size.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                
                // Mark our selected brands as checked.
                for (var all_b_iter = 0; all_b_iter < results.brands.length; all_b_iter++) {
                    for (var shirt_b_iter = 0; shirt_b_iter < results.shirt.brand.length; shirt_b_iter++) {
                        if (results.brands[all_b_iter]._id.toString()===results.shirt.brand[shirt_b_iter]._id.toString()) {
                            results.brands[all_b_iter].checked = true;
                        }
                    }
                }

                // Mark our selected size as checked.
                for (var all_s_iter = 0; all_s_iter < results.sizes.length; all_s_iter++) {
                        if (results.sizes[all_s_iter]._id.toString()===results.shirt.size._id.toString()) {
                            results.sizes[all_s_iter].checked = true;
                        }
                };

                res.render('shirt_form', { title: 'Update shirt', brands: results.brands, sizes: results.sizes, shirt: shirt, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Shirt.findByIdAndUpdate(req.params.id, shirt, {}, function (err,theshirt) {
                if (err) { return next(err); }
                   // Successful - redirect to shirt detail page.
                   res.redirect(theshirt.url);
                });
        }
    }
];
