var size = require('../models/size');
var Pant = require('../models/pant');
var Shirt = require('../models/shirt');
var Size = require('../models/size');
var async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all sizes.
exports.size_list = function(req, res) {
    Size.find({}, 'name')
    .exec(function (err, list_sizes) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('size_list', { title: 'Sizes List', size_list: list_sizes });
    });
};

// Display detail page for a specific size.
exports.size_detail = function(req, res, next) {

    async.parallel({
        size: function(callback) {
            Size.findById(req.params.id)
              .exec(callback);
        },

        size_pants: function(callback) {
            Pant.find({ 'size': req.params.id })
              .exec(callback);
        },

        size_shirts: function(callback) {
            Shirt.find({ 'size': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.size==null) { // No results.
            var err = new Error('size not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('size_detail', { title: 'Size Detail', size: results.size, size_pants: results.size_pants, size_shirts: results.size_shirts } );
    });

};

// Display size create form on GET.
exports.size_create_get = function(req, res) {
    res.render('size_form', { title: 'Create Size', size: null, errors: [] });
};


// Handle size create on POST.
exports.size_create_post = [
    // Validate and sanitize fields.
    body('name').trim().isLength({ min: 1 }).escape().withMessage('Name must be specified.'),
    body('desc').trim().isLength({ min: 1 }).escape().withMessage('Desc must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('size_form', { title: 'Create size', size: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an size object with escaped and trimmed data.
            var size = new Size(
                {
                    name: req.body.name,
                    desc: req.body.desc,
                });
            
            size.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(size.url);
            });
        }
    }
];

// Display size delete form on GET.
exports.size_delete_get = function(req, res) {

    async.parallel({
        size: function (callback) {
            Size.findById(req.params.id).exec(callback);
        },
        size_pants: function (callback) {
            Pant.find({ 'size': req.params.id }).exec(callback);
        },
        size_shirts: function (callback) {
            Shirt.find({ 'size': req.params.id }).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.size == null) {
            //No results
            res.redirect('/catalog/sizes');
        }
        //Successful, so render.
        res.render('size_delete', { title: 'Delete size', size: results.size, size_pants:results.size_pants, size_shirts:results.size_shirts });
    });

};

// Handle size delete on POST.
exports.size_delete_post = function(req, res) {
    async.parallel({
        size: function (callback) {
            Size.findById(req.params.id).exec(callback);
        },
        size_pants: function (callback) {
            Pant.find({ 'size': req.params.id }).exec(callback);
        },
        size_shirts: function (callback) {
            Shirt.find({ 'size': req.params.id }).exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.size_pants.length > 0 || results.size_shirts.length > 0) {
            //size has clothes, re-render
            res.render('size_delete', { title: 'Delete size', size: results.size, size_pants:results.size_pants, size_shirts:results.size_shirts });
            return;
        }
        //Successful, so delete.
        Size.findByIdAndDelete(req.body.sizeid, function deleteSize(err) {
            if (err) { return next(err); }
            res.redirect('/catalog/sizes');
        });
    });
};

// Display size update form on GET.
exports.size_update_get = function(req, res, next) {

    // Get size, pants and shirts for form.
    async.parallel({
        size: function(callback) {
            Size.findById(req.params.id)
              .exec(callback);
        },

        size_pants: function(callback) {
            Pant.find({ 'size': req.params.id })
              .exec(callback);
        },

        size_shirts: function(callback) {
            Shirt.find({ 'size': req.params.id })
              .exec(callback);
        },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.size==null) { // No results.
                var err = new Error('size not found');
                err.status = 404;
                return next(err);
            }
            // Success.
        
            res.render('size_form', { title: 'Update size', size_shirts: results.size_shirts, size_pants: results.size_pants, size: results.size, errors: err });
        });

};

// Handle size update on POST.
exports.size_update_post = [


    // Validate and sanitise fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('desc', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a size object with escaped/trimmed data and old id.
        var size = new Size(
          { name: req.body.name,
            desc: req.body.desc,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                size_pants: function(callback) {
                    Pant.find({ 'size': req.params.id })
                      .exec(callback);
                },
        
                size_shirts: function(callback) {
                    Shirt.find({ 'size': req.params.id })
                      .exec(callback);
                },        
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('size_form', { title: 'Update size', size_shirts: results.size_shirts, size_pants: results.size_pants, size: results.size, errors: err });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Size.findByIdAndUpdate(req.params.id, size, {}, function (err,thesize) {
                if (err) { return next(err); }
                   // Successful - redirect to size detail page.
                   res.redirect(thesize.url);
                });
        }
    }
];
