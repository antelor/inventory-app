var shirt = require('../models/shirt');

// Display list of all shirts.
exports.shirt_list = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt list');
};

// Display detail page for a specific shirt.
exports.shirt_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: shirt detail: ' + req.params.id);
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
