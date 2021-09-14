var Pant = require('../models/pant');
var Brand = require('../models/brand');
var Size = require('../models/size');
var async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all pants.
exports.pant_list = function(req, res) {
    Pant.find({}, 'name stock')
    .populate('brand')
    .populate('size')
    .exec(function (err, list_pants) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('pant_list', { title: 'Pants List', pant_list: list_pants });
    });
};


// Display detail page for a specific pant.
exports.pant_detail = function(req, res, next) {

    async.series({
        pant: function(callback) {
            Pant.findById(req.params.id)
              .populate('brand')
              .populate('size')
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.pant==null) { // No results.
            var err = new Error('pant not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('pant_detail', { title: results.pant.name, pant: results.pant } );
    });

};

// Display pant create form on GET.
exports.pant_create_get = function (req, res, next) {
    async.parallel({
        brands: function (callback) {
            Brand.find(callback);
        },
        sizes: function (callback) {
            Size.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('pant_form', { title: 'Create Pant', errors: err, pant:null, brands:results.brands, sizes:results.sizes });
    })
};

// Handle pant create on POST.
exports.pant_create_post = [
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

        // Create a pant object with escaped and trimmed data.
        var pant = new Pant(
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

                res.render('pant_form', { title: 'Create pant',authors:results.authors, brands:results.brands, sizes:results.sizes, pant: pant, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save pant.
            pant.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new pant record.
                   res.redirect(pant.url);
                });
        }
    }
];

// Display pant delete form on GET.
exports.pant_delete_get = function(req, res) {
    async.parallel({
        pant: function (callback) {
            Pant.findById(req.params.id).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.pant == null) {
            //No results
            res.redirect('/catalog/pants');
        }
        //Successful, so render
        res.render('pant_delete', { title: 'Delete pant', pant: results.pant });
    });
};

// Handle pant delete on POST.
exports.pant_delete_post = function (req, res) {
    async.parallel({
        pant: function (callback) {
            Pant.findById(req.body.brandid).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        //Success
        Pant.findByIdAndDelete(req.body.pantid, function deletePant(err) {
            if (err) { return next(err) };
            res.redirect('/catalog/pants');
        })
    });
};

// Display pant update form on GET.
exports.pant_update_get = function(req, res, next) {

    // Get pant, brands and sizes for form.
    async.parallel({
        pant: function(callback) {
            Pant.findById(req.params.id).populate('brand').populate('size').exec(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        },
        sizes: function(callback) {
            Size.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.pant==null) { // No results.
                var err = new Error('pant not found');
                err.status = 404;
                return next(err);
            }
            // Success.
        
            // Mark our selected brands as checked.
            for (var all_b_iter = 0; all_b_iter < results.brands.length; all_b_iter++) {
                for (var pant_b_iter = 0; pant_b_iter < results.pant.brand.length; pant_b_iter++) {
                    if (results.brands[all_b_iter]._id.toString()===results.pant.brand[pant_b_iter]._id.toString()) {
                        results.brands[all_b_iter].checked = true;
                    }
                }
            }

            // Mark our selected size as checked.
            for (var all_s_iter = 0; all_s_iter < results.sizes.length; all_s_iter++) {
                    if (results.sizes[all_s_iter]._id.toString()===results.pant.size._id.toString()) {
                        results.sizes[all_s_iter].checked = true;
                    }
            };
        
            res.render('pant_form', { title: 'Update pant', brands: results.brands, sizes: results.sizes, pant: results.pant, errors: err });
        });

};

// Handle pant update on POST.
exports.pant_update_post = [

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

        // Create a pant object with escaped/trimmed data and old id.
        var pant = new Pant(
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
                    for (var pant_b_iter = 0; pant_b_iter < results.pant.brand.length; pant_b_iter++) {
                        if (results.brands[all_b_iter]._id.toString()===results.pant.brand[pant_b_iter]._id.toString()) {
                            results.brands[all_b_iter].checked = true;
                        }
                    }
                }

                // Mark our selected size as checked.
                for (var all_s_iter = 0; all_s_iter < results.sizes.length; all_s_iter++) {
                        if (results.sizes[all_s_iter]._id.toString()===results.pant.size._id.toString()) {
                            results.sizes[all_s_iter].checked = true;
                        }
                };

                res.render('pant_form', { title: 'Update pant', brands: results.brands, sizes: results.sizes, pant: pant, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Pant.findByIdAndUpdate(req.params.id, pant, {}, function (err,thepant) {
                if (err) { return next(err); }
                   // Successful - redirect to pant detail page.
                   res.redirect(thepant.url);
                });
        }
    }
];
