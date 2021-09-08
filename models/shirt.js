var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShirtSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    desc: { type: String, required: true, maxLength: 100 },
    stock: { type: Number, required: true },
    brand: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],
    size: { type: Schema.Types.ObjectId, ref: 'Size' },
  }
);

//Url
ShirtSchema
.virtual('url')
.get(function () {
  return '/catalog/shirt/' + this._id;
});

//Export model
module.exports = mongoose.model('Shirt', ShirtSchema);

