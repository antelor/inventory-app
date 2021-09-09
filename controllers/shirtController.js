var Shirt = require('../models/shirt');
var async = require('async');

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
exports.shirt_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt create GET');
};

// Handle shirt create on POST.
exports.shirt_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt create POST');
};

// Display shirt delete form on GET.
exports.shirt_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt delete GET');
};

// Handle shirt delete on POST.
exports.shirt_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt delete POST');
};

// Display shirt update form on GET.
exports.shirt_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt update GET');
};

// Handle shirt update on POST.
exports.shirt_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt update POST');
};
