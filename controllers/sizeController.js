var Size = require('../models/size');

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
exports.size_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: size detail: ' + req.params.id);
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
