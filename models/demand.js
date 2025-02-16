const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class

var Schema = mongoose.Schema;

const demandsSchema = new Schema({
  subcategory: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
      },
      description: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 5000
      },
      urlImage: {
        type: String,
        required: false
      }
    }),
    required: true
  },
  professionnel: {
    type: new mongoose.Schema({
      urlImage: {
        type: String,
        required: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
      },
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
      },
      fee: {
        type: Number,
        required: true
      }
    }),
    required: true
  },
  user: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
      }
    }),
    required: true
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1000
  },
  totalFee: {
    type: Number,
    default: 0,
    required: true
  },
  demandstatus: {
    type: String,
    required: true,
    default: "In progress",
    minlength: 5,
    maxlength: 1000
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  endDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  totalHours: {
    type: Number,
    default: 0,
    required: true
  }
});

const Demand = mongoose.model("Demand", demandsSchema);

demandsSchema.statics.lookup = function(subcategoryId) {
  return this.findOne({
    "subcategory._id": subcategoryId
  });
};

demandsSchema.statics.lookup = function(userId) {
  return this.findOne({
    "user._id": userId
  });
};

demandsSchema.statics.lookup = function(professionnelId) {
  return this.findOne({
    "professionnel._id": professionnelId
  });
};

function diffhours(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

function validateDemand(demand) {
  const schema = {
    startDate: Joi.date()
      .iso()
      .required(),
    endDate: Joi.date()
      .iso()
      .required(),
    professionnelId: Joi.objectId().required(),
    userId: Joi.objectId().required(),
    subcategoryId: Joi.objectId().required(),
    totalFee: Joi.number().required(),
    totalHours: Joi.number().required(),
    address: Joi.string()
      .min(5)
      .max(1000),
    demandstatus: Joi.string().required()
  };
  return Joi.validate(demand, schema);
}

module.exports.Demand = Demand;
module.exports.validateDemand = validateDemand;
module.exports.demandsSchema = demandsSchema;
