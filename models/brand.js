var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BrandSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    desc: {type: String, required: true, maxLength: 100},
  }
);

//Url
BrandSchema
.virtual('url')
.get(function () {
  return '/catalog/brand/' + this._id;
});

//Export model
module.exports = mongoose.model('Brand', BrandSchema);

