var Brand = require('../models/brand');
var Pant = require('../models/pant');
var Shirt = require('../models/shirt');
var Size = require('../models/size');
var async = require('async');

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
    res.send('NOT IMPLEMENTED: size create GET');
};

// Handle size create on POST.
exports.size_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: size create POST');
};

// Display size delete form on GET.
exports.size_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: size delete GET');
};

// Handle size delete on POST.
exports.size_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: size delete POST');
};

// Display size update form on GET.
exports.size_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: size update GET');
};

// Handle size update on POST.
exports.size_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: size update POST');
};
