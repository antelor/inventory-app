var Brand = require('../models/brand');
var Pant = require('../models/pant');
var Size = require('../models/size');
var async = require('async');

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


// Display detail page for a specific size.
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
exports.pant_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: pant create GET');
};

// Handle pant create on POST.
exports.pant_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: pant create POST');
};

// Display pant delete form on GET.
exports.pant_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: pant delete GET');
};

// Handle pant delete on POST.
exports.pant_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: pant delete POST');
};

// Display pant update form on GET.
exports.pant_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: pant update GET');
};

// Handle pant update on POST.
exports.pant_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: pant update POST');
};
