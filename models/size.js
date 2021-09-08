var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SizeSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    desc: {type: String, required: true, maxLength: 100},
  }
);

//Url
SizeSchema
.virtual('url')
.get(function () {
  return '/catalog/size/' + this._id;
});

//Export model
module.exports = mongoose.model('Size', SizeSchema);

