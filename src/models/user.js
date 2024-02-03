const { Schema, model } = require('mongoose');

// Admin
const adminSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});


// End user
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  ph: { type: String },
  wallet: { type: Number, default: 0 }, // Assuming wallet is an integer
  taxID: { type: String },
  workID: { type: String },
  password: { type: String, required: true },
  
  purchases: [{
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String }, // Added field for serviceName
    cardId: { type: Schema.Types.ObjectId, required: true },
    cardName: { type: String }, // Added field for cardName
    cardPrice: { type: String }, // Added field for cardprice
    codeId: { type: Schema.Types.ObjectId, required: true },
    PIN: { type: String }, // Added field for PIN
    SERIAL: { type: String }, // Added field for SERIAL
    dateOfPurchase: { type: Date, default: Date.now },
  }],
});
// Code schema
const codeSchema = new Schema({
  pin: { type: String, required: true, unique: true },
  serial: { type: String, required: true, unique: true },
  usedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
});

// Card schema
const cardSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  endPrice: { type: Number, required: true },
  Inuse: { type: Number, default: 0 }, // cards already bought
  quantity: { type: Number, default: 0 }, // available cards
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  codes: [{ type: Schema.Types.ObjectId, ref: 'Code' }], // its length is equal to all cards (sold and un-sold)
  createdAt: { type: Date, default: Date.now },
});

// const cardSchema = new Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   endPrice: { type: Number, required: true },
//   Inuse: { type: Number, default: 0 },
//   service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
//   codes: [{ type: Schema.Types.ObjectId, ref: 'Code' }],
//   createdAt: { type: Date, default: Date.now },
//   // Include the 'quantity' field directly in the document
//   quantity: {
//     type: Number,
//     default: function () {
//       // 'this' refers to the document
//       return this.codes.length - this.Inuse;
//     },
//     // Ensure 'quantity' is included in the JSON representation
//     get: function () {
//       return this.codes.length - this.Inuse;
//     },
//   },
// });

// Add a unique index on the combination of 'name' and 'service'
cardSchema.index({ name: 1, service: 1 }, { unique: true });

// Service schema
const serviceSchema = new Schema({
  name: { type: String, unique: true, required: true },
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  createdAt: { type: Date, default: Date.now },
});

// Models
const Admin = model('Admin', adminSchema);
const User = model('User', userSchema);
const Code = model('Code', codeSchema);
const Card = model('Card', cardSchema);
const Service = model('Service', serviceSchema);

module.exports = {
  Admin,
  User,
  Code,
  Card,
  Service,
};

