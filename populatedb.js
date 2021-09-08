#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Brand = require('./models/brand')
var Pant = require('./models/pant')
var Shirt = require('./models/shirt')
var Size = require('./models/size')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = []
var pants = []
var shirts = []
var sizes = []

function brandCreate(name, desc, cb) {
  brandDetail = {name: name , desc: desc }

  var brand = new Brand(brandDetail);
       
  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand)
  }  );
}

function pantCreate(name, desc, brand, size, stock, cb) {
  var pant = new Pant({ name: name, desc:desc, brand:brand, size: size, stock:stock });
       
  pant.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Pant: ' + pant);
    pants.push(pant)
    cb(null, pant);
  }   );
}

function shirtCreate(name, desc, brand, size, stock, cb) {
  shirtDetail = { 
    name: name,
    desc: desc,
    brand: brand,
    size: size,
    stock: stock,
  }
    
  var shirt = new Shirt(shirtDetail);    
  shirt.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Shirt: ' + shirt);
    shirts.push(shirt)
    cb(null, shirt)
  }  );
}


function sizeCreate(name, desc, cb) {
  sizeDetail = { 
    name: name,
    desc: desc,
  }
    
  var size = new Size(sizeDetail);    
  size.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Size: ' + size);
      cb(err, null)
      return
    }
    console.log('New Size: ' + size);
    sizes.push(size)
    cb(null, size)
  }  );
}


function createBrands(cb) {
    async.series([
        function(callback) {
          brandCreate('Nike', 'ropa de nike', callback);
        },
        function(callback) {
          brandCreate('Adidas', 'ropa de adidas', callback);
        },
        function(callback) {
          brandCreate('Puma', 'ropa puma', callback);
        },
        function(callback) {
          brandCreate('Supreme', 'ropa supreme', callback);
        },
        ],
        // optional callback
        cb);
}


function createPants(cb) {
    async.parallel([
        function(callback) {
          pantCreate('lompa nike', 'es un lompa de nike', [brands[0]], sizes[0], '42', callback);
        },
        function(callback) {
          pantCreate('lompa adida', 'es un lompa adida', [brands[0]], sizes[0], '42', callback);
        },
        function(callback) {
          pantCreate('lompa nashe nike', 'es un lompa de nike', [brands[0]], sizes[0], '42', callback);
        },
        function(callback) {
          pantCreate('lompa pumita', 'es un lompa de puma', [brands[0]], sizes[0], '42', callback);
        },
        ],
        // optional callback
        cb);
}

function createShirts(cb) {
  async.parallel([
      function(callback) {
        shirtCreate('reme nike', 'es una reme de nike', [brands[0]], sizes[0], '42', callback);
      },
      function(callback) {
        shirtCreate('reme adida', 'es un reme adida', [brands[0]], sizes[0], '42', callback);
      },
      function(callback) {
        shirtCreate('reme nashe nike', 'es un reme de nike', [brands[0]], sizes[0], '42', callback);
      },
      function(callback) {
        shirtCreate('reme pumita', 'es un reme de puma', [brands[0]], sizes[0], '42', callback);
      },
      ],
      // optional callback
      cb);
}


function createSizes(cb) {
  async.parallel([
      function(callback) {
        sizeCreate('XS', 'chikito', callback);
      },
      function(callback) {
        sizeCreate('S', 'chiko', callback);
      },
      function(callback) {
        sizeCreate('M', 'medium', callback);
      },
      function(callback) {
        sizeCreate('L', 'grande', callback);
      },
      function(callback) {
        sizeCreate('XL', 'bokita', callback);
      },
      ],
      // optional callback
      cb);
}


async.series([
    createBrands,
    createSizes,
    createPants,
    createShirts,
],
// Optional callback
function(err, results) {
    if (err) {
      console.log('FINAL ERR: '+err);
    }
    else {
      console.log('no errors');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




