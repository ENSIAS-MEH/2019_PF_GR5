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
      category: {
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
      urlImage: {
        type: String,
        required: false
      }
    }),
    required: true
  },
  professional: {
    type: new mongoose.Schema({
      biographie: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 5000
      },
      isProfessionnel: Boolean,
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
      },
      password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        unique: true
      },
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
      category: {
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
      address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
      },
      review: {
        type: Number,
        required: true
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
      password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        unique: true
      },
      isAdmin: Boolean,
      isProfessionnel: Boolean,
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
      address: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 1000
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
    required: true
  },
  status: {
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

demandsSchema.statics.lookup = function(professionalId) {
  return this.findOne({
    "professional._id": professionalId
  });
};

function validateDemand(demand) {
  const schema = {
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    professionalId: Joi.objectId().required(),
    userId: Joi.objectId().required(),
    subcategoryId: Joi.objectId().required(),
    totalFee: Joi.number().required(),
    totalHours: Joi.number().required(),
    address: Joi.string()
      .min(5)
      .max(1000)
  };
  return Joi.validate(demand, schema);
}

module.exports.Demand = Demand;
module.exports.validateDemand = validateDemand;
module.exports.demandsSchema = demandsSchema;
